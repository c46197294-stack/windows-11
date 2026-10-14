import { useState } from 'react';
import { Search, Power } from 'lucide-react';
import { APPS } from '@/apps/registry';

export default function StartMenu({ search, setSearch, onOpen, onPower }) {
  const [localSearch, setLocalSearch] = useState(search || '');
  const q = (localSearch || '').toLowerCase().trim();
  const filtered = q ? APPS.filter((a) => a.name.toLowerCase().includes(q)) : APPS;
  const pinned = APPS.slice(0, 8);

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[560px] max-w-[94vw] rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-5 z-[9100] text-white max-h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 mb-4">
        <Search size={16} className="text-white/60" />
        <input
          autoFocus
          value={localSearch}
          onChange={(e) => { setLocalSearch(e.target.value); setSearch?.(e.target.value); }}
          placeholder="Pesquisar aplicativos"
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/50"
        />
      </div>

      {!q && (
        <>
          <div className="text-xs text-white/50 mb-2">Fixados</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {pinned.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => onOpen(app.id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/10"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: app.color + '33', color: app.color }}>
                    <Icon size={22} />
                  </div>
                  <span className="text-xs text-center leading-tight">{app.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="text-xs text-white/50 mb-2">{q ? 'Resultados' : 'Todos os aplicativos'}</div>
      <div className="max-h-52 overflow-y-auto space-y-0.5">
        {filtered.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => onOpen(app.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
            >
              <Icon size={18} style={{ color: app.color }} />
              <span className="text-sm">{app.name}</span>
            </button>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-white/50 px-3 py-2">Nenhum aplicativo encontrado.</p>}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">U</div>
          <span className="text-sm">Usuário</span>
        </div>
        <button onClick={onPower} className="p-2 rounded-lg hover:bg-white/10" title="Energia">
          <Power size={18} />
        </button>
      </div>
    </div>
  );
}