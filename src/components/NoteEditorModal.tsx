import React, { useState, useRef } from 'react';
import { apiUrl } from '../services/api';
import {
  X,
  Pin,
  Heart,
  Share2,
  Trash2,
  Image as ImageIcon,
  Video,
  Mic,
  CheckSquare,
  Sparkles,
  Tag,
  Palette,
  Plus,
  Play,
  Film,
  Download,
  Check,
  Bot,
  RotateCw,
} from 'lucide-react';
import { Note, MediaItem, ChecklistItem } from '../types';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSaveNote: (updatedNote: Note) => void;
  onDeleteNote: (id: string) => void;
  onOpenAiGenerator: () => void;
  onOpenVideoStudio: (videoUrl: string, name?: string) => void;
  onOpenShareSheet: (url: string, name?: string) => void;
  allTags: string[];
}

const NOTE_COLORS = [
  '#1e1c18', // Default Keep warm dark
  '#2a1e1e', // Dark Crimson
  '#1e252a', // Deep Slate
  '#241a2a', // OneNote Violet
  '#1b2720', // Emerald Night
  '#262215', // Amber Bronze
];

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  note,
  onSaveNote,
  onDeleteNote,
  onOpenAiGenerator,
  onOpenVideoStudio,
  onOpenShareSheet,
  allTags,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [isLiked, setIsLiked] = useState(note?.isLiked || false);
  const [color, setColor] = useState(note?.color || '#1e1c18');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [media, setMedia] = useState<MediaItem[]>(note?.media || []);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(note?.checklist || []);
  const [isChecklistMode, setIsChecklistMode] = useState(
    (note?.checklist && note.checklist.length > 0) || false
  );
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: Note = {
      id: note?.id || `note_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      notebookId: note?.notebookId || 'default_d',
      sectionId: note?.sectionId || 'quick_notes',
      type: isChecklistMode ? 'checklist' : media.length > 0 ? 'media' : 'text',
      checklist: isChecklistMode ? checklist : undefined,
      media,
      tags,
      color,
      isPinned,
      isArchived: note?.isArchived || false,
      isTrash: false,
      isLiked,
      createdAt: note?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSaveNote(updated);
    onClose();
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const item: MediaItem = {
          id: `media_${Date.now()}`,
          type,
          url: reader.result as string,
          name: file.name,
          createdAt: Date.now(),
        };
        setMedia([...media, item]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter((m) => m.id !== id));
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      setChecklist([
        ...checklist,
        { id: `c_${Date.now()}`, text: newChecklistText.trim(), done: false },
      ]);
      setNewChecklistText('');
    }
  };

  const toggleCheckItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeCheckItem = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  const handleAddTag = (tagToAdd: string) => {
    if (tagToAdd.trim() && !tags.includes(tagToAdd.trim())) {
      setTags([...tags, tagToAdd.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // AI Assistant call
  const handleAiAssist = async (action: 'refine' | 'summarize' | 'expand' | 'tags') => {
    if (!content.trim() && !title.trim()) {
      alert('Write some text first for the AI to assist you with.');
      return;
    }
    setIsAiAssisting(true);
    setAiMessage(null);
    try {
      const res = await fetch(apiUrl('/api/gemini/assist'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text: `${title}\n\n${content}` }),
      });
      const data = await res.json();
      if (data.result) {
        if (action === 'refine' || action === 'expand') {
          setContent(data.result);
        } else if (action === 'summarize') {
          setAiMessage(`AI Summary:\n${data.result}`);
        } else if (action === 'tags') {
          const extracted = data.result
            .split(',')
            .map((s: string) => s.trim().replace(/^#/, ''))
            .filter(Boolean);
          setTags(Array.from(new Set([...tags, ...extracted])));
        }
      }
    } catch (e: any) {
      alert('AI Assistant error: ' + e.message);
    } finally {
      setIsAiAssisting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-[#3b332b] shadow-2xl flex flex-col my-auto text-[#e6e2de] overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: color }}
      >
        {/* Modal Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/30">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Like Button ("open likes") */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-rose-400 transition"
              title={isLiked ? 'Unlike note' : 'Like note'}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>

            {/* Pin Button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-amber-400 transition"
              title={isPinned ? 'Unpin' : 'Pin note'}
            >
              <Pin className={`w-5 h-5 ${isPinned ? 'fill-amber-400 text-amber-400 rotate-45' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                const sampleMedia = media[0]?.url || '';
                onOpenShareSheet(sampleMedia, title);
              }}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Color Palette */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
              title="Note Color"
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* Delete button (if existing note) */}
            {note && (
              <button
                onClick={() => {
                  if (confirm('Delete this note?')) {
                    onDeleteNote(note.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-rose-400 transition"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow"
            >
              Done
            </button>
          </div>
        </div>

        {/* Color Palette Picker Popup */}
        {showColorPicker && (
          <div className="px-4 py-2 bg-black/60 border-b border-white/10 flex items-center gap-2">
            <span className="text-xs text-neutral-400 mr-2">Color:</span>
            {NOTE_COLORS.map((col) => (
              <button
                key={col}
                onClick={() => {
                  setColor(col);
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  color === col ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Media Attachments Strip */}
          {media.length > 0 && (
            <div className="space-y-3">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 group"
                >
                  {m.type === 'video' ? (
                    <div className="relative aspect-video flex items-center justify-center bg-black">
                      <video src={m.url} controls className="w-full h-full object-contain" />
                      <button
                        onClick={() => onOpenVideoStudio(m.url, m.name)}
                        className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Edit in Video Studio</span>
                      </button>
                    </div>
                  ) : (
                    <img
                      src={m.url}
                      alt={m.name || 'Attachment'}
                      className="w-full max-h-[380px] object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveMedia(m.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 text-white hover:bg-rose-500 transition"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-lg sm:text-xl font-bold text-white placeholder-neutral-500 focus:outline-none"
          />

          {/* Checklist Mode or Text Content */}
          {isChecklistMode ? (
            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => toggleCheckItem(item.id)}
                    className="p-1 text-neutral-400 hover:text-amber-400"
                  >
                    <CheckSquare
                      className={`w-4 h-4 ${item.done ? 'text-amber-500' : 'text-neutral-500'}`}
                    />
                  </button>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChecklist(
                        checklist.map((c) => (c.id === item.id ? { ...c, text: val } : c))
                      );
                    }}
                    className={`flex-1 bg-transparent text-sm focus:outline-none text-white ${
                      item.done ? 'line-through text-neutral-500' : ''
                    }`}
                  />
                  <button
                    onClick={() => removeCheckItem(item.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-rose-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddChecklistItem} className="flex items-center gap-2 pt-1">
                <Plus className="w-4 h-4 text-neutral-500 ml-1" />
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="List item..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
              </form>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note / Journal reflection..."
              rows={6}
              className="w-full bg-transparent text-sm sm:text-base text-neutral-200 placeholder-neutral-500 focus:outline-none leading-relaxed resize-none"
            />
          )}

          {/* AI Message Notice (if summarized) */}
          {aiMessage && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs whitespace-pre-line">
              {aiMessage}
            </div>
          )}

          {/* Tags Pills Section */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-neutral-300 flex items-center gap-1"
                >
                  #{t}
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="+ label..."
                className="bg-transparent border border-white/10 rounded-full px-2.5 py-0.5 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none w-24"
              />
            </div>
          </div>
        </div>

        {/* Modal Toolbar Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2">
          {/* Media Attach Tools */}
          <div className="flex items-center gap-1">
            {/* Add Photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
              title="Add Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleAddMedia(e, 'image')}
              className="hidden"
            />

            {/* Add Video */}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-purple-400 transition"
              title="Add Video"
            >
              <Video className="w-5 h-5" />
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleAddMedia(e, 'video')}
              className="hidden"
            />

            {/* AI 4K Generator */}
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
              title="Generate 4K Artwork"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI 4K Image</span>
            </button>

            {/* Toggle Checklist */}
            <button
              onClick={() => setIsChecklistMode(!isChecklistMode)}
              className={`p-2 rounded-xl hover:bg-white/10 transition ${
                isChecklistMode ? 'text-amber-400 bg-amber-500/15' : 'text-neutral-300 hover:text-white'
              }`}
              title="Toggle Checklist"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          </div>

          {/* AI Writing Assistant Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAiAssist('refine')}
              disabled={isAiAssisting}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs flex items-center gap-1 transition"
              title="AI Polish"
            >
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>Refine</span>
            </button>

            <button
              onClick={() => handleAiAssist('summarize')}
              disabled={isAiAssisting}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition"
              title="AI Summarize"
            >
              Summarize
            </button>

            <button
              onClick={() => handleAiAssist('tags')}
              disabled={isAiAssisting}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition"
              title="AI Auto-Tag"
            >
              Auto-Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
