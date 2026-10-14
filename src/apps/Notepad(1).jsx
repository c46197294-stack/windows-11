import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { loadState, saveState, STORAGE_KEYS } from '@/lib/desktopStore';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function Notepad() {
  const [notes, setNotes] = useState(() => loadState(STORAGE_KEYS.notepad, []));
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    saveState(STORAGE_KEYS.notepad, notes);
  }, [notes]);

  useEffect(() => {
    if (!activeId && notes.length) setActiveId(notes[0].id);
  }, [notes, activeId]);

  const active = notes.find((n) => n.id === activeId);

  function newNote() {
    const n = { id: genId(), title: 'Sem título', content: '', updated: new Date().toISOString() };
    setNotes([n, ...notes]);
    setActiveId(n.id);
  }

  function update(field, value) {
    setNotes(notes.map((n) => (n.id === activeId ? { ...n, [field]: value, updated: new Date().toISOString() } : n)));
  }

  function del(id) {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (id === activeId) setActiveId(filtered[0]?.id ?? null);
  }

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="w-48 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
        <button
          onClick={newNote}
          className="m-2 flex items-center gap-2 justify-center bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-500"
        >
          <Plus size={16} /> Novo
        </button>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {notes.length === 0 && <p className="text-xs text-zinc-500 text-center mt-4">Nenhuma nota ainda.</p>}
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={
                'group flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm ' +
                (n.id === activeId ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800')
              }
            >
              <FileText size={14} className="shrink-0 text-amber-500" />
              <span className="truncate flex-1">{n.title || 'Sem título'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); del(n.id); }}
                className="opacity-0 group-hover:opacity-100 text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {active ? (
          <>
            <input
              value={active.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Título"
              className="px-4 py-3 text-lg font-medium bg-transparent border-b border-zinc-200 dark:border-zinc-700 outline-none"
            />
            <textarea
              value={active.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Escreva algo..."
              className="flex-1 p-4 bg-transparent outline-none resize-none text-sm leading-relaxed"
            />
            <div className="px-4 py-2 text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-700">
              Salvo automaticamente · {new Date(active.updated).toLocaleString('pt-BR')}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-400">
            Crie uma nova nota para começar.
          </div>
        )}
      </div>
    </div>
  );
}