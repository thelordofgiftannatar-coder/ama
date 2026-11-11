import React, { useState } from 'react';
import {
  Book,
  BookOpen,
  Plus,
  ChevronRight,
  FolderLock,
  MoreVertical,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { Notebook, Note } from '../types';

interface NotebookListViewProps {
  notebooks: Notebook[];
  notes: Note[];
  selectedNotebookId: string | null;
  onSelectNotebook: (id: string | null) => void;
  onAddNotebook: (name: string, color?: string) => void;
  onAddSection: (notebookId: string, sectionName: string) => void;
}

export const NotebookListView: React.FC<NotebookListViewProps> = ({
  notebooks,
  notes,
  selectedNotebookId,
  onSelectNotebook,
  onAddNotebook,
  onAddSection,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookColor, setNewNotebookColor] = useState('#e11d48');
  const [expandedNotebookId, setExpandedNotebookId] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState('');
  const [addingSectionForId, setAddingSectionForId] = useState<string | null>(null);

  const activeNotebooks = notebooks.filter((nb) => !nb.isClosed);
  const closedNotebooks = notebooks.filter((nb) => nb.isClosed);

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNotebookName.trim()) {
      onAddNotebook(newNotebookName.trim(), newNotebookColor);
      setNewNotebookName('');
      setShowAddModal(false);
    }
  };

  const handleCreateSection = (notebookId: string) => {
    if (newSectionName.trim()) {
      onAddSection(notebookId, newSectionName.trim());
      setNewSectionName('');
      setAddingSectionForId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-3 text-white">
      {/* Active Notebooks List */}
      <div className="space-y-2">
        {activeNotebooks.map((nb) => {
          const nbNotes = notes.filter((n) => n.notebookId === nb.id && !n.isTrash);
          const isSelected = selectedNotebookId === nb.id;
          const isExpanded = expandedNotebookId === nb.id;

          return (
            <div
              key={nb.id}
              className={`rounded-2xl transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#29221a] border-amber-500/50'
                  : 'bg-[#181614]/90 border-[#2d2822] hover:bg-[#201d19]'
              }`}
            >
              <div
                onClick={() => onSelectNotebook(isSelected ? null : nb.id)}
                className="flex items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: nb.color || '#e11d48' }}
                  >
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white tracking-tight truncate">
                        {nb.name}
                      </h4>
                      {nb.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {nbNotes.length} {nbNotes.length === 1 ? 'page' : 'pages'} • {nb.sections?.length || 0} sections
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedNotebookId(isExpanded ? null : nb.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
                    title="Toggle sections"
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Sections list inside notebook */}
              {isExpanded && (
                <div className="px-4 pb-3 pt-1 border-t border-white/5 space-y-1.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Sections
                  </div>
                  {nb.sections?.map((sec) => {
                    const secNotes = nbNotes.filter((n) => n.sectionId === sec.id);
                    return (
                      <div
                        key={sec.id}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 transition"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sec.name}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">{secNotes.length} notes</span>
                      </div>
                    );
                  })}

                  {/* Add Section */}
                  {addingSectionForId === nb.id ? (
                    <div className="flex items-center gap-1 pt-1">
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="Section title..."
                        className="flex-1 bg-black/40 border border-neutral-700 text-xs rounded px-2 py-1 text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleCreateSection(nb.id)}
                        className="p-1 rounded bg-amber-500 text-black text-xs font-semibold px-2"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingSectionForId(null)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingSectionForId(nb.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closed Notebooks Section matching Screenshot_20261110-175947_1c8ec2fa.png */}
      {closedNotebooks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
            Closed Notebooks
          </h5>
          <div className="space-y-1.5">
            {closedNotebooks.map((nb) => (
              <div
                key={nb.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 transition"
              >
                <div className="flex items-center gap-3">
                  <FolderLock className="w-5 h-5 text-neutral-500" />
                  <span className="font-medium text-sm text-neutral-200">{nb.name}</span>
                </div>
                <button
                  onClick={() => onSelectNotebook(nb.id)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
          <button className="text-xs text-purple-400 hover:text-purple-300 mt-2 block">
            See All
          </button>
        </div>
      )}

      {/* Bottom Floating Add Notebook Button matching Screenshot_20261110-175947_1c8ec2fa.png */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#201a2b] hover:bg-[#2b223b] text-purple-200 border border-purple-500/40 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 text-purple-400" />
          <span className="font-medium text-sm">Add Notebook</span>
        </button>
      </div>

      {/* Add Notebook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleCreateNotebook}
            className="w-full max-w-sm rounded-2xl bg-[#1e1c24] border border-[#3b3447] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Notebook</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Notebook Name</label>
              <input
                type="text"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                placeholder="e.g. BEWARE THE MAN OF TOMORROW!"
                autoFocus
                className="w-full rounded-xl bg-black/40 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1.5">Color Accent</label>
              <div className="flex items-center gap-2">
                {['#e11d48', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'].map(
                  (col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewNotebookColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        newNotebookColor === col ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
