import { useRef } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';

export default function Window({
  win,
  active,
  theme,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  children,
}) {
  const dragData = useRef(null);

  function startDrag(e) {
    if (win.maximized) return;
    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = win.x;
    const oy = win.y;
    dragData.current = { startX, startY, ox, oy };

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      onMove(win.id, Math.max(0, ox + dx), Math.max(0, oy + dy));
    }
    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function startResize(e) {
    e.stopPropagation();
    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const ow = win.width;
    const oh = win.height;

    function move(ev) {
      const nw = Math.max(280, ow + (ev.clientX - startX));
      const nh = Math.max(200, oh + (ev.clientY - startY));
      onResize(win.id, nw, nh);
    }
    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  if (win.minimized) return null;

  const style = win.maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z };

  return (
    <div
      className={
        'absolute flex flex-col rounded-lg overflow-hidden shadow-2xl border ' +
        (active ? 'border-blue-500/50' : 'border-black/20 dark:border-white/10') +
        ' ' + (theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black')
      }
      style={style}
      onPointerDown={onFocus}
    >
      <div
        className="flex items-center gap-2 px-2 h-9 select-none cursor-grab active:cursor-grabbing border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
        onPointerDown={startDrag}
        onDoubleClick={onMaximize}
      >
        <span className="text-xs font-medium flex-1 truncate">{win.title}</span>
        <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10"><Minus size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
          {win.maximized ? <Copy size={12} /> : <Square size={12} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 rounded hover:bg-red-500 hover:text-white"><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
      {!win.maximized && (
        <div
          onPointerDown={startResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          style={{ background: 'linear-gradient(135deg, transparent 50%, currentColor 50%)', opacity: 0.3 }}
        />
      )}
    </div>
  );
}