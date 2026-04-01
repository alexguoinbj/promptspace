import React from 'react';
import { X, Download, Upload, Type, Globe, Shield, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onReset: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onExport, 
  onImport,
  fontSize,
  onFontSizeChange,
  onReset,
  language,
  onLanguageChange
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
        >
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.settings}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
            {/* Data Management */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <Shield size={14} />
                <span>{t.exportData} / {t.importData}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onExport}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all gap-2 group"
                >
                  <Download className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.exportData}</span>
                </button>
                <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all gap-2 group cursor-pointer">
                  <Upload className="text-purple-500 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.importData}</span>
                  <input type="file" accept=".json" onChange={onImport} className="hidden" />
                </label>
              </div>
            </section>

            {/* Appearance */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <Type size={14} />
                <span>{t.fontSize}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t.fontSize}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onFontSizeChange(Math.max(12, fontSize - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-mono w-8 text-center">{fontSize}px</span>
                    <button 
                      onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Language */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <Globe size={14} />
                <span>{t.language}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.language}</span>
                <select 
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-sm font-medium text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
                >
                  <option value="zh">简体中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500/60">
                <Trash2 size={14} />
                <span>{t.dangerZone}</span>
              </div>
              <button 
                onClick={onReset}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20 hover:bg-red-500/5 transition-colors group"
              >
                <span className="text-sm text-red-500">{t.resetData}</span>
                <ChevronRight size={16} className="text-red-500/40 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Check size={18} />
              {t.confirm}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
