import { Search, Wifi, Volume2, ChevronUp, Bell, LayoutStart } from './TaskbarIcons';
import { APP_MAP } from '@/apps/registry';
import { useClock } from '@/lib/useClock';

export default function Taskbar({
  settings,
  windows,
  activeId,
  onStartToggle,
  startOpen,
  search,
  setSearch,
  onTaskbarClick,
  onPower,
}) {
  const { time, date } = useClock(settings.timezone, settings.useDeviceTime);

  // união de fixados + abertos
  const pinned = settings.taskbarPinned.filter((id) => APP_MAP[id]);
  const runningIds = windows.map((w) => w.appId);
  const ids = [...new Set([...pinned, ...runningIds])];

  return (
    <div className="absolute bottom-0 left-0 right-0 min-h-[3rem] flex items-center justify-between px-2 pb-[env(safe-area-inset-bottom)] bg-zinc-900/70 backdrop-blur-xl border-t border-white/10 z-[9000]">
      {/* Lado esquerdo invisível para centralizar */}
      <div className="flex-1" />

      {/* Centro: Iniciar + pesquisa + apps */}
      <div className="flex items-center gap-1">
        <button
          onClick={onStartToggle}
          className={
            'p-2 rounded-md transition ' + (startOpen ? 'bg-white/20' : 'hover:bg-white/10')
          }
          title="Iniciar"
        >
          <LayoutStart />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 h-8 rounded-full bg-white/10 text-white/70 text-sm w-44 max-w-[30vw]">
          <Search size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
            className="bg-transparent outline-none flex-1 text-xs placeholder:text-white/50"
          />
        </div>

        {ids.map((id) => {
          const app = APP_MAP[id];
          if (!app) return null;
          const Icon = app.icon;
          const win = windows.find((w) => w.appId === id);
          const isActive = win && win.id === activeId && !win.minimized;
          const isRunning = !!win;
          return (
            <button
              key={id}
              onClick={() => onTaskbarClick(id)}
              title={app.name}
              className="relative p-2 rounded-md hover:bg-white/10 transition"
            >
              <Icon size={20} style={{ color: app.color }} />
              {isRunning && (
                <span
                  className={
                    'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ' +
                    (isActive ? 'w-5 bg-blue-400' : 'w-1.5 bg-white/70')
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Direita: bandeja + relógio + energia */}
      <div className="flex-1 flex items-center justify-end gap-1 text-white/80">
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10">
          <ChevronUp size={14} />
          <Wifi size={16} />
          <Volume2 size={16} />
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 text-xs leading-tight text-right">
          <div>
            <div>{time}</div>
            <div>{date}</div>
          </div>
          <Bell size={16} />
        </div>
        <button
          onClick={onPower}
          className="p-2 rounded-md hover:bg-white/10"
          title="Energia"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v10" /><path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}