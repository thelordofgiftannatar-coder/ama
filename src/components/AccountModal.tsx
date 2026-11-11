import React, { useState } from 'react';
import { X, Cloud, Check, ShieldCheck, Mail, User, RefreshCw, Key } from 'lucide-react';
import { UserAccount } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  onUpdateAccount: (account: UserAccount) => void;
  onSyncNow: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
  onSyncNow,
}) => {
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [syncKey, setSyncKey] = useState(account.syncKey);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount({
      ...account,
      name: name.trim() || account.name,
      email: email.trim() || account.email,
      syncKey: syncKey.trim() || account.syncKey,
      lastSynced: Date.now(),
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#191614] border border-[#3b342e] rounded-3xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Google Account & Cloud Sync</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card matching Screenshot_20261110-180023_d5ba66b6.png */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/50 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white truncate text-base">{account.name}</h4>
            <p className="text-xs text-neutral-400 truncate">{account.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-300 font-medium">Google Connected</span>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Display Name
            </label>
            <div className="flex items-center gap-2 bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white">
              <User className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Google Account Email
            </label>
            <div className="flex items-center gap-2 bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white">
              <Mail className="w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Cross-Platform Sync Passcode
            </label>
            <div className="flex items-center gap-2 bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300">
              <Key className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={syncKey}
                onChange={(e) => setSyncKey(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Use this key to load your diary on any phone, tablet, or browser.
            </p>
          </div>

          {/* Ad Blocker Shield Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ad & Tracker Blocker: Active</span>
            </div>
            <span className="font-semibold text-[11px]">100% Private</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onSyncNow}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Cloud Now</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Saved' : 'Save Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
