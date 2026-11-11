import React, { useState } from 'react';
import { saveFile } from '../services/native';
import {
  ArrowLeft,
  Moon,
  Sun,
  Palette,
  Image as ImageIcon,
  Wallpaper,
  Upload,
  Sparkles,
  Cloud,
  Download,
  ShieldCheck,
  Smartphone,
  Info,
  Check,
  RefreshCw,
} from 'lucide-react';
import { AppSettings, WallpaperConfig } from '../types';
import { PRESET_WALLPAPERS, storage } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenAiGenerator: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenAiGenerator,
}) => {
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const updateDisplay = (key: keyof AppSettings['displayOptions'], val: any) => {
    onUpdateSettings({
      ...settings,
      displayOptions: {
        ...settings.displayOptions,
        [key]: val,
      },
    });
  };

  const handleApplyPresetWallpaper = (wp: WallpaperConfig) => {
    onUpdateSettings({
      ...settings,
      wallpaper: wp,
    });
  };

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        onUpdateSettings({
          ...settings,
          wallpaper: {
            id: `custom_${Date.now()}`,
            name: file.name,
            type: file.type.includes('gif') ? 'gif' : 'custom',
            url,
            dim: 50,
            blur: 4,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = async () => {
    try {
      const json = await storage.exportFullBackup();
      const blob = new Blob([json], { type: 'application/json' });
      await saveFile(`diario-full-backup-${new Date().toISOString().slice(0, 10)}.json`, blob);
      setExportNotice('Export complete! Full JSON data downloaded.');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const success = await storage.restoreFullBackup(reader.result as string);
        if (success) {
          alert('Backup restored successfully! Refreshing...');
          window.location.reload();
        } else {
          alert('Failed to parse backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Backing up data & settings to cloud server...');
    const res = await storage.syncToCloud(settings.userAccount.syncKey);
    setIsSyncing(false);
    setSyncStatusMsg(res.message);
    setTimeout(() => setSyncStatusMsg(null), 3500);
  };

  const handleRestoreFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Retrieving data & settings from cloud...');
    const res = await storage.restoreFromCloud(settings.userAccount.syncKey);
    setIsSyncing(false);
    if (res.success) {
      alert('Cloud restore successful! Reloading data...');
      window.location.reload();
    } else {
      setSyncStatusMsg('Restore failed: ' + res.message);
      setTimeout(() => setSyncStatusMsg(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#141210] text-[#e3e1df] overflow-y-auto">
      {/* Header matching Screenshot_20261110-180042_7d4db370.png */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-4 bg-[#1a1714] border-b border-[#2d2720] shadow-md">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-8 pb-16">
        {/* ================= Display options ================= */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Display options</h3>

          {/* Add new items to bottom */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-200">Add new items to bottom</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.displayOptions.addNewItemsToBottom}
                onChange={(e) => updateDisplay('addNewItemsToBottom', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Move checked items to bottom */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-200">Move checked items to bottom</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.displayOptions.moveCheckedItemsToBottom}
                onChange={(e) => updateDisplay('moveCheckedItemsToBottom', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Display rich link previews */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-200">Display rich link previews</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.displayOptions.displayRichLinkPreviews}
                onChange={(e) => updateDisplay('displayRichLinkPreviews', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Theme Selector matching Screenshot_20261110-180042_7d4db370.png */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <span className="text-sm text-neutral-200">Theme</span>
            <select
              value={settings.theme}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  theme: e.target.value as any,
                })
              }
              className="bg-black/60 border border-neutral-700 text-xs text-neutral-300 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="amoled">AMOLED Pitch Black (Keep/OneNote)</option>
              <option value="dark">Dark Charcoal</option>
              <option value="onenote-purple">OneNote Dark Violet</option>
              <option value="light">Light Paper</option>
            </select>
          </div>
        </section>

        {/* ================= Custom Wallpapers & 4K / GIFs ================= */}
        <section className="space-y-4 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Wallpaper className="w-5 h-5 text-amber-400" />
                <span>Background Wallpaper & 4K</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Personalize with 4K wallpapers, animated GIFs, or generate with AI
              </p>
            </div>
            <button
              onClick={onOpenAiGenerator}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 4K Generator</span>
            </button>
          </div>

          {/* Wallpaper Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_WALLPAPERS.map((wp) => {
              const isSelected = settings.wallpaper?.id === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => handleApplyPresetWallpaper(wp)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all h-24 bg-neutral-900 ${
                    isSelected ? 'ring-2 ring-amber-500 border-transparent scale-[1.02]' : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  {wp.url ? (
                    <img
                      src={wp.thumbnail || wp.url}
                      alt={wp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                      AMOLED
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">{wp.name}</span>
                  </div>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 p-1 rounded-full bg-amber-500 text-black">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upload Custom Wallpaper / 4K / Animated GIF */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Upload Your Own Wallpaper (4K or GIF)</span>
              <label className="cursor-pointer px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
                <input
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleCustomWallpaperUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Blur & Dim Sliders */}
            {settings.wallpaper.url && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Background Blur</span>
                    <span>{settings.wallpaper.blur || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={settings.wallpaper.blur || 0}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        wallpaper: {
                          ...settings.wallpaper,
                          blur: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Dimming Overlay</span>
                    <span>{settings.wallpaper.dim || 40}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={settings.wallpaper.dim || 40}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        wallpaper: {
                          ...settings.wallpaper,
                          dim: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= Note creation ================= */}
        <section className="space-y-2 pt-2 border-t border-white/10">
          <h3 className="text-xl font-bold text-white tracking-tight">Note creation</h3>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm text-neutral-200 block">Create text notes by default</span>
              <span className="text-xs text-neutral-400 italic">
                You can always long press to create other note types.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.noteCreation.createTextNotesByDefault}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    noteCreation: { createTextNotesByDefault: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </section>

        {/* ================= Sharing ================= */}
        <section className="space-y-2 pt-2 border-t border-white/10">
          <h3 className="text-xl font-bold text-white tracking-tight">Sharing</h3>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-200">Enable sharing</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sharing.enableSharing}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    sharing: { enableSharing: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </section>

        {/* ================= Sticky Notes & Account ================= */}
        <section className="space-y-4 pt-2 border-t border-white/10">
          <h3 className="text-lg font-bold text-purple-400 tracking-tight">Sticky Notes</h3>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-white font-medium block">
                Primary Sticky Notes account
              </span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {settings.userAccount.email}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleExportData}
                className="text-left w-full hover:bg-white/5 p-2 rounded-xl transition"
              >
                <span className="text-sm text-white font-medium block">Export Data</span>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Information about exporting Sticky Notes data from your mailbox.
                </span>
              </button>
              {exportNotice && (
                <div className="text-xs text-emerald-400 mt-1 px-2">{exportNotice}</div>
              )}
            </div>

            {/* Import Backup */}
            <div className="pt-1">
              <label className="cursor-pointer text-left w-full hover:bg-white/5 p-2 rounded-xl transition block">
                <span className="text-sm text-white font-medium block">Restore from Backup File</span>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Select a previous JSON export file to restore notes and settings.
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* ================= Cross-Platform Cloud Synchronization ================= */}
        <section className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <h3 className="text-lg font-bold text-amber-400 tracking-tight flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <span>Cross-Platform Cloud Synchronization</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Seamlessly sync your notes, media, and settings across phone, tablet, and PC
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1e1b17] border border-[#3b342e] space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Your Cross-Device Sync Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.userAccount.syncKey}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      userAccount: {
                        ...settings.userAccount,
                        syncKey: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. billie_diario_sync"
                  className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none"
                />
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      userAccount: {
                        ...settings.userAccount,
                        syncKey: 'sync_' + Math.random().toString(36).substring(2, 9),
                      },
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-300"
                >
                  Generate New
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                <span>Sync to Cloud Now</span>
              </button>

              <button
                onClick={handleRestoreFromCloud}
                disabled={isSyncing}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Restore from Key</span>
              </button>
            </div>

            {syncStatusMsg && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-medium">
                {syncStatusMsg}
              </div>
            )}
          </div>
        </section>

        {/* ================= Notebooks Settings ================= */}
        <section className="space-y-4 pt-2 border-t border-white/10">
          <h3 className="text-lg font-bold text-purple-400 tracking-tight">Notebooks</h3>

          {/* Sync notebooks on Wi-Fi only */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm text-white font-medium block">
                Sync notebooks on Wi-Fi only
              </span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Notebooks and pages will only sync when connected to Wi-Fi
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notebooks.syncWifiOnly}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    notebooks: {
                      ...settings.notebooks,
                      syncWifiOnly: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Sync all page content */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm text-white font-medium block">Sync all page content</span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                All content from the pages of an open notebook will be downloaded (including all files and images)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notebooks.syncAllPageContent}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    notebooks: {
                      ...settings.notebooks,
                      syncAllPageContent: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Default section */}
          <div className="py-1">
            <span className="text-sm text-white font-medium block">Default section</span>
            <span className="text-xs text-neutral-400 block mt-0.5 font-mono">
              {settings.notebooks.defaultSection}
            </span>
          </div>
        </section>

        {/* ================= General Settings ================= */}
        <section className="space-y-4 pt-2 border-t border-white/10">
          <h3 className="text-lg font-bold text-purple-400 tracking-tight">General Settings</h3>

          {/* OneNote floatie */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm text-white font-medium block">OneNote floatie</span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Turn this on to show a OneNote shortcut on your screen
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.oneNoteFloatie}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    oneNoteFloatie: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Ad Blocker Protection */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm text-white font-medium block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ad & Tracker Blocker</span>
              </span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Blocks 100% of banner ads, popups, and user telemetry for a distraction-free diary
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.blockAds}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    blockAds: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* About */}
          <div className="py-2 border-t border-white/5">
            <span className="text-sm text-white font-medium block">About</span>
            <span className="text-xs text-neutral-400 block mt-0.5">
              Diario App Studio v2.4.0 • Built with Gemini 4K AI & Offline Storage
            </span>
          </div>

          {/* Trust Center */}
          <div className="py-1">
            <span className="text-sm text-white font-medium block">Trust Center</span>
            <span className="text-xs text-neutral-400 block mt-0.5">
              View our privacy statement and offline encryption diagnostic viewer
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
