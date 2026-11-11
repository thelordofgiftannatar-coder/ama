import React from 'react';
import { Check, X } from 'lucide-react';

export type SortOption = 'custom' | 'created' | 'modified' | 'title';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  isOpen,
  onClose,
  selectedSort,
  onSelectSort,
}) => {
  if (!isOpen) return null;

  const options: { id: SortOption; label: string }[] = [
    { id: 'custom', label: 'Custom (Default)' },
    { id: 'created', label: 'Date created' },
    { id: 'modified', label: 'Date modified' },
    { id: 'title', label: 'Title (A - Z)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet matching Screenshot_20261110-180050_00dba75f.png */}
      <div className="relative w-full max-w-lg mx-auto bg-[#1a1714] border-t border-[#3b342e] rounded-t-3xl p-6 shadow-2xl z-10 text-white space-y-4">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-3" />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Sort by</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {options.map((opt) => {
            const isSelected = selectedSort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectSort(opt.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-[#7c4a03] text-amber-100 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isSelected ? (
                  <Check className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                ) : (
                  <span className="w-4" />
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
