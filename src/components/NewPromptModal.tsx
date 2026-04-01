import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Prompt, Folder } from '../types';
import { Language, translations } from '../translations';

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id' | 'date'>) => void;
  folders: Folder[];
  initialFolderId?: string | null;
  initialData?: Prompt | null;
  language: Language;
}

export const NewPromptModal: React.FC<NewPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  folders,
  initialFolderId,
  initialData,
  language
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [folderId, setFolderId] = useState<string | undefined>(initialFolderId || undefined);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSystemPrompt(initialData.systemPrompt);
      setUserPrompt(initialData.userPrompt);
      setTags(initialData.tags || []);
      setFolderId(initialData.folderId);
    } else {
      setTitle('');
      setDescription('');
      setSystemPrompt('');
      setUserPrompt('');
      setTags([]);
      setFolderId(initialFolderId || undefined);
    }
  }, [initialData, initialFolderId, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    onSave({
      title,
      description,
      systemPrompt,
      userPrompt,
      tags,
      folderId,
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
          >
            <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? t.edit : t.newPrompt}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.title}</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.title}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.folderLabel}</label>
                  <select
                    value={folderId || ''}
                    onChange={(e) => setFolderId(e.target.value || undefined)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="" className="bg-white dark:bg-[#1a1d23]">{t.none}</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id} className="bg-white dark:bg-[#1a1d23]">{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.description}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.description}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.systemPrompt}</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="设定 AI 的角色和行为规范..."
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.userPrompt}</label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="输入具体的任务指令，可以使用 {{variable}} 作为占位符..."
                  rows={6}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.tagsLabel}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded text-xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-800 dark:hover:text-blue-200">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={t.tagsLabel}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        if (!tags.includes(tagInput.trim())) {
                          setTags([...tags, tagInput.trim()]);
                        }
                        setTagInput('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-sm transition-colors"
                  >
                    {t.add}
                  </button>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#16191e] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-semibold transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} />
                {initialData ? t.save : t.new}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
