import { useState } from 'react';
import { Search, Plus, Store as StoreIcon, PackageOpen } from 'lucide-react';
import { CATEGORIES, STORE_APPS, getCustomApps, saveCustomApps, makeCustomApp } from '@/apps/store/storeCatalog';
import StoreCard from '@/apps/store/StoreCard';
import CustomAppDialog from '@/apps/store/CustomAppDialog';

export default function AppStore({ openApp }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [customs, setCustoms] = useState(() => getCustomApps());
  const [dialog, setDialog] = useState(null); // null | {editing?} para o formulário

  function openUrl(url) {
    // Reutiliza o Navegador já registrado — nenhuma janela ou iframe novo é criado.
    openApp?.('browser', { startUrl: url });
  }

  function saveCustom(data) {
    let next;
    if (dialog?.editing) {
      next = customs.map((a) => (a.id === dialog.editing.id ? { ...a, ...data, officialUrl: data.url } : a));
    } else {
      next = [...customs, makeCustomApp(data)];
    }
    setCustoms(next);
    saveCustomApps(next);
    setDialog(null);
  }

  function deleteCustom(app) {
    const next = customs.filter((a) => a.id !== app.id);
    setCustoms(next);
    saveCustomApps(next);
  }

  const q = search.trim().toLowerCase();
  const all = [...STORE_APPS, ...customs];
  const filtered = all.filter((a) => {
    const inCategory = category === 'Todos' || a.category === category;
    const matches = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    return inCategory && matches;
  });

  const chips = ['Todos', ...CATEGORIES];

  return (
    <div className="relative flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Cabeçalho */}
      <div className="px-4 pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center">
            <StoreIcon size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold leading-tight">Loja de Aplicativos</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Catálogo de links e aplicativos web — não instala APKs</p>
          </div>
          <button
            onClick={() => setDialog({})}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <Search size={15} className="text-zinc-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar aplicativos"
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Categorias */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800" style={{ scrollbarWidth: 'none' }}>
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={'shrink-0 px-3 py-1.5 text-xs rounded-full border transition ' + (category === c
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800')}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grade de cartões */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
            <PackageOpen size={40} className="text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm font-medium">Nenhum aplicativo encontrado</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              {category === 'Jogos'
                ? 'Ainda não há jogos no catálogo — nenhum link foi adicionado até o momento.'
                : category === 'Meus Aplicativos Web'
                  ? 'Cadastre seus aplicativos web (Base44, Lovable…) com o botão Adicionar.'
                  : 'Tente outro termo de pesquisa ou outra categoria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
            {filtered.map((app) => (
              <StoreCard
                key={app.id}
                app={app}
                isCustom={app.category === 'Meus Aplicativos Web'}
                onOpen={openUrl}
                onOfficial={openUrl}
                onEdit={(a) => setDialog({ editing: a })}
                onDelete={deleteCustom}
              />
            ))}
          </div>
        )}

        <p className="mt-4 mb-1 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
          Observação: alguns sites (Google, YouTube, bancos) bloqueiam exibição dentro de janelas por segurança.
          Nesses casos, use o botão “Nova aba” do cartão para abrir no navegador do aparelho.
        </p>
      </div>

      {dialog && (
        <CustomAppDialog
          initial={dialog.editing}
          onSave={saveCustom}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}