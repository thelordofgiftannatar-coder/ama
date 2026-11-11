import React, { useState, useEffect, useMemo } from 'react';
import { Note, Notebook, AppSettings, VideoEditorParams, MediaItem } from './types';
import { storage, DEFAULT_SETTINGS, INITIAL_NOTES } from './services/storage';
import { BackgroundWallpaper } from './components/BackgroundWallpaper';
import { NavigationDrawer } from './components/NavigationDrawer';
import { TopBar } from './components/TopBar';
import { TabsHeader } from './components/TabsHeader';
import { NoteCard } from './components/NoteCard';
import { NotebookListView } from './components/NotebookListView';
import { FloatingActionBar } from './components/FloatingActionBar';
import { NoteEditorModal } from './components/NoteEditorModal';
import { AiImageGeneratorModal } from './components/AiImageGeneratorModal';
import { VideoEditorModal } from './components/VideoEditorModal';
import { ShareSheetModal } from './components/ShareSheetModal';
import { SortModal, SortOption } from './components/SortModal';
import { FilterModal, FilterState } from './components/FilterModal';
import { SettingsModal } from './components/SettingsModal';
import { OneNoteFloatie } from './components/OneNoteFloatie';
import { VoiceRecorderModal } from './components/VoiceRecorderModal';
import { DrawingCanvasModal } from './components/DrawingCanvasModal';
import { AccountModal } from './components/AccountModal';
import { Sparkles, Heart, Plus, ShieldCheck, Check } from 'lucide-react';

export default function App() {
  // Core state
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [activeTab, setActiveTab] = useState<'recent' | 'notebooks'>('recent');
  const [activeView, setActiveView] = useState('notes'); // 'notes' | 'reminders' | 'likes' | 'archive' | 'trash'
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('custom');

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  // Editor states
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);

  // Video Editor states
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [videoEditorUrl, setVideoEditorUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [videoEditorName, setVideoEditorName] = useState<string>('Animation_Cut_01.mp4');

  // Share Sheet states
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [shareItemUrl, setShareItemUrl] = useState('');
  const [shareItemName, setShareItemName] = useState('');

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    onlyLiked: false,
    hasImages: false,
    hasVideos: false,
    hasVoice: false,
    hasChecklists: false,
    tag: null,
  });

  // Load from IndexedDB on startup
  useEffect(() => {
    async function init() {
      try {
        const [loadedNotes, loadedNotebooks, loadedSettings] = await Promise.all([
          storage.getNotes(),
          storage.getNotebooks(),
          storage.getSettings(),
        ]);
        setNotes(loadedNotes);
        setNotebooks(loadedNotebooks);
        setSettings(loadedSettings);
        if (loadedSettings.displayOptions?.layout) {
          setViewMode(loadedSettings.displayOptions.layout);
        }
      } catch (e) {
        console.error('Initialization error', e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Compute all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      n.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [notes]);

  // Liked notes count
  const likedCount = useMemo(() => {
    return notes.filter((n) => n.isLiked && !n.isTrash).length;
  }, [notes]);

  // Filter & Sort Logic
  const filteredNotes = useMemo(() => {
    let result = notes.filter((n) => {
      // Trash vs Archive vs Normal view
      if (activeView === 'trash') {
        return n.isTrash;
      }
      if (activeView === 'archive') {
        return n.isArchived && !n.isTrash;
      }
      if (n.isTrash || n.isArchived) {
        return false;
      }

      // Likes view
      if (activeView === 'likes' && !n.isLiked) {
        return false;
      }

      // Reminders view
      if (activeView === 'reminders') {
        return n.checklist && n.checklist.length > 0;
      }

      // Filter by tag from sidebar
      if (selectedTag && !n.tags.includes(selectedTag)) {
        return false;
      }

      // Filter by notebook from Notebook tab
      if (selectedNotebookId && n.notebookId !== selectedNotebookId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchTags = n.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }

      // Advanced filters modal
      if (filters.onlyLiked && !n.isLiked) return false;
      if (filters.hasImages && !n.media.some((m) => m.type === 'image' || m.type === 'gif')) return false;
      if (filters.hasVideos && !n.media.some((m) => m.type === 'video')) return false;
      if (filters.hasVoice && !n.audioUrl) return false;
      if (filters.hasChecklists && (!n.checklist || n.checklist.length === 0)) return false;
      if (filters.tag && !n.tags.includes(filters.tag)) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      // Pinned always on top in normal view
      if (activeView === 'notes') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }

      if (selectedSort === 'created') {
        return b.createdAt - a.createdAt;
      }
      if (selectedSort === 'modified') {
        return b.updatedAt - a.updatedAt;
      }
      if (selectedSort === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Custom (Default)
      return b.updatedAt - a.updatedAt;
    });

    return result;
  }, [
    notes,
    activeView,
    selectedTag,
    selectedNotebookId,
    searchQuery,
    selectedSort,
    filters,
  ]);

  // Note CRUD operations
  const handleSaveNote = async (updatedNote: Note) => {
    const exists = notes.some((n) => n.id === updatedNote.id);
    let newNotes: Note[];
    if (exists) {
      newNotes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    } else {
      newNotes = [updatedNote, ...notes];
    }
    setNotes(newNotes);
    await storage.saveNote(updatedNote);
  };

  const handleDeleteNote = async (id: string) => {
    // Soft delete to trash or permanent delete if already in trash
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    if (note.isTrash) {
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      await storage.deleteNote(id);
    } else {
      const updated = { ...note, isTrash: true };
      await handleSaveNote(updated);
    }
  };

  const handleToggleLike = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const updated = { ...note, isLiked: !note.isLiked, updatedAt: Date.now() };
    handleSaveNote(updated);
  };

  const handleTogglePin = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const updated = { ...note, isPinned: !note.isPinned, updatedAt: Date.now() };
    handleSaveNote(updated);
  };

  // Notebook operations
  const handleAddNotebook = async (name: string, color?: string) => {
    const newNb: Notebook = {
      id: `nb_${Date.now()}`,
      name,
      color: color || '#e11d48',
      sections: [{ id: `sec_${Date.now()}`, name: 'General' }],
    };
    const newNotebooks = [...notebooks, newNb];
    setNotebooks(newNotebooks);
    await storage.saveAllNotebooks(newNotebooks);
  };

  const handleAddSection = async (notebookId: string, sectionName: string) => {
    const updated = notebooks.map((nb) => {
      if (nb.id === notebookId) {
        return {
          ...nb,
          sections: [...(nb.sections || []), { id: `sec_${Date.now()}`, name: sectionName }],
        };
      }
      return nb;
    });
    setNotebooks(updated);
    await storage.saveAllNotebooks(updated);
  };

  // Video Editor Launch
  const handleOpenVideoEditor = (url: string, name?: string) => {
    setVideoEditorUrl(url);
    setVideoEditorName(name || 'Video_Clip.mp4');
    setIsVideoEditorOpen(true);
  };

  const handleSaveEditedVideo = (params: VideoEditorParams, snapshotUrl?: string) => {
    // Create or update video note
    const videoNote: Note = {
      id: `note_vid_${Date.now()}`,
      title: `${videoEditorName} (Edited)`,
      content: `Edited clip with ${params.filter} filter, ${params.effect} effect, speed: ${params.speed}x.`,
      notebookId: 'default_d',
      sectionId: 'quick_notes',
      type: 'media',
      media: [
        {
          id: `media_${Date.now()}`,
          type: 'video',
          url: params.videoUrl,
          name: videoEditorName,
          thumbnail: snapshotUrl,
          duration: params.trimEnd - params.trimStart,
          createdAt: Date.now(),
        },
      ],
      tags: ['Video', 'Edited', 'Studio'],
      color: '#1f1624',
      isPinned: true,
      isArchived: false,
      isTrash: false,
      isLiked: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handleSaveNote(videoNote);
  };

  // AI 4K Image selected from modal
  const handleAttachAiImage = (imageUrl: string, promptText: string) => {
    const newNote: Note = {
      id: `note_ai_${Date.now()}`,
      title: promptText.slice(0, 30) || 'AI 4K Artwork',
      content: promptText,
      notebookId: 'beware_tomorrow',
      sectionId: 'lore',
      type: 'media',
      media: [
        {
          id: `m_ai_${Date.now()}`,
          type: 'image',
          url: imageUrl,
          name: '4K_Masterpiece.png',
          createdAt: Date.now(),
        },
      ],
      tags: ['AI', '4K', 'Artwork'],
      color: '#241a12',
      isPinned: true,
      isArchived: false,
      isTrash: false,
      isLiked: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handleSaveNote(newNote);
  };

  // Set AI generated image as wallpaper
  const handleSetAiWallpaper = (imageUrl: string) => {
    const updatedSettings: AppSettings = {
      ...settings,
      wallpaper: {
        id: `ai_wp_${Date.now()}`,
        name: 'AI 4K Custom Wallpaper',
        type: 'ai',
        url: imageUrl,
        dim: 45,
        blur: 3,
      },
    };
    setSettings(updatedSettings);
    storage.saveSettings(updatedSettings);
  };

  // Voice Note saving
  const handleSaveVoiceNote = (audioUrl: string, duration: number, transcript: string) => {
    const newNote: Note = {
      id: `voice_${Date.now()}`,
      title: transcript.slice(0, 25) || 'Voice Memo',
      content: transcript || 'Recorded voice journal entry.',
      notebookId: 'default_d',
      sectionId: 'quick_notes',
      type: 'voice',
      audioUrl,
      audioDuration: duration,
      media: [],
      tags: ['Voice', 'Memo'],
      color: '#211928',
      isPinned: false,
      isArchived: false,
      isTrash: false,
      isLiked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handleSaveNote(newNote);
  };

  // Drawing saving
  const handleSaveDrawing = (dataUrl: string) => {
    const newNote: Note = {
      id: `draw_${Date.now()}`,
      title: 'Doodle Sketch',
      content: 'Hand-drawn diary entry.',
      notebookId: 'default_d',
      sectionId: 'quick_notes',
      type: 'drawing',
      drawingData: dataUrl,
      media: [
        {
          id: `m_draw_${Date.now()}`,
          type: 'image',
          url: dataUrl,
          name: 'sketch.png',
          createdAt: Date.now(),
        },
      ],
      tags: ['Sketch', 'Drawing'],
      color: '#1a1b1e',
      isPinned: false,
      isArchived: false,
      isTrash: false,
      isLiked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handleSaveNote(newNote);
  };

  // Quick Floatie note saving
  const handleQuickFloatSave = (quickTitle: string, quickContent: string) => {
    const newNote: Note = {
      id: `float_${Date.now()}`,
      title: quickTitle,
      content: quickContent,
      notebookId: 'default_d',
      sectionId: 'quick_notes',
      type: 'text',
      media: [],
      tags: ['Quick'],
      color: '#241a2a',
      isPinned: true,
      isArchived: false,
      isTrash: false,
      isLiked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handleSaveNote(newNote);
  };

  // Share Sheet
  const handleOpenShareSheet = (url: string, name?: string) => {
    setShareItemUrl(
      url ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    );
    setShareItemName(name || 'Diario Note Clip');
    setIsShareSheetOpen(true);
  };

  const activeFilterCount =
    (filters.onlyLiked ? 1 : 0) +
    (filters.hasImages ? 1 : 0) +
    (filters.hasVideos ? 1 : 0) +
    (filters.hasVoice ? 1 : 0) +
    (filters.hasChecklists ? 1 : 0) +
    (filters.tag ? 1 : 0);

  return (
    <div className="min-h-screen text-[#e6e2de] relative flex flex-col font-sans select-none">
      {/* Background Wallpaper Engine (supports 4K photos, animated GIFs, AMOLED) */}
      <BackgroundWallpaper wallpaper={settings.wallpaper} theme={settings.theme} />

      {/* Top Search Bar & Header matching Screenshot_20261110-175943_e513a2b8.png */}
      <TopBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onOpenSortModal={() => setIsSortModalOpen(true)}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        settings={settings}
        activeFilterCount={activeFilterCount}
      />

      {/* Dual Navigation Tabs: [ Recent Pages ] | [ Notebook List ] */}
      <TabsHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'recent') setSelectedNotebookId(null);
        }}
        accentColor={settings.accentColor}
      />

      {/* Sub-view banner (if filtered by tag or in Likes view) */}
      {(selectedTag || activeView !== 'notes') && (
        <div className="max-w-4xl mx-auto px-4 py-1.5 w-full flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            {activeView === 'likes' && (
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Liked & Favorites</span>
              </span>
            )}
            {selectedTag && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                Tag: #{selectedTag}
              </span>
            )}
            {selectedNotebookId && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                Notebook: {notebooks.find((n) => n.id === selectedNotebookId)?.name}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedTag(null);
              setSelectedNotebookId(null);
              setActiveView('notes');
            }}
            className="text-amber-400 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-2 pb-28">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-neutral-400 text-sm">
            Loading your Diario...
          </div>
        ) : activeTab === 'notebooks' ? (
          /* Notebook List View matching Screenshot_20261110-175947_1c8ec2fa.png */
          <NotebookListView
            notebooks={notebooks}
            notes={notes}
            selectedNotebookId={selectedNotebookId}
            onSelectNotebook={(id) => {
              setSelectedNotebookId(id);
              if (id) setActiveTab('recent');
            }}
            onAddNotebook={handleAddNotebook}
            onAddSection={handleAddSection}
          />
        ) : (
          /* Recent Pages / Notes View matching Screenshot_20261110-175936_b64c286f.png */
          <div>
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500">
                <p className="text-base text-neutral-400 font-medium mb-1">No notes found</p>
                <p className="text-xs text-neutral-500 max-w-xs mb-4">
                  Tap the + button to create a note, capture a photo, or generate 4K AI artwork!
                </p>
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setIsNoteEditorOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-amber-500 text-black text-xs font-bold shadow transition hover:bg-amber-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Note</span>
                </button>
              </div>
            ) : (
              <div
                className={`gap-3 ${
                  viewMode === 'grid'
                    ? 'columns-1 sm:columns-2 space-y-3'
                    : 'flex flex-col space-y-3'
                }`}
              >
                {filteredNotes.map((note) => (
                  <div key={note.id} className="break-inside-avoid">
                    <NoteCard
                      note={note}
                      onClick={() => {
                        setEditingNote(note);
                        setIsNoteEditorOpen(true);
                      }}
                      onToggleLike={(e) => handleToggleLike(e, note)}
                      onTogglePin={(e) => handleTogglePin(e, note)}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      onShare={(e) => {
                        e.stopPropagation();
                        const sample = note.media[0]?.url || '';
                        handleOpenShareSheet(sample, note.title);
                      }}
                      onOpenVideoEditor={(url, name) => handleOpenVideoEditor(url, name)}
                      density={settings.displayOptions.density}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Pill Bar matching Screenshot_20261110-175936_b64c286f.png */}
      <FloatingActionBar
        onNewTextNote={() => {
          setEditingNote(null);
          setIsNoteEditorOpen(true);
        }}
        onTakePhoto={() => {
          // Open editor directly in photo attach mode
          setEditingNote(null);
          setIsNoteEditorOpen(true);
        }}
        onRecordVoice={() => setIsVoiceRecorderOpen(true)}
        onOpenDrawing={() => setIsDrawingModalOpen(true)}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenVideoStudio={() => handleOpenVideoEditor(videoEditorUrl, videoEditorName)}
      />

      {/* OneNote Floatie shortcut button (if enabled in settings) */}
      {settings.oneNoteFloatie && (
        <OneNoteFloatie
          onQuickSave={handleQuickFloatSave}
          accentColor={settings.accentColor}
        />
      )}

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          setActiveTab('recent');
        }}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        allTags={allTags}
        onAddNewTag={(t) => setSelectedTag(t)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        likedCount={likedCount}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        onClose={() => setIsNoteEditorOpen(false)}
        note={editingNote}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenVideoStudio={(url, name) => handleOpenVideoEditor(url, name)}
        onOpenShareSheet={handleOpenShareSheet}
        allTags={allTags}
      />

      {/* AI 4K Image Generator Modal */}
      <AiImageGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onSelectImageForNote={handleAttachAiImage}
        onSetAsWallpaper={handleSetAiWallpaper}
      />

      {/* Video Studio & Editor Modal matching Screenshot_20261110-180656_4e2eee6d.png */}
      <VideoEditorModal
        isOpen={isVideoEditorOpen}
        onClose={() => setIsVideoEditorOpen(false)}
        videoUrl={videoEditorUrl}
        videoName={videoEditorName}
        onSaveEditedVideo={handleSaveEditedVideo}
        onOpenShareSheet={(url, name) => handleOpenShareSheet(url, name)}
      />

      {/* Share Sheet Modal matching Screenshot_20261110-180637_bf77f356.png */}
      <ShareSheetModal
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
        itemUrl={shareItemUrl}
        itemName={shareItemName}
      />

      {/* Sort Modal matching Screenshot_20261110-180050_00dba75f.png */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
        allTags={allTags}
      />

      {/* Settings Modal matching Screenshot_20261110-180042_7d4db370.png */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          storage.saveSettings(newSettings);
        }}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
      />

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        onSaveVoiceNote={handleSaveVoiceNote}
      />

      {/* Drawing / Doodle Canvas Modal */}
      <DrawingCanvasModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onSaveDrawing={handleSaveDrawing}
      />

      {/* Account & Cloud Sync Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        account={settings.userAccount}
        onUpdateAccount={(acc) => {
          const updated = { ...settings, userAccount: acc };
          setSettings(updated);
          storage.saveSettings(updated);
        }}
        onSyncNow={async () => {
          const res = await storage.syncToCloud(settings.userAccount.syncKey);
          alert(res.message);
        }}
      />
    </div>
  );
}
