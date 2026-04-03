import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PromptList } from './components/PromptList';
import { PromptDetail } from './components/PromptDetail';
import { NewPromptModal } from './components/NewPromptModal';
import { NewFolderModal } from './components/NewFolderModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { MOCK_PROMPTS, Prompt, Folder } from './types';
import { Language, translations } from './translations';
import { api } from './api';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'prompt' | 'folder' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState<Language>('zh');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const t = translations[language];

  // Supabase 会话管理
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setUser({ email: session.user.email });
      }
      setIsAuthInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user.email) {
        setUser({ email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 初始化获取数据
  useEffect(() => {
    if (!isAuthInitialized) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedFolders, fetchedPrompts] = await Promise.all([
          api.getFolders(),
          api.getPrompts()
        ]);
        setFolders(fetchedFolders);
        setPrompts(fetchedPrompts);
        if (fetchedPrompts.length > 0) {
          setSelectedId(fetchedPrompts[0].id);
        } else {
          setSelectedId('');
        }
      } catch (err) {
        console.error('Failed to init data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.email, isAuthInitialized]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const filteredPrompts = prompts.filter(p => {
    if (showFavorites && !p.isFavorite) return false;
    if (selectedFolderId && p.folderId !== selectedFolderId) return false;
    if (selectedTag && !(p.tags || []).includes(selectedTag)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query) ||
             p.systemPrompt.toLowerCase().includes(query) ||
             p.userPrompt.toLowerCase().includes(query);
    }
    return true;
  });

  const selectedPrompt = prompts.find(p => p.id === selectedId);
  const editingPrompt = prompts.find(p => p.id === editingPromptId);

  // Auto-select first prompt in filtered list if current selection is not in it
  React.useEffect(() => {
    if (filteredPrompts.length > 0 && !filteredPrompts.find(p => p.id === selectedId)) {
      setSelectedId(filteredPrompts[0].id);
    }
  }, [filteredPrompts, selectedId]);

  const handleSavePrompt = async (newPromptData: Omit<Prompt, 'id' | 'date'>) => {
    try {
      if (editingPromptId) {
        const updated = await api.updatePrompt(editingPromptId, newPromptData);
        setPrompts(prev => prev.map(p => p.id === editingPromptId ? updated : p));
        setEditingPromptId(null);
      } else {
        const promptToCreate = {
          ...newPromptData,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
          }).replace(/\//g, '-'), // 避免后端不识别日期格式
          folderId: selectedFolderId || undefined,
        };
        const created = await api.createPrompt(promptToCreate);
        setPrompts([created, ...prompts]);
        setSelectedId(created.id);
      }
    } catch (e) {
      console.error(e);
      alert('保存失败');
    }
  };

  const handleEditPrompt = (id: string) => {
    setEditingPromptId(id);
    setIsModalOpen(true);
  };

  const handleSaveFolder = async (name: string, color: string) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      const newFolder = await api.createFolder({ id, name, color });
      setFolders([...folders, newFolder]);
    } catch (e) {
      console.error(e);
      alert('保存文件夹失败');
    }
  };

  const handleDeleteFolder = (id: string) => {
    setDeleteType('folder');
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleToggleFavorite = async (id: string) => {
    const p = prompts.find(x => x.id === id);
    if (!p) return;
    try {
      const updated = await api.updatePrompt(id, { isFavorite: !p.isFavorite });
      setPrompts(prev => prev.map(item => item.id === id ? updated : item));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setDeleteType('prompt');
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    try {
      if (deleteType === 'prompt') {
        await api.deletePrompt(itemToDelete);
        setPrompts(prev => prev.filter(p => p.id !== itemToDelete));
        if (selectedId === itemToDelete) {
          setSelectedId(filteredPrompts.find(p => p.id !== itemToDelete)?.id || '');
        }
      } else if (deleteType === 'folder') {
        await api.deleteFolder(itemToDelete);
        setFolders(prev => prev.filter(f => f.id !== itemToDelete));
        setPrompts(prev => prev.map(p => p.folderId === itemToDelete ? { ...p, folderId: undefined } : p));
        if (selectedFolderId === itemToDelete) {
          setSelectedFolderId(null);
        }
      }
    } catch(e) {
      console.error(e);
      alert('删除失败');
    }

    setItemToDelete(null);
    setDeleteType(null);
    setIsDeleteModalOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleExportData = () => {
    const data = JSON.stringify({ prompts, folders }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 省略复杂实现，需改写为批量调用后端API，这里简单处理
    alert('暂不支持从带有后端的版本直接导入本地文件，请使用数据库迁移工具。');
  };

  const handleResetData = () => {
    if (window.confirm(t.resetConfirm)) {
      alert('暂不支持在这重置云端数据，请操作数据库。');
    }
  };

  if (!isAuthInitialized || isLoading) {
    return (
      <div className="flex h-full w-full bg-[#f8f9fa] dark:bg-[#0a0c10] items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {language === 'zh' ? '正在加载数据...' : 'Loading data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] dark:bg-[#0a0c10] text-gray-900 dark:text-gray-200 overflow-hidden selection:bg-blue-500/30 selection:text-blue-200 transition-colors duration-300">
      <Sidebar 
        onNew={() => {
          setEditingPromptId(null);
          setIsModalOpen(true);
        }} 
        onNewFolder={() => setIsFolderModalOpen(true)}
        onDeleteFolder={handleDeleteFolder}
        folders={folders}
        prompts={prompts}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        showFavorites={showFavorites}
        onShowFavorites={setShowFavorites}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={() => setIsLoginModalOpen(true)}
        user={user}
        onLogout={async () => {
          await supabase.auth.signOut();
          setUser(null);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        language={language}
      />
      <PromptList 
        prompts={filteredPrompts} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        language={language}
      />
      <PromptDetail 
        prompt={selectedPrompt} 
        onNew={() => {
          setEditingPromptId(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEditPrompt}
        onDelete={handleDeletePrompt}
        onToggleFavorite={handleToggleFavorite}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        fontSize={fontSize}
        language={language}
        onLanguageChange={setLanguage}
      />

      <NewPromptModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromptId(null);
        }} 
        onSave={handleSavePrompt}
        folders={folders}
        initialFolderId={selectedFolderId}
        initialData={editingPrompt}
        language={language}
      />

      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleSaveFolder}
        language={language}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
          setDeleteType(null);
        }}
        onConfirm={confirmDelete}
        title={deleteType === 'folder' ? t.deleteFolderTitle : t.deleteConfirmTitle}
        message={deleteType === 'folder' ? t.deleteFolderDesc : t.deleteConfirmDesc}
        language={language}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(email) => {
          setUser({ email });
          setIsLoginModalOpen(false);
        }}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onReset={handleResetData}
        language={language}
        onLanguageChange={setLanguage}
      />
    </div>
  );
}
