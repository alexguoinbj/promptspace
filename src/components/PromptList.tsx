import React, { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, Columns, Star } from 'lucide-react';
import { Prompt } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../translations';

type ViewMode = 'grid' | 'columns' | 'list';

interface PromptListProps {
  prompts: Prompt[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  language: Language;
  className?: string;
}

export const PromptList: React.FC<PromptListProps> = ({ 
  prompts, 
  selectedId, 
  onSelect, 
  searchQuery,
  onSearchChange,
  language,
  className 
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className={cn("w-80 bg-white dark:bg-[#16191e] border-r border-gray-200 dark:border-white/5 flex flex-col h-full transition-colors duration-300", className)}>
      {/* Search */}
      <div className="p-4 relative group">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 dark:text-gray-500" size={16} />
          <input 
            id="search-input"
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-10 text-base text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <span className="text-lg">&times;</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center justify-between text-gray-400 border-b border-gray-200 dark:border-white/5">
        <span className="text-xl font-medium">
          {prompts.length > 0 ? `${prompts.length} ${t.appName}` : t.noPrompts}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1.5 rounded-lg">
            <button onClick={() => setViewMode('grid')} className="p-1 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-white/10" title={language === 'zh' ? '卡片视图' : 'Grid view'}>
              <LayoutGrid size={18} className={viewMode === 'grid' ? 'text-blue-500' : 'text-gray-400 opacity-50'} />
            </button>
            <button onClick={() => setViewMode('columns')} className="p-1 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-white/10" title={language === 'zh' ? '紧凑视图' : 'Compact view'}>
              <Columns size={18} className={viewMode === 'columns' ? 'text-blue-500' : 'text-gray-400 opacity-50'} />
            </button>
            <button onClick={() => setViewMode('list')} className="p-1 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-white/10" title={language === 'zh' ? '列表视图' : 'List view'}>
              <List size={18} className={viewMode === 'list' ? 'text-blue-500' : 'text-gray-400 opacity-50'} />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className={cn(
        "flex-1 overflow-y-auto p-2",
        viewMode === 'grid' ? 'space-y-2' : viewMode === 'columns' ? 'space-y-1' : 'space-y-0.5'
      )}>
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8 text-center gap-4">
            <LayoutGrid size={40} className="opacity-20" />
            <p className="text-xl font-medium">{t.noPrompts}</p>
          </div>
        ) : (
          prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onSelect(prompt.id)}
              className={cn(
                "w-full text-left transition-all group relative",
                viewMode === 'grid' ? 'p-4 rounded-xl' : viewMode === 'columns' ? 'p-3 rounded-lg' : 'px-3 py-2 rounded-md',
                selectedId === prompt.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className={cn(
                  "font-semibold",
                  viewMode === 'list' ? 'text-sm' : 'text-[19px]',
                  selectedId === prompt.id ? "text-white" : "text-gray-900 dark:text-gray-200"
                )}>
                  {prompt.title}
                </h3>
                {prompt.isFavorite && (
                  <Star size={viewMode === 'list' ? 12 : 14} className={selectedId === prompt.id ? "text-white" : "text-yellow-500 fill-yellow-500"} />
                )}
              </div>
              {viewMode !== 'list' && (
                <p className={cn("text-xs line-clamp-2 leading-relaxed opacity-80", selectedId === prompt.id ? "text-white" : "text-gray-500 dark:text-gray-400")}>
                  {prompt.description}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
