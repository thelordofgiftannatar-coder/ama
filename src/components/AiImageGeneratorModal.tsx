import React, { useState } from 'react';
import { apiUrl } from '../services/api';
import { saveFile } from '../services/native';
import {
  X,
  Sparkles,
  Download,
  Image as ImageIcon,
  Check,
  Wallpaper,
  RefreshCw,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface AiImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImageForNote?: (imageUrl: string, prompt: string) => void;
  onSetAsWallpaper?: (imageUrl: string) => void;
}

const STYLES = [
  'Cinematic 4K',
  'Dark Fantasy',
  'Cyberpunk Neon',
  'Photorealistic',
  'Anime / Manga',
  'Sci-Fi Concept Art',
  'Oil Painting',
  'Vaporwave',
];

const RESOLUTIONS = [
  { label: '4K Ultra HD (3840×2160)', value: '4K' },
  { label: '2K Quad HD (2560×1440)', value: '2K' },
  { label: '1K Standard (1024×1024)', value: '1K' },
];

const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1:1' },
  { label: '16:9 Widescreen (4K)', value: '16:9' },
  { label: '9:16 Mobile Story', value: '9:16' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '3:4 Portrait', value: '3:4' },
];

const PROMPT_IDEAS = [
  'Dark armored knight with flowing crimson cape standing in the mist, dramatic rim lighting',
  'Golden Spartan warrior sliding across desert sand dunes at golden hour, epic scale',
  'Cyberpunk high-tech city street at night, neon rain reflections, flying hovercrafts',
  'Ethereal celestial nebula with floating crystalline islands, luminous stars, 4k detail',
  'Cozy rainy anime bedroom with lofi vibes, warm desk lamp, cat sleeping by window',
];

export const AiImageGeneratorModal: React.FC<AiImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectImageForNote,
  onSetAsWallpaper,
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic 4K');
  const [resolution, setResolution] = useState('4K');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setAppliedNotice(null);

    try {
      const res = await fetch(apiUrl('/api/gemini/generate-image'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          resolution,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        setErrorMessage(data.error || 'Failed to generate image. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    saveFile(`diario-ai-${resolution}-${Date.now()}.png`, generatedImage).catch((e) => setErrorMessage(e.message));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#171513] border border-[#3b332b] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-[#e6e2de]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d2720] flex items-center justify-between bg-[#1e1b17]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                AI 4K Image Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-normal">
                  Ultra HD
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Generate 4K artwork for notes, wallpapers, or photo diaries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Image Prompt & Scene Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene in vivid detail (e.g. Dark knight overlooking futuristic neon canyon...)"
              rows={3}
              className="w-full rounded-2xl bg-black/50 border border-[#3d362e] p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition resize-none"
            />

            {/* Quick Inspiration Pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-neutral-500 py-0.5">Try:</span>
              {PROMPT_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 truncate max-w-[280px] transition text-left"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Options Grid: Resolution, Aspect Ratio, Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Resolution Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-black/50 border border-[#3d362e] rounded-xl px-2.5 py-2 text-xs text-amber-300 font-mono focus:outline-none"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-black/50 border border-[#3d362e] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar.value} value={ar.value}>
                    {ar.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Art Style */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1">
                Art Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-black/50 border border-[#3d362e] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {STYLES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Applied Notice */}
          {appliedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{appliedNotice}</span>
            </div>
          )}

          {/* Preview Area */}
          {generatedImage ? (
            <div className="rounded-2xl overflow-hidden border border-[#3d362e] bg-black/60 relative group">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="w-full max-h-[340px] object-contain mx-auto"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] text-amber-300 font-mono border border-amber-500/30">
                  {resolution} • {aspectRatio}
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#3d362e] rounded-2xl p-8 flex flex-col items-center justify-center text-center text-neutral-500 bg-black/20">
              <ImageIcon className="w-12 h-12 text-neutral-600 mb-2 stroke-1" />
              <p className="text-xs">Your generated 4K image preview will appear here</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2d2720] bg-[#1a1714] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {generatedImage && (
              <>
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1.5 transition"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                {onSetAsWallpaper && (
                  <button
                    onClick={() => {
                      onSetAsWallpaper(generatedImage);
                      setAppliedNotice('Applied as background wallpaper!');
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs flex items-center gap-1.5 transition"
                  >
                    <Wallpaper className="w-3.5 h-3.5" />
                    <span>Set Wallpaper</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {generatedImage && onSelectImageForNote && (
              <button
                onClick={() => {
                  onSelectImageForNote(generatedImage, prompt);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>Attach to Note</span>
              </button>
            )}

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing {resolution}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{generatedImage ? 'Regenerate' : 'Generate 4K Artwork'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
