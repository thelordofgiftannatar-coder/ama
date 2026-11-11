import { Note, Notebook, AppSettings, WallpaperConfig } from '../types';
import { apiUrl } from './api';

const DB_NAME = 'DiarioDB_v1';
const STORE_NOTES = 'notes';
const STORE_SETTINGS = 'settings';
const STORE_NOTEBOOKS = 'notebooks';

export const PRESET_WALLPAPERS: WallpaperConfig[] = [
  {
    id: 'amoled_black',
    name: 'AMOLED Pure Pitch',
    type: 'preset',
    url: '',
    dim: 0,
    blur: 0,
  },
  {
    id: 'cyberpunk_rain',
    name: '4K Cyberpunk Neon Rain',
    type: 'preset',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=3840&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=70',
    dim: 45,
    blur: 4,
  },
  {
    id: 'dark_knight',
    name: '4K Dark Fantasy Warrior',
    type: 'preset',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=3840&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=70',
    dim: 50,
    blur: 6,
  },
  {
    id: 'deep_space',
    name: '4K Nebula Void',
    type: 'preset',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=3840&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=70',
    dim: 40,
    blur: 3,
  },
  {
    id: 'gif_lofi_rain',
    name: 'Animated GIF - Lo-Fi Cyber City',
    type: 'gif',
    url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    thumbnail: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/200.gif',
    dim: 55,
    blur: 4,
  },
  {
    id: 'gif_pixel_fire',
    name: 'Animated GIF - Pixel Campfire',
    type: 'gif',
    url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    thumbnail: 'https://media.giphy.com/media/13HgwGsXF0aiGY/200.gif',
    dim: 60,
    blur: 2,
  },
  {
    id: 'golden_desert',
    name: '4K Golden Warrior & Dune',
    type: 'preset',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=3840&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=70',
    dim: 50,
    blur: 5,
  },
];

export const DEFAULT_NOTEBOOKS: Notebook[] = [
  {
    id: 'default_d',
    name: 'D',
    isDefault: true,
    color: '#e11d48',
    sections: [
      { id: 'quick_notes', name: 'Quick Notes' },
      { id: 'ideas', name: 'Ideas & Drafts' },
    ],
  },
  {
    id: 'beware_tomorrow',
    name: 'BEWARE THE MAN OF TOMORROW!',
    color: '#f97316',
    sections: [
      { id: 'lore', name: 'Story Lore' },
      { id: 'scripts', name: 'Monologues' },
    ],
  },
  {
    id: 'joviel_nb',
    name: 'joviel',
    isClosed: true,
    color: '#8b5cf6',
    sections: [{ id: 'archive_j', name: 'Archive' }],
  },
  {
    id: 'bill_nb',
    name: 'Bill',
    isClosed: true,
    color: '#06b6d4',
    sections: [{ id: 'general', name: 'General' }],
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'amoled',
  accentColor: '#f59e0b', // Keep amber
  wallpaper: PRESET_WALLPAPERS[0],
  displayOptions: {
    addNewItemsToBottom: true,
    moveCheckedItemsToBottom: true,
    displayRichLinkPreviews: true,
    layout: 'grid',
    density: 'comfortable',
    fontFamily: 'sans',
  },
  noteCreation: {
    createTextNotesByDefault: true,
  },
  sharing: {
    enableSharing: true,
  },
  notebooks: {
    syncWifiOnly: false,
    syncAllPageContent: true,
    defaultSection: 'D >> Quick Notes',
  },
  oneNoteFloatie: true,
  blockAds: true,
  userAccount: {
    name: 'Billie J. Bazile.',
    email: 'billjbazile05@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    isGoogleConnected: true,
    lastSynced: Date.now(),
    syncKey: 'billie_diario_sync',
  },
};

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: 'Captain America: The First Avenger',
    content: 'Captain America: The First Avenger\nCaptain Marvel\nIron Man\nIron Man 2\nThe Incredible Hulk\nThor\nThe Avengers\nIron Man 3',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'checklist',
    checklist: [
      { id: 'c1', text: 'Captain America: The First Avenger', done: true },
      { id: 'c2', text: 'Captain Marvel', done: true },
      { id: 'c3', text: 'Iron Man', done: true },
      { id: 'c4', text: 'Iron Man 2', done: false },
      { id: 'c5', text: 'The Incredible Hulk', done: false },
      { id: 'c6', text: 'Thor', done: false },
      { id: 'c7', text: 'The Avengers', done: false },
    ],
    media: [],
    tags: ['Marvel', 'Movies'],
    color: '#1a1b1e',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    isLiked: true,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note_2',
    title: 'Cyberpunk',
    content: '.github/workflows/build-exe.yml\nname: Build Windows EXE on:\n  push:\n    branches: [main, master]\n  workflow_dispatch:\njobs:\n  build:\n    runs-on: windows-latest',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'text',
    media: [],
    tags: ['Dev', 'Cyberpunk', 'CI/CD'],
    color: '#1a1b1e',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    isLiked: false,
    createdAt: Date.now() - 3600000 * 20,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'note_3',
    title: 'Cyberpunk: Edgerunners',
    content: 'name: Build Android APK on:\n  push:\n    branches: [main, master]\n  workflow_dispatch: jobs:\n    build:\n      runs-on: ubuntu-latest\n      steps:\n        - uses: actions/checkout@v4',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'text',
    media: [],
    tags: ['Cyberpunk', 'Android', 'Build'],
    color: '#1a1b1e',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: true,
    createdAt: Date.now() - 3600000 * 18,
    updatedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'note_4',
    title: 'chaos is a ladder monologue',
    content: 'Varys: when you imagine yourself up there, How do you look? does the crown fit?\n\nLittlefinger: Chaos isn\'t a pit. Chaos is a ladder. Many who try to climb it fail and never get to try again. The fall breaks them. And some are given a chance to climb, but they refuse. They cling to the realm, or the gods, or love. Illusions. Only the ladder is real. The climb is all there is.',
    notebookId: 'beware_tomorrow',
    sectionId: 'scripts',
    type: 'text',
    media: [],
    tags: ['Quotes', 'Philosophy', 'Monologue'],
    color: '#1e1c24',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: true,
    createdAt: Date.now() - 3600000 * 15,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note_5',
    title: 'Andor Saw Gerrera',
    content: 'Remember this. Remember this moment! This perfect night. You think the sun is coming up, but it\'s just the dawn of our fury. What is your sacrifice? Everything!',
    notebookId: 'beware_tomorrow',
    sectionId: 'lore',
    type: 'text',
    media: [],
    tags: ['Andor', 'Quotes'],
    color: '#1a1b1e',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: false,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_6',
    title: 'MAN OF TOMORROW',
    content: 'The golden guardian stands upon the threshold of dawn. A symbol of resilience and untamed power across eternal sands.',
    notebookId: 'beware_tomorrow',
    sectionId: 'lore',
    type: 'media',
    media: [
      {
        id: 'm_warrior',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        name: 'MAN OF TOMORROW.jpg',
        createdAt: Date.now(),
      },
    ],
    tags: ['Art', '4K', 'Warrior'],
    color: '#241a12',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    isLiked: true,
    createdAt: Date.now() - 3600000 * 8,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_7',
    title: 'Animated Character Video Edit',
    content: 'High-energy 16s animation cut with custom color grading, glitch overlay, and beat sync.',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'media',
    media: [
      {
        id: 'm_video1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        name: 'Animation_Edit_01.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
        duration: 16,
        createdAt: Date.now(),
      },
    ],
    tags: ['Video', 'Animation', 'Studio'],
    color: '#1f1624',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: true,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_8',
    title: 'sassociated list',
    content: 'sassychic2020\ntatianakelly24\nkatanahxtease\nkellynicolel.x0\ntinydyme1\n...',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'text',
    media: [],
    tags: ['Y', 'Handles'],
    color: '#1a1b1e',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: false,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_9',
    title: 'Morvazil',
    content: 'Research notes on galactic architecture and ancient mythologies.',
    notebookId: 'default_d',
    sectionId: 'quick_notes',
    type: 'text',
    media: [],
    tags: ['Y'],
    color: '#1a1b1e',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isLiked: false,
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 1,
  },
];

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_NOTEBOOKS)) {
        db.createObjectStore(STORE_NOTEBOOKS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Storage helpers
export const storage = {
  async getNotes(): Promise<Note[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NOTES, 'readonly');
        const store = tx.objectStore(STORE_NOTES);
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result);
          } else {
            // Seed initial
            this.saveAllNotes(INITIAL_NOTES).then(() => resolve(INITIAL_NOTES));
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem('diario_notes');
          resolve(raw ? JSON.parse(raw) : INITIAL_NOTES);
        };
      });
    } catch {
      const raw = localStorage.getItem('diario_notes');
      return raw ? JSON.parse(raw) : INITIAL_NOTES;
    }
  },

  async saveNote(note: Note): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      tx.objectStore(STORE_NOTES).put(note);
    } catch {
      const notes = await this.getNotes();
      const idx = notes.findIndex((n) => n.id === note.id);
      if (idx >= 0) notes[idx] = note;
      else notes.unshift(note);
      localStorage.setItem('diario_notes', JSON.stringify(notes));
    }
  },

  async saveAllNotes(notes: Note[]): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      store.clear();
      for (const n of notes) {
        store.put(n);
      }
      localStorage.setItem('diario_notes', JSON.stringify(notes));
    } catch {
      localStorage.setItem('diario_notes', JSON.stringify(notes));
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      tx.objectStore(STORE_NOTES).delete(id);
    } catch {
      const notes = (await this.getNotes()).filter((n) => n.id !== id);
      localStorage.setItem('diario_notes', JSON.stringify(notes));
    }
  },

  async getNotebooks(): Promise<Notebook[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NOTEBOOKS, 'readonly');
        const store = tx.objectStore(STORE_NOTEBOOKS);
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result);
          } else {
            this.saveAllNotebooks(DEFAULT_NOTEBOOKS).then(() => resolve(DEFAULT_NOTEBOOKS));
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem('diario_notebooks');
          resolve(raw ? JSON.parse(raw) : DEFAULT_NOTEBOOKS);
        };
      });
    } catch {
      const raw = localStorage.getItem('diario_notebooks');
      return raw ? JSON.parse(raw) : DEFAULT_NOTEBOOKS;
    }
  },

  async saveAllNotebooks(notebooks: Notebook[]): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NOTEBOOKS, 'readwrite');
      const store = tx.objectStore(STORE_NOTEBOOKS);
      store.clear();
      for (const nb of notebooks) {
        store.put(nb);
      }
      localStorage.setItem('diario_notebooks', JSON.stringify(notebooks));
    } catch {
      localStorage.setItem('diario_notebooks', JSON.stringify(notebooks));
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_SETTINGS, 'readonly');
        const store = tx.objectStore(STORE_SETTINGS);
        const req = store.get('app_settings');
        req.onsuccess = () => {
          if (req.result?.value) {
            resolve({ ...DEFAULT_SETTINGS, ...req.result.value });
          } else {
            const raw = localStorage.getItem('diario_settings');
            resolve(raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS);
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem('diario_settings');
          resolve(raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS);
        };
      });
    } catch {
      const raw = localStorage.getItem('diario_settings');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      tx.objectStore(STORE_SETTINGS).put({ key: 'app_settings', value: settings });
      localStorage.setItem('diario_settings', JSON.stringify(settings));
    } catch {
      localStorage.setItem('diario_settings', JSON.stringify(settings));
    }
  },

  // Export full JSON bundle for Cross-Platform Backup
  async exportFullBackup(): Promise<string> {
    const notes = await this.getNotes();
    const notebooks = await this.getNotebooks();
    const settings = await this.getSettings();

    const backup = {
      app: 'Diario',
      version: '2.0',
      exportedAt: Date.now(),
      notes,
      notebooks,
      settings,
    };
    return JSON.stringify(backup, null, 2);
  },

  // Restore full backup JSON bundle
  async restoreFullBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.notes && Array.isArray(data.notes)) {
        await this.saveAllNotes(data.notes);
      }
      if (data.notebooks && Array.isArray(data.notebooks)) {
        await this.saveAllNotebooks(data.notebooks);
      }
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
      return true;
    } catch (e) {
      console.error('Failed to restore backup', e);
      return false;
    }
  },

  // Cross-device server sync
  async syncToCloud(syncKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const notes = await this.getNotes();
      const notebooks = await this.getNotebooks();
      const settings = await this.getSettings();

      const payload = {
        notes,
        notebooks,
        settings,
      };

      const res = await fetch(apiUrl('/api/sync/backup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncKey, data: payload }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message || 'Synced to cloud' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Offline - backup stored locally' };
    }
  },

  async restoreFromCloud(syncKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/sync/restore/${encodeURIComponent(syncKey)}`));
      if (!res.ok) {
        throw new Error('Sync key not found on cloud server');
      }
      const json = await res.json();
      if (json.data) {
        if (json.data.notes) await this.saveAllNotes(json.data.notes);
        if (json.data.notebooks) await this.saveAllNotebooks(json.data.notebooks);
        if (json.data.settings) await this.saveSettings(json.data.settings);
        return { success: true, message: 'Cloud restore completed!' };
      }
      return { success: false, message: 'Invalid cloud data received' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Cloud restore failed' };
    }
  },
};
