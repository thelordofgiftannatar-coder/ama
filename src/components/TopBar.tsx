import React from 'react';
import {
  Menu,
  Search,
  LayoutGrid,
  Rows3,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Cloud,
  Sparkles,
} from 'lucide-react';
import { AppSettings } from '../types';

interface TopBarProps {
  onOpenDrawer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: () => void;
  onOpenSortModal: () => void;
  onOpenFilterModal: () => void;
  onOpenAiGenerator: () => void;
  onOpenAccountModal: () => void;
  settings: AppSettings;
  activeFilterCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenDrawer,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  onOpenSortModal,
  onOpenFilterModal,
  onOpenAiGenerator,
  onOpenAccountModal,
  settings,
  activeFilterCount,
}) => {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 pb-2 transition-all">
      {/* Search & Actions Bar matching Screenshot_20261110-175943_e513a2b8.png */}
      <div className="flex items-center gap-2 bg-[#25221d]/90 backdrop-blur-md text-[#e6e2de] rounded-full px-3.5 py-2 border border-[#3d372e] shadow-lg max-w-4xl mx-auto">
        {/* Hamburger Menu button */}
        <button
          onClick={onOpenDrawer}
          className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="flex-1 flex items-center min-w-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Keep"
            className="w-full bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none px-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Quick Generator Button */}
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-medium border border-amber-500/30 transition shrink-0"
          title="AI 4K Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">AI 4K</span>
        </button>

        {/* Grid / List Layout toggle */}
        <button
          onClick={onToggleViewMode}
          className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
        >
          {viewMode === 'grid' ? (
            <Rows3 className="w-5 h-5" />
          ) : (
            <LayoutGrid className="w-5 h-5" />
          )}
        </button>

        {/* Sort Modal Button */}
        <button
          onClick={onOpenSortModal}
          className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          title="Sort notes"
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>

        {/* Filter / Sliders Button */}
        <button
          onClick={onOpenFilterModal}
          className="relative p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          title="Filter notes"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#25221d]" />
          )}
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenAccountModal}
          className="relative rounded-full ring-2 ring-amber-500/40 hover:ring-amber-400 transition ml-0.5 shrink-0"
          title={settings.userAccount.email}
        >
          <img
            src={settings.userAccount.avatar}
            alt={settings.userAccount.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
