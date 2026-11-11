export type MediaType = 'image' | 'video' | 'gif' | 'audio';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  name?: string;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
  createdAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  sectionId?: string;
  type: 'text' | 'checklist' | 'media' | 'voice' | 'drawing';
  checklist?: ChecklistItem[];
  media: MediaItem[];
  audioUrl?: string;
  audioDuration?: number;
  drawingData?: string;
  tags: string[];
  color?: string; // card background color or tint
  isPinned: boolean;
  isArchived: boolean;
  isTrash: boolean;
  isLiked: boolean; // "open likes"
  createdAt: number;
  updatedAt: number;
}

export interface NotebookSection {
  id: string;
  name: string;
}

export interface Notebook {
  id: string;
  name: string;
  isDefault?: boolean;
  isClosed?: boolean;
  color?: string;
  sections: NotebookSection[];
}

export interface UserAccount {
  name: string;
  email: string;
  avatar: string;
  isGoogleConnected: boolean;
  lastSynced: number;
  syncKey: string;
}

export interface WallpaperConfig {
  id: string;
  name: string;
  type: 'preset' | 'custom' | 'gif' | 'ai' | 'none';
  url: string;
  thumbnail?: string;
  blur: number; // 0 to 20px
  dim: number; // 0 to 90%
}

export interface AppSettings {
  theme: 'amoled' | 'dark' | 'charcoal' | 'onenote-purple' | 'light';
  accentColor: string; // hex
  wallpaper: WallpaperConfig;
  displayOptions: {
    addNewItemsToBottom: boolean;
    moveCheckedItemsToBottom: boolean;
    displayRichLinkPreviews: boolean;
    layout: 'grid' | 'list';
    density: 'comfortable' | 'compact';
    fontFamily: 'sans' | 'serif' | 'mono' | 'handwriting';
  };
  noteCreation: {
    createTextNotesByDefault: boolean;
  };
  sharing: {
    enableSharing: boolean;
  };
  notebooks: {
    syncWifiOnly: boolean;
    syncAllPageContent: boolean;
    defaultSection: string;
  };
  oneNoteFloatie: boolean; // Screen shortcut floatie
  blockAds: boolean; // Block ads & trackers
  userAccount: UserAccount;
}

export interface VideoEditorParams {
  videoUrl: string;
  videoName?: string;
  trimStart: number;
  trimEnd: number;
  speed: number;
  volume: number;
  filter: 'none' | 'cinematic' | 'vintage' | 'noir' | 'cyberpunk' | 'warm' | 'cool' | 'sepia';
  effect: 'none' | 'glitch' | 'slowmo' | 'blur' | 'glow' | 'zoom' | 'grain';
  adjustments: {
    brightness: number; // -100 to 100
    contrast: number; // -100 to 100
    saturation: number; // -100 to 100
    exposure: number; // -100 to 100
    vignette: number; // 0 to 100
  };
  textOverlay: {
    text: string;
    color: string;
    fontSize: number;
    position: 'top' | 'center' | 'bottom';
    hasBackground: boolean;
  };
  musicTrack: string | null;
}
