import { useState } from 'react';
import { Folder, FileText, ChevronRight, Plus, FilePlus, FolderPlus, Trash2, Pencil, Home } from 'lucide-react';
import {
  getChildren, getPath, createFolder, createFile, renameNode, deleteToRecycle, updateFileContent, getNode,
} from '@/lib/vfs';

export default function FileExplorer({ startId = 'root' }) {
  const [currentId, setCurrentId] = useState(startId);
  const [, force] = useState(0);
  const refresh = () => force((x) => x + 1);
  const [editing, setEditing] = useState(null); // file node being previewed
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState('');

  const children = getChildren(currentId);
  const path = getPath(currentId);

  function openNode(node) {
    if (node.type === 'folder') {
      setCurrentId(node.id);
      setEditing(null);
    } else {
      setEditing(getNode(node.id));
    }
  }

  function doRename() {
    if (renaming) {
      renameNode(renaming.id, renameVal);
      refresh();
    }
    setRenaming(null);
  }

  if (editing) {
    return <FileEditor file={editing} onBack={() => { setEditing(null); refresh(); }} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
        <button onClick={() => setCurrentId('root')} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Início"><Home size={16} /></button>
        <div className="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap">
          {path.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-zinc-400" />}
              <button onClick={() => setCurrentId(p.id)} className="hover:text-blue-500">{p.name}</button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-700 text-sm">
        <button onClick={() => { createFolder(currentId, 'Nova Pasta'); refresh(); }} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><FolderPlus size={14} /> Pasta</button>
        <button onClick={() => { createFile(currentId, 'Novo Arquivo.txt', ''); refresh(); }} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><FilePlus size={14} /> Arquivo</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {children.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center mt-8">Pasta vazia.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
            {children.map((node) => (
              <div
                key={node.id}
                className="group relative flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                onClick={() => openNode(node)}
                onDoubleClick={() => openNode(node)}
              >
                {node.type === 'folder' ? (
                  <Folder size={40} className="text-amber-400" fill="#fbbf24" />
                ) : (
                  <FileText size={40} className="text-blue-400" />
                )}
                {renaming && renaming.id === node.id ? (
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    onBlur={doRename}
                    onKeyDown={(e) => { if (e.key === 'Enter') doRename(); }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-xs text-center bg-white dark:bg-zinc-800 border border-blue-500 rounded px-1 outline-none"
                  />
                ) : (
                  <span className="text-xs text-center truncate w-full">{node.name}</span>
                )}
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5 bg-white/90 dark:bg-zinc-900/90 rounded">
                  <button
                    onClick={(e) => { e.stopPropagation(); setRenaming(node); setRenameVal(node.name); }}
                    className="p-1 text-zinc-500 hover:text-blue-500"
                    title="Renomear"
                  ><Pencil size={12} /></button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Mover "${node.name}" para a Lixeira?`)) { deleteToRecycle(node.id); refresh(); } }}
                    className="p-1 text-zinc-500 hover:text-red-500"
                    title="Excluir"
                  ><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileEditor({ file, onBack }) {
  const [content, setContent] = useState(file.content || '');

  function save() {
    updateFileContent(file.id, content);
    onBack();
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
        <button onClick={onBack} className="text-sm text-blue-500 hover:underline">← Voltar</button>
        <span className="text-sm font-medium">{file.name}</span>
        <button onClick={save} className="ml-auto px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500">Salvar</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-4 bg-transparent outline-none resize-none text-sm font-mono"
      />
    </div>
  );
}