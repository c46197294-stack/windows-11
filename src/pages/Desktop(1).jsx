import { useState, useEffect, useCallback, useRef } from 'react';
import { loadState, saveState, STORAGE_KEYS, DEFAULT_SETTINGS } from '@/lib/desktopStore';
import { APP_MAP } from '@/apps/registry';
import Wallpaper from '@/components/desktop/Wallpaper';
import DesktopIcons from '@/components/desktop/DesktopIcons';
import Taskbar from '@/components/desktop/Taskbar';
import StartMenu from '@/components/desktop/StartMenu';
import PowerMenu from '@/components/desktop/PowerMenu';
import RotatePrompt from '@/components/desktop/RotatePrompt';
import Window from '@/components/windows/Window';

export default function Desktop() {
  const [settings, setSettings] = useState(() => loadState(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  const [windows, setWindows] = useState([]);
  const [startOpen, setStartOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suspended, setSuspended] = useState(false);
  const zRef = useRef(10);

  useEffect(() => saveState(STORAGE_KEYS.settings, settings), [settings]);

  const openApp = useCallback((appId) => {
    const app = APP_MAP[appId];
    if (!app) return;
    setWindows((ws) => {
      const existing = ws.find((w) => w.appId === appId);
      if (existing) {
        const z = ++zRef.current;
        return ws.map((w) => (w.id === existing.id ? { ...w, minimized: false, z } : w));
      }
      const id = appId + '_' + Date.now();
      const z = ++zRef.current;
      // Clamp na tela: janelas nunca ultrapassam a área visível (deixa a barra de tarefas livre)
      const size = app.defaultSize || { w: 560, h: 420 };
      const width = Math.min(size.w, window.innerWidth - 16);
      const height = Math.min(size.h, window.innerHeight - 64);
      const offset = (ws.length % 6) * 28;
      const x = Math.max(8, Math.min(window.innerWidth - width - 8, Math.floor((window.innerWidth - width) / 2) + offset - 60));
      const y = Math.max(8, Math.min(window.innerHeight - height - 56, Math.floor((window.innerHeight - 48 - height) / 2) + offset - 60));
      return [...ws, { id, appId, title: app.name, x, y, width, height, minimized: false, maximized: false, z }];
    });
    setStartOpen(false);
    setSearch('');
  }, []);

  const closeWindow = useCallback((id) => setWindows((ws) => ws.filter((w) => w.id !== id)), []);
  const minimizeWindow = useCallback((id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w))), []);
  const toggleMaximize = useCallback((id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))), []);
  const moveWindow = useCallback((id, x, y) => setWindows((ws) => ws.map((w) => {
    if (w.id !== id) return w;
    // Mantém a janela inteira dentro da área visível, sem cobrir a barra de tarefas
    const maxX = Math.max(0, window.innerWidth - w.width);
    const maxY = Math.max(0, window.innerHeight - w.height - 48);
    return { ...w, x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) };
  })), []);
  const resizeWindow = useCallback((id, width, height) => setWindows((ws) => ws.map((w) => (w.id === id ? {
    ...w,
    width: Math.max(220, Math.min(width, window.innerWidth - w.x - 8)),
    height: Math.max(160, Math.min(height, window.innerHeight - w.y - 56)),
  } : w))), []);

  // Reajusta todas as janelas quando a tela/tela do Samsung muda de tamanho ou proporção
  useEffect(() => {
    function clampAll() {
      setWindows((ws) => ws.map((w) => {
        if (w.maximized) return w;
        const width = Math.min(w.width, window.innerWidth - 16);
        const height = Math.min(w.height, window.innerHeight - 64);
        return {
          ...w,
          width,
          height,
          x: Math.max(0, Math.min(w.x, window.innerWidth - width - 8)),
          y: Math.max(0, Math.min(w.y, window.innerHeight - height - 56)),
        };
      }));
    }
    window.addEventListener('resize', clampAll);
    window.addEventListener('orientationchange', clampAll);
    return () => {
      window.removeEventListener('resize', clampAll);
      window.removeEventListener('orientationchange', clampAll);
    };
  }, []);
  const focusWindow = useCallback((id) => {
    const z = ++zRef.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const activeWin = windows.reduce((a, w) => (w && !w.minimized && w.z > (a?.z ?? 0) ? w : a), null);

  function taskbarClick(appId) {
    const win = windows.find((w) => w.appId === appId);
    if (!win) {
      openApp(appId);
      return;
    }
    if (win.minimized) {
      const z = ++zRef.current;
      setWindows((ws) => ws.map((w) => (w.id === win.id ? { ...w, minimized: false, z } : w)));
    } else if (win.id === activeWin?.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  }

  function restart() {
    setWindows([]);
    setStartOpen(false);
    setPowerOpen(false);
    setSuspended(false);
  }

  function suspend() {
    setSuspended(true);
    setPowerOpen(false);
    setStartOpen(false);
  }

  // Pesquisa no menu Iniciar abre o app ao Enter
  useEffect(() => {
    if (search && startOpen) {
      const match = Object.values(APP_MAP).find((a) => a.name.toLowerCase().includes(search.toLowerCase()));
      // apenas prepara destaque; abertura ao clicar
    }
  }, [search, startOpen]);

  return (
    <div className={'fixed inset-0 overflow-hidden font-sans ' + (settings.theme === 'dark' ? 'dark' : '')}>
      <Wallpaper wallpaper={settings.wallpaper} />

      <RotatePrompt />

      <DesktopIcons iconIds={settings.desktopIcons} onOpen={openApp} />

      {/* Janelas */}
      {windows.map((w) => {
        const app = APP_MAP[w.appId];
        if (!app) return null;
        const Comp = app.component;
        return (
          <Window
            key={w.id}
            win={w}
            active={w.id === activeWin?.id}
            theme={settings.theme}
            onFocus={() => focusWindow(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onMaximize={() => toggleMaximize(w.id)}
            onMove={moveWindow}
            onResize={resizeWindow}
          >
            <Comp
              settings={settings}
              setSettings={setSettings}
              openApp={openApp}
              startId={w.appId === 'thispc' ? 'root' : undefined}
            />
          </Window>
        );
      })}

      {startOpen && (
        <StartMenu
          search={search}
          setSearch={setSearch}
          onOpen={openApp}
          onPower={() => { setStartOpen(false); setPowerOpen(true); }}
        />
      )}

      {powerOpen && (
        <PowerMenu
          onClose={() => setPowerOpen(false)}
          onSuspend={suspend}
          onRestart={restart}
          onCloseApp={restart}
        />
      )}

      {suspended && (
        <div
          className="absolute inset-0 z-[9600] bg-black flex flex-col items-center justify-center cursor-pointer text-white/60"
          onClick={() => setSuspended(false)}
        >
          <p className="text-lg mb-2">Interface suspensa</p>
          <p className="text-sm">Toque para retomar</p>
        </div>
      )}

      <Taskbar
        settings={settings}
        windows={windows}
        activeId={activeWin?.id}
        onStartToggle={() => { setStartOpen((v) => !v); setPowerOpen(false); }}
        startOpen={startOpen}
        search={search}
        setSearch={setSearch}
        onTaskbarClick={taskbarClick}
        onPower={() => { setPowerOpen((v) => !v); setStartOpen(false); }}
      />
    </div>
  );
}