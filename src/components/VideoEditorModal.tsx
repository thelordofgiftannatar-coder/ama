import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Camera,
  Wand2,
  Crop,
  Music,
  Type,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Check,
  RotateCcw,
  Film,
  Download,
  Share2,
} from 'lucide-react';
import { VideoEditorParams } from '../types';

interface VideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoName?: string;
  onSaveEditedVideo: (params: VideoEditorParams, snapshotUrl?: string) => void;
  onOpenShareSheet?: (url: string, name?: string) => void;
}

type ToolType =
  | 'quickfix'
  | 'crop'
  | 'music'
  | 'text'
  | 'adjust'
  | 'filters'
  | 'effects'
  | 'volume'
  | 'speed'
  | null;

const SOUNDTRACKS = [
  { name: 'None', url: null },
  { name: 'Lo-Fi Chill Beat', url: 'https://cdn.freesound.org/previews/530/530887_11861866-lq.mp3' },
  { name: 'Cinematic Ambient', url: 'https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3' },
  { name: 'Cyberpunk Synth', url: 'https://cdn.freesound.org/previews/495/495817_10486829-lq.mp3' },
];

const FILTERS = [
  { id: 'none', name: 'Normal', filterStyle: 'none' },
  { id: 'cinematic', name: 'Cinematic', filterStyle: 'contrast(1.2) saturate(1.3) hue-rotate(-10deg)' },
  { id: 'vintage', name: 'Vintage', filterStyle: 'sepia(0.5) contrast(1.1) brightness(0.95)' },
  { id: 'noir', name: 'B&W Noir', filterStyle: 'grayscale(1) contrast(1.4)' },
  { id: 'cyberpunk', name: 'Cyberpunk', filterStyle: 'hue-rotate(180deg) saturate(1.8) contrast(1.2)' },
  { id: 'warm', name: 'Warm Amber', filterStyle: 'sepia(0.3) saturate(1.4) brightness(1.05)' },
  { id: 'cool', name: 'Cool Matrix', filterStyle: 'hue-rotate(90deg) saturate(1.2)' },
];

const EFFECTS = [
  { id: 'none', name: 'None' },
  { id: 'glitch', name: 'Glitch' },
  { id: 'slowmo', name: 'Slow Motion' },
  { id: 'blur', name: 'Soft Focus' },
  { id: 'glow', name: 'Dream Glow' },
  { id: 'grain', name: 'Film Grain' },
];

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoName = 'Edited_Video.mp4',
  onSaveEditedVideo,
  onOpenShareSheet,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioTrackRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(16);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(16);
  const [activeTool, setActiveTool] = useState<ToolType>('adjust');

  // Adjustments
  const [brightness, setBrightness] = useState(0); // -50 to 50
  const [contrast, setContrast] = useState(0); // -50 to 50
  const [saturation, setSaturation] = useState(0); // -50 to 50
  const [vignette, setVignette] = useState(0); // 0 to 100

  // Filter & Effect
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedEffect, setSelectedEffect] = useState('none');

  // Audio / Music / Volume
  const [volume, setVolume] = useState(100);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);

  // Speed
  const [speed, setSpeed] = useState(1.0);

  // Text Overlay
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('center');

  // Captured snapshot
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      videoRef.current.volume = volume / 100;
    }
  }, [speed, volume]);

  if (!isOpen) return null;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Loop within trim boundaries
      if (cur >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 16;
      setDuration(dur);
      setTrimEnd(dur);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (audioTrackRef.current) audioTrackRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play();
      if (audioTrackRef.current && selectedMusic) {
        audioTrackRef.current.currentTime = videoRef.current.currentTime;
        audioTrackRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  // Capture current frame snapshot
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setSnapshotUrl(dataUrl);
        alert('Frame captured! Snapshot saved to gallery.');
      }
    } catch (e) {
      console.warn('Canvas export tainted', e);
    }
  };

  const handleQuickFix = () => {
    setBrightness(10);
    setContrast(15);
    setSaturation(20);
    setSelectedFilter('cinematic');
  };

  const handleReset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setVignette(0);
    setSelectedFilter('none');
    setSelectedEffect('none');
    setSpeed(1.0);
    setVolume(100);
    setOverlayText('');
    setTrimStart(0);
    setTrimEnd(duration);
  };

  const handleSave = () => {
    const params: VideoEditorParams = {
      videoUrl,
      videoName,
      trimStart,
      trimEnd,
      speed,
      volume,
      filter: selectedFilter as any,
      effect: selectedEffect as any,
      adjustments: {
        brightness,
        contrast,
        saturation,
        exposure: brightness,
        vignette,
      },
      textOverlay: {
        text: overlayText,
        color: textColor,
        fontSize: 24,
        position: textPosition,
        hasBackground: true,
      },
      musicTrack: selectedMusic,
    };

    onSaveEditedVideo(params, snapshotUrl || undefined);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  // Format seconds into MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute CSS filter
  const filterObj = FILTERS.find((f) => f.id === selectedFilter);
  const baseFilter = filterObj ? filterObj.filterStyle : 'none';
  const customAdjustFilter = `brightness(${1 + brightness / 100}) contrast(${
    1 + contrast / 100
  }) saturate(${1 + saturation / 100})`;
  const combinedFilter =
    baseFilter === 'none' ? customAdjustFilter : `${baseFilter} ${customAdjustFilter}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none">
      {/* Top Header matching Screenshot_20261110-180656_4e2eee6d.png */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-20">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <span className="text-sm font-semibold text-neutral-300 truncate max-w-xs">
          {videoName}
        </span>

        <div className="flex items-center gap-2">
          {onOpenShareSheet && (
            <button
              onClick={() => onOpenShareSheet(videoUrl, videoName)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition"
              title="Share Video"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaved}
            className="px-5 py-1.5 rounded-full bg-[#4a4239] hover:bg-[#5e5348] text-white text-sm font-medium transition shadow-sm flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Preview Player */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden p-2">
        <div className="relative max-h-full max-w-full aspect-[9/16] sm:aspect-video flex items-center justify-center rounded-xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className={`w-full h-full object-contain cursor-pointer transition-all ${
              selectedEffect === 'glitch'
                ? 'animate-pulse'
                : selectedEffect === 'blur'
                ? 'blur-[1.5px]'
                : selectedEffect === 'glow'
                ? 'drop-shadow-[0_0_15px_rgba(255,200,50,0.6)]'
                : ''
            }`}
            style={{
              filter: combinedFilter,
            }}
          />

          {/* Vignette Overlay */}
          {vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 ${vignette * 1.5}px rgba(0,0,0,0.85)`,
              }}
            />
          )}

          {/* Text Overlay */}
          {overlayText && (
            <div
              className={`absolute inset-x-4 flex justify-center pointer-events-none transition-all ${
                textPosition === 'top'
                  ? 'top-8'
                  : textPosition === 'bottom'
                  ? 'bottom-12'
                  : 'top-1/2 -translate-y-1/2'
              }`}
            >
              <span
                className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-center font-bold text-lg sm:text-2xl shadow-xl border border-white/10"
                style={{ color: textColor }}
              >
                {overlayText}
              </span>
            </div>
          )}

          {/* Hidden Audio Track for Background Music */}
          {selectedMusic && (
            <audio ref={audioTrackRef} src={selectedMusic} loop />
          )}
        </div>
      </div>

      {/* Controls Bar: Play / Pause, Timecode [00:00 / 00:16] & Snapshot Button */}
      <div className="flex items-center justify-center gap-4 py-2 bg-black/80">
        <button
          onClick={togglePlay}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Timecode Pill with Snapshot Camera Button matching Screenshot_20261110-180656_4e2eee6d.png */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#25221d] border border-[#3d372e] text-xs font-mono text-neutral-300">
          <button
            onClick={handleCaptureSnapshot}
            className="p-1 -ml-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition"
            title="Take 4K Snapshot Frame"
          >
            <Camera className="w-4 h-4" />
          </button>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
          title="Reset Edits"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Scrubber & Trimming Strip matching Screenshot_20261110-180656_4e2eee6d.png */}
      <div className="px-4 py-2 bg-black/90">
        <div className="relative h-14 bg-[#1e1c18] rounded-xl border border-[#3b332b] flex items-center overflow-hidden">
          {/* Keyframe visual filmstrip background */}
          <div className="absolute inset-0 flex items-center opacity-30 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full border-r border-neutral-700 bg-neutral-800 flex items-center justify-center"
              >
                <Film className="w-4 h-4 text-neutral-500" />
              </div>
            ))}
          </div>

          {/* Trimmed Window Highlight */}
          <div
            className="absolute top-0 bottom-0 bg-amber-500/20 border-y-2 border-amber-500 pointer-events-none"
            style={{
              left: `${(trimStart / (duration || 1)) * 100}%`,
              right: `${100 - (trimEnd / (duration || 1)) * 100}%`,
            }}
          />

          {/* Left Trim Handle */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-amber-500 rounded-l-md cursor-ew-resize flex items-center justify-center z-10 shadow-lg"
            style={{ left: `${(trimStart / (duration || 1)) * 100}%` }}
          >
            <div className="w-0.5 h-4 bg-black rounded-full" />
          </div>

          {/* Right Trim Handle */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-amber-500 rounded-r-md cursor-ew-resize flex items-center justify-center z-10 shadow-lg"
            style={{ right: `${100 - (trimEnd / (duration || 1)) * 100}%` }}
          >
            <div className="w-0.5 h-4 bg-black rounded-full" />
          </div>

          {/* Current Playhead Scrubber */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-md"
            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white -ml-1 -mt-1 shadow-lg" />
          </div>

          {/* Interactive Scrub Range */}
          <input
            type="range"
            min={0}
            max={duration || 16}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (videoRef.current) {
                videoRef.current.currentTime = val;
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-30"
          />
        </div>

        {/* Trim Duration Info */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 font-mono">
          <span>Start: {formatTime(trimStart)}</span>
          <span className="text-amber-400 font-semibold">
            Clip: {(trimEnd - trimStart).toFixed(1)}s
          </span>
          <span>End: {formatTime(trimEnd)}</span>
        </div>
      </div>

      {/* Active Tool Sub-Panel */}
      <div className="px-4 py-3 bg-[#171513] border-t border-[#2d2720] min-h-[90px] flex items-center">
        {activeTool === 'quickfix' && (
          <div className="w-full flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">One-Tap Quick Fix</h4>
              <p className="text-[11px] text-neutral-400">
                Auto-balances exposure, rich contrast, and cinematic color tone
              </p>
            </div>
            <button
              onClick={handleQuickFix}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <Wand2 className="w-4 h-4" />
              <span>Apply Fix</span>
            </button>
          </div>
        )}

        {activeTool === 'crop' && (
          <div className="w-full space-y-2">
            <span className="text-xs font-semibold text-neutral-400">Trim Bounds</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Start Point: {trimStart.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min={0}
                  max={trimEnd - 0.5}
                  step={0.2}
                  value={trimStart}
                  onChange={(e) => setTrimStart(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  End Point: {trimEnd.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min={trimStart + 0.5}
                  max={duration}
                  step={0.2}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTool === 'adjust' && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Brightness</span>
                <span>{brightness}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Contrast</span>
                <span>{contrast}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Saturation</span>
                <span>{saturation}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Vignette</span>
                <span>{vignette}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={vignette}
                onChange={(e) => setVignette(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {activeTool === 'filters' && (
          <div className="w-full flex items-center gap-2 overflow-x-auto py-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition border ${
                  selectedFilter === f.id
                    ? 'bg-amber-500 text-black font-bold border-amber-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {activeTool === 'effects' && (
          <div className="w-full flex items-center gap-2 overflow-x-auto py-1">
            {EFFECTS.map((eff) => (
              <button
                key={eff.id}
                onClick={() => setSelectedEffect(eff.id)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition border ${
                  selectedEffect === eff.id
                    ? 'bg-purple-600 text-white font-bold border-purple-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                }`}
              >
                {eff.name}
              </button>
            ))}
          </div>
        )}

        {activeTool === 'text' && (
          <div className="w-full flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="Add text overlay on video..."
              className="flex-1 min-w-[200px] bg-black/50 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <div className="flex items-center gap-1.5">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTextPosition(pos)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] capitalize ${
                    textPosition === pos ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent"
              title="Text Color"
            />
          </div>
        )}

        {activeTool === 'music' && (
          <div className="w-full flex items-center gap-2 overflow-x-auto">
            {SOUNDTRACKS.map((st) => (
              <button
                key={st.name}
                onClick={() => setSelectedMusic(st.url)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition border ${
                  selectedMusic === st.url
                    ? 'bg-amber-500 text-black font-bold border-amber-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        )}

        {activeTool === 'volume' && (
          <div className="w-full flex items-center gap-4">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 100)}
              className="p-2 rounded-xl bg-white/10 text-white"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Gain</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {activeTool === 'speed' && (
          <div className="w-full flex items-center gap-2 overflow-x-auto">
            {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                  speed === s
                    ? 'bg-amber-500 text-black font-bold border-amber-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Editing Toolbar matching Screenshot_20261110-180651_d76c87fa.png */}
      <div className="flex items-center justify-around py-3 px-2 bg-black border-t border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTool('quickfix')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'quickfix' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          <span className="text-[11px]">Quick fix</span>
        </button>

        <button
          onClick={() => setActiveTool('crop')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'crop' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Crop className="w-5 h-5" />
          <span className="text-[11px]">Crop</span>
        </button>

        <button
          onClick={() => setActiveTool('music')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'music' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Music className="w-5 h-5" />
          <span className="text-[11px]">Music</span>
        </button>

        <button
          onClick={() => setActiveTool('text')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'text' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="text-[11px]">Text</span>
        </button>

        <button
          onClick={() => setActiveTool('adjust')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'adjust' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[11px]">Adjust</span>
        </button>

        <button
          onClick={() => setActiveTool('filters')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'filters' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px]">Filters</span>
        </button>

        <button
          onClick={() => setActiveTool('effects')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'effects' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px]">Effects</span>
        </button>

        <button
          onClick={() => setActiveTool('volume')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'volume' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[11px]">Volume</span>
        </button>

        <button
          onClick={() => setActiveTool('speed')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition ${
            activeTool === 'speed' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[11px]">Speed</span>
        </button>
      </div>
    </div>
  );
};
