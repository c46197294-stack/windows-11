import { ExternalLink, Globe, Pencil, Trash2, Play } from 'lucide-react';

// Cartão de um aplicativo na loja. Ícone, nome, descrição e ações.
export default function StoreCard({ app, isCustom, onOpen, onOfficial, onEdit, onDelete }) {
  const Icon = app.icon;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 p-3.5 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ background: app.color + '22', color: app.color }}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{app.name}</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-3">{app.description}</p>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex flex-wrap gap-1.5">
        {app.url && (
          <button
            onClick={() => onOpen(app.url)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Play size={12} /> Abrir
          </button>
        )}
        {app.officialUrl && app.officialUrl !== app.url && (
          <button
            onClick={() => onOfficial(app.officialUrl)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <Globe size={12} /> Página oficial
          </button>
        )}
        <a
          href={app.officialUrl || app.url}
          target="_blank"
          rel="noreferrer"
          title="Abrir em nova aba (navegador externo)"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <ExternalLink size={12} /> Nova aba
        </a>
        {isCustom && (
          <>
            <button onClick={() => onEdit(app)} title="Editar" className="ml-auto p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500">
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(app)} title="Excluir" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500">
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}