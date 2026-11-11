import React from 'react';
import { Camera, Paintbrush, Mic, Plus, Sparkles, Video } from 'lucide-react';

interface FloatingActionBarProps {
  onNewTextNote: () => void;
  onTakePhoto: () => void;
  onRecordVoice: () => void;
  onOpenDrawing: () => void;
  onOpenAiGenerator: () => void;
  onOpenVideoStudio: () => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  onNewTextNote,
  onTakePhoto,
  onRecordVoice,
  onOpenDrawing,
  onOpenAiGenerator,
  onOpenVideoStudio,
}) => {
  return (
    <div className="fixed bottom-5 right-4 sm:right-8 z-40 flex items-center gap-2">
      {/* Action pill bar matching Screenshot_20261110-175936_b64c286f.png */}
      <div className="flex items-center gap-1 bg-[#1a171d]/90 backdrop-blur-lg px-2.5 py-1.5 rounded-full border border-[#3b3442] shadow-2xl">
        {/* Camera / Media Button */}
        <button
          onClick={onTakePhoto}
          className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
          title="Add Photo / Video"
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Video Studio Button */}
        <button
          onClick={onOpenVideoStudio}
          className="p-2.5 rounded-full text-neutral-300 hover:text-amber-400 hover:bg-white/10 transition"
          title="Video Studio & Editor"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Drawing / Doodle Button */}
        <button
          onClick={onOpenDrawing}
          className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
          title="Draw / Doodle"
        >
          <Paintbrush className="w-5 h-5" />
        </button>

        {/* Voice Memo Button */}
        <button
          onClick={onRecordVoice}
          className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
          title="Voice Memo Recording"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* AI 4K Generator quick launch */}
        <button
          onClick={onOpenAiGenerator}
          className="p-2.5 rounded-full text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition"
          title="Generate AI 4K Image"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Plus / New Note Button matching Screenshot_20261110-175943_e513a2b8.png warm FAB */}
        <button
          onClick={onNewTextNote}
          className="p-3 rounded-2xl bg-[#925508] hover:bg-[#a6620a] active:scale-95 text-amber-100 shadow-lg transition-transform"
          title="New Note"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
