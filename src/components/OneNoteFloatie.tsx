import React, { useState } from 'react';
import { PenSquare, X, Check, Sparkles } from 'lucide-react';

interface OneNoteFloatieProps {
  onQuickSave: (title: string, text: string) => void;
  accentColor?: string;
}

export const OneNoteFloatie: React.FC<OneNoteFloatieProps> = ({
  onQuickSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || title.trim()) {
      onQuickSave(title.trim() || 'Quick Note', content.trim());
      setTitle('');
      setContent('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-2xl flex items-center justify-center border-2 border-purple-400/40 hover:scale-110 active:scale-95 transition-all group"
          title="OneNote Quick Floatie"
        >
          <PenSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
        </button>
      )}

      {/* Expanded Quick Float Note Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 max-w-[90vw] bg-[#1a1524] border border-purple-500/40 rounded-2xl shadow-2xl p-4 text-white space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-200">OneNote Floatie</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quick Title..."
              autoFocus
              className="w-full bg-black/40 border border-purple-900/50 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot down a quick thought from anywhere..."
              rows={3}
              className="w-full bg-black/40 border border-purple-900/50 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1 shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
