import { WALLPAPERS } from '@/lib/desktopStore';
import { APPS } from './registry';
import { ArrowUp, ArrowDown, Plus, X } from 'lucide-react';

const TIMEZONES = ['America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza', 'America/Recife', 'America/Belem', 'UTC'];

export default function Settings({ settings, setSettings }) {
  function update(patch) {
    setSettings({ ...settings, ...patch });
  }

  function moveItem(list, id, dir) {
    const i = list.indexOf(id);
    if (i < 0) return list;
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  }

  const pinned = settings.taskbarPinned.filter((id) => APPS.find((a) => a.id === id));
  const unpinned = APPS.filter((a) => !pinned.includes(a.id)).map((a) => a.id);
  const desktop = settings.desktopIcons.filter((id) => APPS.find((a) => a.id === id));
  const desktopOff = APPS.filter((a) => !desktop.includes(a.id)).map((a) => a.id);

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">{title}</h3>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 bg-zinc-50 dark:bg-zinc-800/50">{children}</div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-zinc-900 text-black dark:text-white p-5">
      <Section title="Papel de parede">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(WALLPAPERS).map(([key, w]) => (
            <button
              key={key}
              onClick={() => update({ wallpaper: key })}
              className={'h-20 rounded-lg border-2 overflow-hidden ' + (settings.wallpaper === key ? 'border-blue-500' : 'border-transparent')}
              style={{ background: w.bg }}
            >
              <span className="block mt-12 text-xs text-white/90 bg-black/30 text-center py-0.5">{w.name}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tema">
        <div className="flex gap-2">
          {['dark', 'light'].map((t) => (
            <button
              key={t}
              onClick={() => update({ theme: t })}
              className={'px-4 py-2 rounded-lg text-sm border ' + (settings.theme === t ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-zinc-300 dark:border-zinc-600')}
            >
              {t === 'dark' ? 'Escuro' : 'Claro'}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Relógio e fuso horário">
        <label className="flex items-center gap-2 text-sm mb-2">
          <input type="checkbox" checked={settings.useDeviceTime} onChange={(e) => update({ useDeviceTime: e.target.checked })} />
          Usar o fuso real do dispositivo (não falsificar a hora)
        </label>
        <select
          value={settings.timezone}
          disabled={settings.useDeviceTime}
          onChange={(e) => update({ timezone: e.target.value })}
          className="px-2 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent text-sm disabled:opacity-40"
        >
          {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </Section>

      <Section title="Volume da interface">
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => update({ volume: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-zinc-500 mt-1">{settings.volume}%</div>
      </Section>

      <Section title="Atalhos fixados na barra de tarefas">
        <div className="space-y-1">
          {pinned.map((id) => {
            const app = APPS.find((a) => a.id === id);
            return (
              <div key={id} className="flex items-center gap-2 text-sm">
                <span className="flex-1">{app.name}</span>
                <button onClick={() => update({ taskbarPinned: moveItem(pinned, id, -1) })} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"><ArrowUp size={14} /></button>
                <button onClick={() => update({ taskbarPinned: moveItem(pinned, id, 1) })} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"><ArrowDown size={14} /></button>
                <button onClick={() => update({ taskbarPinned: pinned.filter((x) => x !== id) })} className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"><X size={14} /></button>
              </div>
            );
          })}
        </div>
        {unpinned.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {unpinned.map((id) => {
              const app = APPS.find((a) => a.id === id);
              return (
                <button key={id} onClick={() => update({ taskbarPinned: [...pinned, id] })} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  <Plus size={12} /> {app.name}
                </button>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Ícones da área de trabalho">
        <div className="space-y-1">
          {desktop.map((id) => {
            const app = APPS.find((a) => a.id === id);
            return (
              <div key={id} className="flex items-center gap-2 text-sm">
                <span className="flex-1">{app.name}</span>
                <button onClick={() => update({ desktopIcons: desktop.filter((x) => x !== id) })} className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"><X size={14} /></button>
              </div>
            );
          })}
        </div>
        {desktopOff.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {desktopOff.map((id) => {
              const app = APPS.find((a) => a.id === id);
              return (
                <button key={id} onClick={() => update({ desktopIcons: [...desktop, id] })} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  <Plus size={12} /> {app.name}
                </button>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}