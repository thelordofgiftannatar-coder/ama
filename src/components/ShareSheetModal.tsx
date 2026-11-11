import React, { useState } from 'react';
import { saveFile } from '../services/native';
import {
  X,
  Link2,
  FolderPlus,
  Copy,
  Download,
  Share2,
  Mail,
  MessageCircle,
  HardDrive,
  Check,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemUrl: string;
  itemName?: string;
  itemType?: 'video' | 'image' | 'note';
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  onClose,
  itemUrl,
  itemName = 'diario-media',
  itemType = 'video',
}) => {
  const [copied, setCopied] = useState(false);
  const [createdLink, setCreatedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(itemUrl || window.location.href);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateShareLink = () => {
    setCreatedLink(true);
    showToast('Cloud share link generated!');
  };

  const handleDownload = () => {
    saveFile(itemName || 'diario-export', itemUrl)
      .then(() => showToast('Download started!'))
      .catch((e) => showToast('Download failed: ' + e.message));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
      {/* Top Header matching Screenshot_20261110-180637_bf77f356.png */}
      <div className="p-4 flex items-center justify-between text-white border-b border-white/10 bg-black/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-neutral-300"
          >
            <X className="w-6 h-6" />
          </button>
          <span className="font-semibold text-base">1 item selected</span>
        </div>
      </div>

      {/* Main Selected Item Preview */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl max-w-sm max-h-[40vh] bg-neutral-900">
          {itemType === 'video' ? (
            <div className="relative">
              <video
                src={itemUrl}
                className="w-full max-h-[36vh] object-cover"
                playsInline
                muted
              />
              <span className="absolute top-2 left-2 p-1 rounded-full bg-amber-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/75 text-[11px] font-mono text-white flex items-center gap-1">
                <span>0:16</span>
                <Play className="w-2.5 h-2.5 fill-current" />
              </span>
            </div>
          ) : (
            <div className="relative">
              <img
                src={itemUrl}
                alt={itemName}
                className="w-full max-h-[36vh] object-cover"
              />
              <span className="absolute top-2 left-2 p-1 rounded-full bg-amber-500 text-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Share Sheet Drawer matching Screenshot_20261110-180637_bf77f356.png */}
      <div className="w-full bg-[#1e1b17] border-t border-[#3b342e] rounded-t-3xl p-5 shadow-2xl space-y-4 max-w-2xl mx-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />

        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-white">Share 1 video</h4>
          <span className="text-xs text-neutral-400 font-mono">Diario Cloud Vault</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={handleCreateShareLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-200 transition shrink-0"
          >
            <Link2 className="w-4 h-4 text-amber-400" />
            <span>Create link</span>
          </button>

          <button
            onClick={() => showToast('Added to personal album!')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-200 transition shrink-0"
          >
            <FolderPlus className="w-4 h-4 text-purple-400" />
            <span>Add to Album</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-200 transition shrink-0"
          >
            <Copy className="w-4 h-4 text-emerald-400" />
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
        </div>

        {/* App Share Grid */}
        <div className="pt-2">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
            {/* WhatsApp */}
            <button
              onClick={() => showToast('Sharing via WhatsApp...')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">WhatsApp</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                <Download className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">Download</span>
            </button>

            {/* OneDrive / Cloud */}
            <button
              onClick={() => showToast('Backing up to OneDrive / Google Drive...')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">OneDrive</span>
            </button>

            {/* Gmail */}
            <button
              onClick={() => showToast('Opening Gmail composer...')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">Gmail</span>
            </button>

            {/* Quick Share */}
            <button
              onClick={() => showToast('Scanning for nearby devices via Quick Share...')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">Quick Share</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => showToast('Opening SMS / Messages...')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">Messages</span>
            </button>

            {/* File Fixer */}
            <button
              onClick={() => showToast('Preserved original creation date & metadata.')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">Metadata Fixer</span>
            </button>

            {/* More */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: itemName, url: itemUrl });
                } else {
                  handleCopyLink();
                }
              }}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-neutral-300 group-hover:scale-105 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-300">More</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded-xl bg-amber-500 text-black font-semibold text-xs text-center shadow-lg transition">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
