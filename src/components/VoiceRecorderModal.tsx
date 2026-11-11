import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, X, Sparkles } from 'lucide-react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVoiceNote: (audioUrl: string, duration: number, transcript: string) => void;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSaveVoiceNote,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping mediaRecorder', e);
      }
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleStopRecording();
      setAudioUrl(null);
      setTranscript('');
      setRecordingSeconds(0);
    }
    return () => {
      handleStopRecording();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Try live Speech Recognition if available in browser
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + ' ';
            }
            setTranscript(current.trim());
          };
          recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition error', e);
        }
      }
    } catch (err: any) {
      alert('Microphone access denied or not supported: ' + err.message);
    }
  };

  const handleSave = () => {
    if (audioUrl) {
      onSaveVoiceNote(audioUrl, recordingSeconds || 5, transcript);
      onClose();
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#1c1824] border border-purple-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Voice Memo & Transcription</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Waves Visualizer */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-3xl font-mono font-bold text-purple-300 mb-4">
            {formatTimer(recordingSeconds)}
          </div>

          <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-xs">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isRecording
                    ? 'bg-purple-500 animate-pulse'
                    : audioUrl
                    ? 'bg-emerald-500'
                    : 'bg-neutral-700'
                }`}
                style={{
                  height: isRecording
                    ? `${20 + Math.sin(i * 0.8 + recordingSeconds * 2) * 25}px`
                    : audioUrl
                    ? '24px'
                    : '8px',
                }}
              />
            ))}
          </div>

          {/* Record / Stop Button */}
          <div className="mt-6 flex items-center gap-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition"
                title="Start Recording"
              >
                <Mic className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition animate-pulse"
                title="Stop Recording"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Live Transcript Box */}
        {(transcript || isRecording) && (
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Live Transcription</span>
            </span>
            <p className="text-xs text-neutral-300 italic min-h-[30px]">
              {transcript || (isRecording ? 'Listening...' : 'No speech detected.')}
            </p>
          </div>
        )}

        {/* Saved Audio Playback Preview */}
        {audioUrl && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <audio ref={audioPlayerRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
            <button
              onClick={() => {
                if (audioPlayerRef.current) {
                  if (isPlaying) {
                    audioPlayerRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    audioPlayerRef.current.play();
                    setIsPlaying(true);
                  }
                }
              }}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 text-xs font-semibold"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Memo'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
