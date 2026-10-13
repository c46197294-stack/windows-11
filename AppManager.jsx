import { APPS } from './registry';

export default function AppManager({ openApp }) {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-zinc-900 text-black dark:text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Aplicativos disponíveis</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => openApp?.(app.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ background: app.color + '22', color: app.color }}
              >
                <Icon size={28} />
              </div>
              <span className="text-xs text-center">{app.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}