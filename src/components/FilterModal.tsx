import React from 'react';
import { X, Heart, Image, Film, Mic, CheckSquare, Tag, RotateCcw } from 'lucide-react';

export interface FilterState {
  onlyLiked: boolean;
  hasImages: boolean;
  hasVideos: boolean;
  hasVoice: boolean;
  hasChecklists: boolean;
  tag: string | null;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  allTags: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  allTags,
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof Omit<FilterState, 'tag'>) => {
    onChangeFilters({
      ...filters,
      [key]: !filters[key],
    });
  };

  const handleReset = () => {
    onChangeFilters({
      onlyLiked: false,
      hasImages: false,
      hasVideos: false,
      hasVoice: false,
      hasChecklists: false,
      tag: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-auto bg-[#1a1714] border-t border-[#3b342e] rounded-t-3xl p-6 shadow-2xl z-10 text-white space-y-4">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-2" />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Filter Notes & Media</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Types & Favorites
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Likes */}
            <button
              onClick={() => handleToggle('onlyLiked')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition ${
                filters.onlyLiked
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${filters.onlyLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`}
              />
              <span>Liked Notes Only</span>
            </button>

            {/* Photos & 4K */}
            <button
              onClick={() => handleToggle('hasImages')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition ${
                filters.hasImages
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Image className="w-4 h-4 text-amber-400" />
              <span>Has Photos / 4K</span>
            </button>

            {/* Videos */}
            <button
              onClick={() => handleToggle('hasVideos')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition ${
                filters.hasVideos
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Film className="w-4 h-4 text-purple-400" />
              <span>Has Videos</span>
            </button>

            {/* Voice Memos */}
            <button
              onClick={() => handleToggle('hasVoice')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition ${
                filters.hasVoice
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Mic className="w-4 h-4 text-blue-400" />
              <span>Has Voice Audio</span>
            </button>

            {/* Checklists */}
            <button
              onClick={() => handleToggle('hasChecklists')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition col-span-2 ${
                filters.hasChecklists
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Has Checklists</span>
            </button>
          </div>
        </div>

        {/* Filter by Label / Tag */}
        {allTags.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Filter by Label
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              <button
                onClick={() => onChangeFilters({ ...filters, tag: null })}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  filters.tag === null
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                All Labels
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeFilters({ ...filters, tag: t })}
                  className={`px-3 py-1.5 rounded-full text-xs transition ${
                    filters.tag === t
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#7c4a03] text-amber-100 font-bold text-sm shadow transition hover:bg-[#8d5404]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
