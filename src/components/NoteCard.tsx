import React from 'react';
import {
  Pin,
  Heart,
  Share2,
  Trash2,
  Archive,
  Play,
  CheckSquare,
  Square,
  FileCode,
  Sparkles,
  Music,
  Film,
} from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onToggleLike: (e: React.MouseEvent) => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onOpenVideoEditor?: (videoUrl: string, videoName?: string) => void;
  density?: 'comfortable' | 'compact';
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onToggleLike,
  onTogglePin,
  onDelete,
  onShare,
  onOpenVideoEditor,
  density = 'comfortable',
}) => {
  // Check if content looks like code / yaml / workflow
  const isCode =
    note.content.includes('.yml') ||
    note.content.includes('name: Build') ||
    note.content.includes('workflow_dispatch') ||
    note.tags.includes('Dev');

  const firstImage = note.media.find((m) => m.type === 'image' || m.type === 'gif');
  const firstVideo = note.media.find((m) => m.type === 'video');

  const isEmpty = !note.title.trim() && !note.content.trim() && note.media.length === 0;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl overflow-hidden border border-[#302a24]/80 ${
        note.isPinned
          ? 'ring-1 ring-amber-500/30'
          : ''
      } ${
        density === 'compact' ? 'p-3' : 'p-4'
      }`}
      style={{
        backgroundColor: note.color || '#1e1c18',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      }}
    >
      {/* Top Media Attachment (if any) */}
      {firstImage && (
        <div className="-mx-4 -mt-4 mb-3 relative overflow-hidden max-h-64 bg-black/40">
          <img
            src={firstImage.url}
            alt={note.title || 'Image'}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Video Attachment with Play / Edit button matching screenshot */}
      {firstVideo && (
        <div className="-mx-4 -mt-4 mb-3 relative overflow-hidden bg-black/60 aspect-video rounded-t-xl group/video">
          {firstVideo.thumbnail ? (
            <img
              src={firstVideo.thumbnail}
              alt="Video preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <Film className="w-12 h-12 text-neutral-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover/video:bg-black/20 transition flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenVideoEditor) {
                  onOpenVideoEditor(firstVideo.url, firstVideo.name);
                }
              }}
              className="p-3 rounded-full bg-amber-500/90 text-black hover:bg-amber-400 hover:scale-110 shadow-lg transition flex items-center gap-1.5"
              title="Edit in Video Studio"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-[11px] font-mono text-white flex items-center gap-1 backdrop-blur-sm">
            <span>0:16</span>
            <Play className="w-2.5 h-2.5 fill-current" />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenVideoEditor) {
                onOpenVideoEditor(firstVideo.url, firstVideo.name);
              }
            }}
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-600/80 hover:bg-purple-500 text-[10px] font-medium text-white flex items-center gap-1 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Video Studio</span>
          </button>
        </div>
      )}

      {/* Card Header: Title & Pin/Heart */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3
          className={`font-semibold text-white/95 tracking-tight break-words ${
            density === 'compact' ? 'text-sm' : 'text-base'
          }`}
        >
          {isEmpty ? (
            <span className="text-neutral-500 italic font-normal">No preview</span>
          ) : (
            note.title || (note.content ? note.content.slice(0, 30) : 'Untitled Note')
          )}
        </h3>

        <div className="flex items-center gap-1 shrink-0 -mr-1">
          {/* Like Heart Button */}
          <button
            onClick={onToggleLike}
            className="p-1 rounded-full text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition"
            title={note.isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                note.isLiked
                  ? 'text-rose-500 fill-rose-500 scale-110'
                  : 'text-neutral-400'
              }`}
            />
          </button>

          {/* Pin Button */}
          <button
            onClick={onTogglePin}
            className={`p-1 rounded-full transition ${
              note.isPinned
                ? 'text-amber-400 hover:bg-amber-400/20'
                : 'text-neutral-500 hover:text-white hover:bg-white/10'
            }`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-400 rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      {note.checklist && note.checklist.length > 0 ? (
        <div className="space-y-1 my-2">
          {note.checklist.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs text-neutral-300">
              {item.done ? (
                <CheckSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <Square className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              )}
              <span className={`truncate ${item.done ? 'line-through text-neutral-500' : ''}`}>
                {item.text}
              </span>
            </div>
          ))}
          {note.checklist.length > 5 && (
            <span className="text-[11px] text-neutral-500 font-medium">
              +{note.checklist.length - 5} more items...
            </span>
          )}
        </div>
      ) : isCode ? (
        <div className="my-2 p-2 rounded-lg bg-black/50 border border-neutral-800 font-mono text-[11px] text-emerald-400 overflow-hidden leading-relaxed">
          <div className="flex items-center gap-1 text-[10px] text-neutral-500 mb-1">
            <FileCode className="w-3 h-3" />
            <span>Workflow / Config</span>
          </div>
          <pre className="whitespace-pre-wrap line-clamp-4 font-mono">{note.content}</pre>
        </div>
      ) : (
        note.content && (
          <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-line line-clamp-6 leading-relaxed my-1">
            {note.content}
          </p>
        )
      )}

      {/* Voice memo indicator if audio attached */}
      {note.audioUrl && (
        <div className="my-2 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs w-fit">
          <Music className="w-3.5 h-3.5" />
          <span>Voice Memo {note.audioDuration ? `(${note.audioDuration}s)` : ''}</span>
        </div>
      )}

      {/* Tags Pills */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Hover Card Actions Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-neutral-400 font-mono">
          {new Date(note.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onShare}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-rose-400 transition"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
