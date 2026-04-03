import React, { useState } from 'react';
import { 
  LayoutGrid,
  Clock, 
  Tag, 
  Copy, 
  Play, 
  History, 
  Trash2, 
  Plus, 
  Sun, 
  Moon,
  Settings, 
  Star, 
  Edit,
  Share2,
  Globe,
  Check
} from 'lucide-react';
import { Prompt } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../translations';

interface PromptDetailProps {
  prompt?: Prompt;
  onNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  fontSize?: number;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  className?: string;
}

export const PromptDetail: React.FC<PromptDetailProps> = ({ 
  prompt, 
  onNew, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  theme = 'dark',
  onToggleTheme,
  onOpenSettings,
  fontSize = 14,
  language,
  onLanguageChange,
  className 
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!prompt) return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-8 bg-[#f8f9fa] dark:bg-[#1a1d23]">
      <LayoutGrid size={64} className="opacity-10" />
      <span className="text-[21px] font-medium">{t.selectPrompt}</span>
      <button 
        onClick={onNew}
        className="flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[21px] font-bold transition-all shadow-xl shadow-blue-600/20"
      >
        <Plus size={24} />
        {t.newPrompt}
      </button>
    </div>
  );

  return (
    <div className={cn("flex-1 bg-[#f8f9fa] dark:bg-[#1a1d23] flex flex-col h-full overflow-hidden", className)}>
      {/* Header */}
      <div className="p-8 border-b border-gray-200 dark:border-white/5 flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{prompt.title}</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onToggleFavorite?.(prompt.id)}
                className={cn(
                  "p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors",
                  prompt.isFavorite ? "text-yellow-500" : "text-gray-400"
                )}
              >
                <Star size={20} className={prompt.isFavorite ? "fill-yellow-500" : ""} />
              </button>
              <button 
                onClick={() => onEdit?.(prompt.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl">{prompt.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{prompt.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {prompt.tags && prompt.tags.length > 0 ? (
              prompt.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-colors">
                  # {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-600 italic">{t.none}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1">
            <button 
              onClick={() => onLanguageChange?.('zh')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                language === 'zh' 
                  ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              中
            </button>
            <button 
              onClick={() => onLanguageChange?.('en')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                language === 'en' 
                  ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              EN
            </button>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleTheme?.();
            }}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors flex items-center justify-center"
            title={theme === 'light' ? t.darkMode : t.lightMode}
            type="button"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-500" />}
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* System Prompt */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.systemPrompt}</h2>
          </div>
          <div 
            className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 font-mono leading-relaxed text-gray-700 dark:text-gray-300"
            style={{ fontSize: `${fontSize}px` }}
          >
            {prompt.systemPrompt}
          </div>
        </div>

        {/* User Prompt */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.userPrompt}</h2>
            <span className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Markdown</span>
          </div>
          <div 
            className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 font-mono leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
            style={{ fontSize: `${fontSize}px` }}
          >
            {prompt.userPrompt}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#16191e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              const text = [prompt.systemPrompt, prompt.userPrompt].filter(Boolean).join('\n\n');
              try {
                if (navigator.clipboard && window.isSecureContext) {
                  await navigator.clipboard.writeText(text);
                } else {
                  const textArea = document.createElement("textarea");
                  textArea.value = text;
                  textArea.style.position = "fixed";
                  textArea.style.left = "-9999px";
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  document.execCommand('copy');
                  textArea.remove();
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold transition-all"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? (language === 'zh' ? '已复制' : 'Copied') : t.copyPrompt}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onDelete?.(prompt.id)}
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl transition-colors"
          >
            <Trash2 size={18} />
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
};
