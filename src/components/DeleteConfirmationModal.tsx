import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Language, translations } from '../translations';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  language: Language;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  language
}) => {
  const t = translations[language];
  const displayTitle = title || t.deleteConfirmTitle;
  const displayMessage = message || t.deleteConfirmDesc;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{displayTitle}</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {displayMessage}
          </p>
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
};
