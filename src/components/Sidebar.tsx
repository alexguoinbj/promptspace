import React from 'react';
import {
  LayoutGrid,
  Star,
  Folder,
  Plus,
  Tag,
  ExternalLink,
  Settings,
  ChevronRight,
  Code,
  User,
  Image as ImageIcon,
  Film,
  PenTool,
  Moon,
  Sun,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

import { Folder as FolderType, Prompt } from '../types';
import { Language, translations } from '../translations';

interface SidebarProps {
  onNew?: () => void;
  onNewFolder?: () => void;
  onDeleteFolder?: (id: string) => void;
  folders: FolderType[];
  prompts: Prompt[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  showFavorites: boolean;
  onShowFavorites: (show: boolean) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLogin?: () => void;
  user?: { email: string } | null;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  language: Language;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNew,
  onNewFolder,
  onDeleteFolder,
  prompts,
  folders,
  selectedFolderId,
  onSelectFolder,
  selectedTag,
  onSelectTag,
  showFavorites,
  onShowFavorites,
  theme = 'dark',
  onToggleTheme,
  onLogin,
  user,
  onLogout,
  onOpenSettings,
  language,
  className
}) => {
  const t = translations[language];
  // Extract unique tags from all prompts
  const allTags: string[] = Array.from(new Set(prompts.flatMap(p => p.tags || []) as string[])).sort();

  const getFolderPromptCount = (folderId: string | null) => {
    if (folderId === null) return prompts.length;
    return prompts.filter(p => p.folderId === folderId).length;
  };

  const handleSelectAll = () => {
    onSelectFolder(null);
    onShowFavorites(false);
    onSelectTag(null);
  };

  const handleSelectFavorites = () => {
    onShowFavorites(true);
    onSelectFolder(null);
    onSelectTag(null);
  };

  const handleSelectFolder = (id: string) => {
    onSelectFolder(id);
    onShowFavorites(false);
    onSelectTag(null);
  };

  const handleSelectTag = (tag: string) => {
    if (selectedTag === tag) {
      onSelectTag(null);
    } else {
      onSelectTag(tag);
      onSelectFolder(null);
      onShowFavorites(false);
    }
  };

  return (
    <div className={cn("w-80 bg-white dark:bg-[#0f1115] border-r border-gray-200 dark:border-white/5 flex flex-col h-full text-gray-500 dark:text-gray-400 transition-colors duration-300", className)}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <span className="text-gray-900 dark:text-white font-semibold text-lg">{t.appName}</span>
      </div>

      {/* Main Nav */}
      <div className="px-3 space-y-1">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-all mb-6"
        >
          <Plus size={24} />
          <span className="text-[21px] font-bold">{t.newPrompt}</span>
        </button>
        <button
          onClick={handleSelectAll}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
            (selectedFolderId === null && !showFavorites) ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"
          )}
        >
          <LayoutGrid size={24} />
          <span className="text-[21px] font-medium">{t.allPrompts}</span>
          <span className="ml-auto text-sm opacity-50">{getFolderPromptCount(null)}</span>
        </button>
        <button
          onClick={handleSelectFavorites}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
            showFavorites ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"
          )}
        >
          <Star size={24} className={showFavorites ? "text-yellow-500 fill-yellow-500" : ""} />
          <span className="text-[21px] font-medium">{t.favorites}</span>
          <span className="ml-auto text-sm opacity-50">{prompts.filter(p => p.isFavorite).length}</span>
        </button>
      </div>

      {/* Folders */}
      <div className="mt-8 px-6 flex items-center justify-between group cursor-pointer">
        <span className="text-[21px] font-semibold uppercase tracking-wider opacity-50">{t.folders}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewFolder?.();
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors"
        >
          <Plus size={14} className="opacity-50 hover:opacity-100 transition-opacity" />
        </button>
      </div>
      <div className="mt-2 px-3 space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => handleSelectFolder(folder.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group",
              selectedFolderId === folder.id ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-white/5"
            )}
          >
            <Folder size={24} className={folder.color || 'text-gray-400'} />
            <span className="text-[21px] font-medium truncate flex-1 text-left">{folder.name}</span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm opacity-50 group-hover:hidden">{getFolderPromptCount(folder.id)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder?.(folder.id);
                }}
                className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title={t.delete}
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight size={18} className={cn("transition-opacity hidden group-hover:block", selectedFolderId === folder.id ? "opacity-100" : "opacity-50")} />
            </div>
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-10 px-8">
        <span className="text-[21px] font-semibold uppercase tracking-wider opacity-50">{t.tags}</span>
        <span
          onClick={() => onSelectTag(null)}
          className="ml-3 text-[21px] text-blue-600 dark:text-blue-500 cursor-pointer hover:underline"
        >
          {t.allTags} {allTags.length}
        </span>
      </div>
      <div className="mt-4 px-6 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <span
            key={tag}
            onClick={() => handleSelectTag(tag)}
            className={cn(
              "px-2 py-1 rounded text-xs cursor-pointer transition-colors",
              selectedTag === tag
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
            )}
          >
            # {tag}
          </span>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto p-4 space-y-1">
        {user ? (
          <div className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[19px] font-medium truncate">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-[19px] text-red-500 hover:underline ml-2"
            >
              {t.logout}
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-blue-600 dark:text-blue-400"
          >
            <User size={24} />
            <span className="text-[21px] font-medium">{t.login}</span>
          </button>
        )}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
          title={theme === 'light' ? t.darkMode : t.lightMode}
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          <span className="text-[21px] font-medium">{theme === 'light' ? t.darkMode : t.lightMode}</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
        >
          <Settings size={24} />
          <span className="text-[21px] font-medium">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};
