import { useState } from 'react';
import { X } from 'lucide-react';
import { isValidHttpsUrl, normalizeHttpsUrl } from './storeCatalog';

// Formulário para cadastrar/editar um app web do usuário.
// Aceita apenas HTTPS válido; nenhuma execução de código, só endereço + texto.
export default function CustomAppDialog({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [description, setDescription] = useState(initial?.description === 'Aplicativo web cadastrado por você.' ? '' : (initial?.description || ''));
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    const normalized = normalizeHttpsUrl(url);
    if (!name.trim()) { setError('Digite um nome para o aplicativo.'); return; }
    if (!isValidHttpsUrl(normalized)) { setError('Endereço inválido. Use uma URL completa HTTPS, ex.: https://meuapp.base44.app'); return; }
    setError('');
    onSave({ name, url: normalized, description });
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{initial ? 'Editar aplicativo' : 'Adicionar aplicativo web'}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={16} /></button>
        </div>

        <label className="block text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400">Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meu projeto"
          className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent outline-none focus:border-blue-500"
        />

        <label className="block text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400">Endereço (HTTPS)</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://meuapp.base44.app"
          inputMode="url"
          autoCapitalize="off"
          className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent outline-none focus:border-blue-500"
        />

        <label className="block text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400">Descrição (opcional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Do que se trata o aplicativo"
          className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent outline-none focus:border-blue-500 resize-none"
        />

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancelar</button>
          <button type="submit" className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Salvar</button>
        </div>
      </form>
    </div>
  );
}