import { useState } from 'react';
import { APP_MAP, APPS } from '@/apps/registry';

export default function DesktopIcons({ iconIds, onOpen }) {
  const [selected, setSelected] = useState(null);
  // Em telas de toque (celulares/tablets Samsung), um toque único abre o app;
  // com mouse, o padrão é seleção no clique e abertura no duplo clique.
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <div className="absolute top-2 left-2 bottom-16 flex flex-col flex-wrap content-start gap-1 select-none">
      {iconIds.map((id) => {
        const app = APP_MAP[id];
        if (!app) return null;
        const Icon = app.icon;
        const isSel = selected === id;
        return (
          <button
            key={id}
            onClick={() => { setSelected(id); if (isTouch) onOpen(id); }}
            onDoubleClick={() => onOpen(id)}
            className={
              'flex flex-col items-center gap-1 w-20 p-2 rounded-md transition ' +
              (isSel ? 'bg-blue-500/30 ring-1 ring-blue-400/60' : 'hover:bg-white/10')
            }
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
              style={{ background: app.color + '33', color: app.color }}
            >
              <Icon size={24} />
            </div>
            <span className="text-xs text-white text-center leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {app.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}