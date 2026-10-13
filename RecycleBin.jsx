import { useState } from 'react';
import { RotateCcw, Trash2, Folder, FileText } from 'lucide-react';
import { getRecycle, restoreFromRecycle, purgeFromRecycle, emptyRecycle } from '@/lib/vfs';

export default function RecycleBin() {
  const [, force] = useState(0);
  const refresh = () => force((x) => x + 1);
  const items = getRecycle();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-sm font-semibold">Lixeira · {items.length} item(ns)</h2>
        <button
          onClick={() => { if (items.length && confirm('Esvaziar a lixeira? Isso remove os arquivos definitivamente.')) { emptyRecycle(); refresh(); } }}
          disabled={!items.length}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-40"
        >
          <Trash2 size={14} /> Esvaziar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center mt-8">A lixeira está vazia.</p>
        ) : (
          <div className="space-y-1">
            {items.map((e) => (
              <div key={e.id} className="group flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {e.type === 'folder' ? <Folder size={20} className="text-amber-400" /> : <FileText size={20} className="text-blue-400" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{e.name}</div>
                  <div className="text-xs text-zinc-500">Excluído em {new Date(e.deletedAt).toLocaleString('pt-BR')}</div>
                </div>
                <button
                  onClick={() => { restoreFromRecycle(e.id); refresh(); }}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                >
                  <RotateCcw size={14} /> Restaurar
                </button>
                <button
                  onClick={() => { if (confirm('Remover definitivamente?')) { purgeFromRecycle(e.id); refresh(); } }}
                  className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}