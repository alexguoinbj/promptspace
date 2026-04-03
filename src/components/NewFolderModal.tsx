import React, { useState } from 'react';
import { X, FolderPlus, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../translations';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  language: Language;
}

const COLORS = [
  { name: 'Blue', value: 'text-blue-400', bg: 'bg-blue-400' },
  { name: 'Orange', value: 'text-orange-400', bg: 'bg-orange-400' },
  { name: 'Yellow', value: 'text-yellow-400', bg: 'bg-yellow-400' },
  { name: 'Purple', value: 'text-purple-400', bg: 'bg-purple-400' },
  { name: 'Pink', value: 'text-pink-400', bg: 'bg-pink-400' },
  { name: 'Green', value: 'text-green-400', bg: 'bg-green-400' },
  { name: 'Red', value: 'text-red-400', bg: 'bg-red-400' },
  { name: 'Cyan', value: 'text-cyan-400', bg: 'bg-cyan-400' },
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onSave, language }) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave(name.trim(), selectedColor);
    setName('');
    setSelectedColor(COLORS[0].value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
          >
            <div className="p-8 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FolderPlus size={32} className="text-blue-500" />
                {t.newFolder}
              </h2>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[19px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.folderLabel}</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.folderLabel}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4 text-[21px] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[19px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-3">
                  <Palette size={20} />
                  {t.selectColor}
                </label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full ${color.bg} transition-all transform hover:scale-110 ${
                        selectedColor === color.value ? 'ring-4 ring-blue-500 ring-offset-4 dark:ring-offset-[#1a1d23]' : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#16191e] flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl text-[21px] font-bold transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-[21px] font-bold transition-all shadow-xl shadow-blue-600/20"
              >
                {t.new}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
