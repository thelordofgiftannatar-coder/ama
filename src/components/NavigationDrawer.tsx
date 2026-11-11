import React, { useState } from 'react';
import {
  Lightbulb,
  Bell,
  Heart,
  Tag,
  Plus,
  Archive,
  Trash2,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronDown,
  Check,
  ShieldCheck,
  Smartphone,
  Cloud,
} from 'lucide-react';
import { AppSettings } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  allTags: string[];
  onAddNewTag: (tag: string) => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  likedCount: number;
  onOpenAccountModal: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  selectedTag,
  onSelectTag,
  allTags,
  onAddNewTag,
  onOpenSettings,
  settings,
  likedCount,
  onOpenAccountModal,
}) => {
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  if (!isOpen) return null;

  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      onAddNewTag(newLabelName.trim());
      setNewLabelName('');
      setIsCreatingLabel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] h-full bg-[#141210] text-[#e3e1df] shadow-2xl flex flex-col z-10 border-r border-[#2d2822] overflow-y-auto">
        {/* Header / Account Section */}
        <div className="p-4 pt-6 border-b border-[#28221b] bg-[#1a1714]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-500 font-extrabold tracking-wide">Diario</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </h1>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile banner matching Screenshot_20261110-180023_d5ba66b6.png */}
          <div
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition group"
          >
            <div className="relative">
              <img
                src={settings.userAccount.avatar}
                alt={settings.userAccount.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1a1714] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                {settings.userAccount.name}
              </div>
              <div className="text-xs text-neutral-400 truncate">
                {settings.userAccount.email}
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform ${
                showAccountDropdown ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Account Submenu */}
          {showAccountDropdown && (
            <div className="mt-2 p-2 rounded-xl bg-[#221e1a] border border-[#3b342e] text-xs space-y-1">
              <button
                onClick={() => {
                  onOpenAccountModal();
                  setShowAccountDropdown(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white text-left transition"
              >
                <Cloud className="w-4 h-4 text-amber-400" />
                <span>Google Cloud Sync & Account</span>
              </button>
              <div className="flex items-center justify-between px-2 py-1.5 text-neutral-400">
                <span>Ad-Free Protection:</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-3 px-2 space-y-1">
          {/* Notes Item */}
          <button
            onClick={() => {
              onSelectView('notes');
              onSelectTag(null);
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition ${
              activeView === 'notes' && selectedTag === null
                ? 'bg-[#7c4a03] text-amber-100 font-semibold'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Notes</span>
          </button>

          {/* Reminders Item */}
          <button
            onClick={() => {
              onSelectView('reminders');
              onSelectTag(null);
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition ${
              activeView === 'reminders'
                ? 'bg-[#7c4a03] text-amber-100 font-semibold'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 text-neutral-400" />
            <span>Reminders</span>
          </button>

          {/* Likes / Favorites ("make it available to open likes") */}
          <button
            onClick={() => {
              onSelectView('likes');
              onSelectTag(null);
              onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition ${
              activeView === 'likes'
                ? 'bg-[#831843] text-pink-100 font-semibold'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30" />
              <span>Likes & Favorites</span>
            </div>
            {likedCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                {likedCount}
              </span>
            )}
          </button>

          {/* Section Divider */}
          <div className="my-3 border-t border-[#29241e]" />

          {/* Labels Section */}
          <div className="px-3 py-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <span>Labels</span>
            <button
              onClick={() => setIsCreatingLabel(true)}
              className="hover:text-amber-400 transition"
            >
              Edit
            </button>
          </div>

          {/* Existing labels */}
          <div className="space-y-0.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onSelectView('notes');
                  onSelectTag(tag);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm transition ${
                  selectedTag === tag
                    ? 'bg-[#7c4a03] text-amber-100 font-medium'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4 text-neutral-400" />
                <span className="truncate">{tag}</span>
              </button>
            ))}

            {/* Create new label input/button */}
            {isCreatingLabel ? (
              <form onSubmit={handleCreateLabel} className="px-2 pt-1">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-800/80 border border-neutral-700">
                  <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="New label name..."
                    autoFocus
                    className="w-full bg-transparent text-xs text-white px-2 py-1 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded hover:bg-amber-500/20 text-amber-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingLabel(false)}
                    className="p-1 rounded hover:bg-white/10 text-neutral-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreatingLabel(true)}
                className="w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create new label</span>
              </button>
            )}
          </div>

          {/* Section Divider */}
          <div className="my-3 border-t border-[#29241e]" />

          {/* Archive */}
          <button
            onClick={() => {
              onSelectView('archive');
              onSelectTag(null);
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm transition ${
              activeView === 'archive'
                ? 'bg-[#7c4a03] text-amber-100 font-medium'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Archive className="w-5 h-5 text-neutral-400" />
            <span>Archive</span>
          </button>

          {/* Trash */}
          <button
            onClick={() => {
              onSelectView('trash');
              onSelectTag(null);
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm transition ${
              activeView === 'trash'
                ? 'bg-[#7c4a03] text-amber-100 font-medium'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Trash2 className="w-5 h-5 text-neutral-400" />
            <span>Trash</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
            <span>Settings</span>
          </button>

          {/* Help & feedback */}
          <button
            onClick={() => {
              alert('Diario Help & Privacy Center\n\n- All notes and 4K media are stored locally & securely.\n- Cloud sync lets you sync with other devices using your sync token.\n- Ad shield blocks all banners and trackers.');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition"
          >
            <HelpCircle className="w-5 h-5 text-neutral-400" />
            <span>Help & feedback</span>
          </button>
        </div>

        {/* Footer / Account Sign Out */}
        <div className="p-4 border-t border-[#29241e] bg-[#1a1714]">
          <button
            onClick={() => {
              onOpenAccountModal();
              onClose();
            }}
            className="w-full flex items-center justify-between text-xs text-neutral-400 hover:text-neutral-200 transition"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-purple-400" />
              <span>Switch / Sign out</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Offline Ready
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
