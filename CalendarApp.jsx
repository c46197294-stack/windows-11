import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { loadState, saveState, STORAGE_KEYS } from '@/lib/desktopStore';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarApp() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => ymd(new Date()));
  const [events, setEvents] = useState(() => loadState(STORAGE_KEYS.calendar, []));
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => saveState(STORAGE_KEYS.calendar, events), [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = ymd(new Date());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function eventsFor(dateStr) {
    return events.filter((e) => e.date === dateStr);
  }

  function addEvent() {
    if (!newTitle.trim()) return;
    setEvents([...events, { id: genId(), date: selected, title: newTitle.trim() }]);
    setNewTitle('');
  }

  function delEvent(id) {
    setEvents(events.filter((e) => e.id !== id));
  }

  const dayEvents = eventsFor(selected).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronLeft size={18} /></button>
            <button onClick={() => { setCursor(new Date()); setSelected(todayStr); }} className="px-2 py-1 text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">Hoje</button>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 mb-1">
          {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const ds = ymd(d);
            const evs = eventsFor(ds);
            const isToday = ds === todayStr;
            const isSelected = ds === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(ds)}
                className={
                  'rounded-md p-1 flex flex-col items-start text-left text-sm border transition ' +
                  (isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800') +
                  (isToday ? ' ring-1 ring-blue-400' : '')
                }
              >
                <span className="font-medium">{d.getDate()}</span>
                <div className="flex flex-wrap gap-0.5 mt-auto">
                  {evs.slice(0, 3).map((e) => (
                    <span key={e.id} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-64 border-l border-zinc-200 dark:border-zinc-700 flex flex-col p-4">
        <h3 className="text-sm font-semibold mb-2">
          {new Date(selected + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEvent()}
            placeholder="Novo evento..."
            className="flex-1 px-2 py-1.5 text-sm rounded border border-zinc-300 dark:border-zinc-600 bg-transparent outline-none focus:border-blue-500"
          />
          <button onClick={addEvent} className="px-2 rounded bg-blue-600 text-white hover:bg-blue-500"><Plus size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {dayEvents.length === 0 && <p className="text-xs text-zinc-500">Nenhum evento.</p>}
          {dayEvents.map((e) => (
            <div key={e.id} className="group flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="flex-1">{e.title}</span>
              <button onClick={() => delEvent(e.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}