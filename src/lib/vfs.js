// Sistema de arquivos virtual persistido em localStorage.
// Usado pelo Explorador de Arquivos, Meus Arquivos e Lixeira.
import { loadState, saveState, STORAGE_KEYS } from './desktopStore';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getNodes() {
  let nodes = loadState(STORAGE_KEYS.vfs, null);
  if (!nodes) {
    const docs = genId();
    const pics = genId();
    const dl = genId();
    nodes = [
      { id: 'root', name: 'Este Computador', type: 'folder', parentId: null, created: new Date().toISOString() },
      { id: docs, name: 'Documentos', type: 'folder', parentId: 'root', created: new Date().toISOString() },
      { id: pics, name: 'Imagens', type: 'folder', parentId: 'root', created: new Date().toISOString() },
      { id: dl, name: 'Downloads', type: 'folder', parentId: 'root', created: new Date().toISOString() },
      { id: genId(), name: 'Bem-vindo.txt', type: 'file', parentId: docs, content: 'Bem-vindo ao seu desktop virtual!\n\nEste é um arquivo de exemplo salvo localmente no seu navegador.', created: new Date().toISOString() },
    ];
    saveState(STORAGE_KEYS.vfs, nodes);
  }
  return nodes;
}

export function saveNodes(nodes) {
  saveState(STORAGE_KEYS.vfs, nodes);
}

export function getChildren(parentId) {
  return getNodes()
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function getNode(id) {
  return getNodes().find((n) => n.id === id);
}

export function getPath(id) {
  const path = [];
  let cur = getNode(id);
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? getNode(cur.parentId) : null;
  }
  return path;
}

export function createFolder(parentId, name) {
  const nodes = getNodes();
  const node = { id: genId(), name: name || 'Nova Pasta', type: 'folder', parentId, created: new Date().toISOString() };
  nodes.push(node);
  saveNodes(nodes);
  return node;
}

export function createFile(parentId, name, content = '') {
  const nodes = getNodes();
  const node = { id: genId(), name: name || 'Novo Arquivo.txt', type: 'file', parentId, content, created: new Date().toISOString() };
  nodes.push(node);
  saveNodes(nodes);
  return node;
}

export function updateFileContent(id, content) {
  const nodes = getNodes();
  const n = nodes.find((x) => x.id === id);
  if (n) {
    n.content = content;
    saveNodes(nodes);
  }
}

export function renameNode(id, name) {
  if (!name) return;
  const nodes = getNodes();
  const n = nodes.find((x) => x.id === id);
  if (n) {
    n.name = name;
    saveNodes(nodes);
  }
}

export function deleteToRecycle(id) {
  if (id === 'root') return;
  const nodes = getNodes();
  const node = nodes.find((x) => x.id === id);
  if (!node) return;
  const toRemove = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) {
      if (n.parentId && toRemove.has(n.parentId) && !toRemove.has(n.id)) {
        toRemove.add(n.id);
        changed = true;
      }
    }
  }
  const removed = nodes.filter((n) => toRemove.has(n.id));
  const remaining = nodes.filter((n) => !toRemove.has(n.id));
  saveNodes(remaining);
  const recycle = loadState(STORAGE_KEYS.recycle, []);
  const entry = {
    id: genId(),
    originalId: id,
    name: node.name,
    type: node.type,
    parentId: node.parentId,
    nodes: removed,
    deletedAt: new Date().toISOString(),
  };
  recycle.unshift(entry);
  saveState(STORAGE_KEYS.recycle, recycle);
  return entry;
}

export function getRecycle() {
  return loadState(STORAGE_KEYS.recycle, []);
}

export function restoreFromRecycle(recycleId) {
  const recycle = loadState(STORAGE_KEYS.recycle, []);
  const entry = recycle.find((e) => e.id === recycleId);
  if (!entry) return;
  const nodes = getNodes();
  for (const n of entry.nodes) {
    if (!nodes.find((x) => x.id === n.id)) nodes.push(n);
  }
  saveNodes(nodes);
  saveState(STORAGE_KEYS.recycle, recycle.filter((e) => e.id !== recycleId));
}

export function purgeFromRecycle(recycleId) {
  const recycle = loadState(STORAGE_KEYS.recycle, []);
  saveState(STORAGE_KEYS.recycle, recycle.filter((e) => e.id !== recycleId));
}

export function emptyRecycle() {
  saveState(STORAGE_KEYS.recycle, []);
}

export function diskUsage() {
  const nodes = getNodes();
  const recycle = getRecycle();
  return {
    folders: nodes.filter((n) => n.type === 'folder').length,
    files: nodes.filter((n) => n.type === 'file').length,
    recycled: recycle.length,
  };
}