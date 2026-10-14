// Persistência local para o desktop Windows-inspired.
// Tudo salva em localStorage para funcionar offline e sobreviver a recarregamentos.

export const STORAGE_KEYS = {
  settings: 'win11_settings',
  notepad: 'win11_notepad',
  calendar: 'win11_calendar',
  vfs: 'win11_vfs',
  recycle: 'win11_recycle',
};

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Não foi possível salvar localmente:', e);
  }
}

export const DEFAULT_SETTINGS = {
  wallpaper: 'bloom',
  theme: 'dark',
  timezone: 'America/Sao_Paulo',
  useDeviceTime: false,
  volume: 60,
  taskbarPinned: ['thispc', 'files', 'browser', 'appmanager', 'settings'],
  desktopIcons: [
    'thispc',
    'recycle',
    'files',
    'browser',
    'calculator',
    'notepad',
    'calendar',
    'appmanager',
  ],
};

export const WALLPAPERS = {
  bloom: {
    name: 'Bloom',
    bg: 'radial-gradient(circle at 30% 30%, #0a3d91 0%, transparent 45%), radial-gradient(circle at 70% 60%, #0047ff 0%, transparent 40%), linear-gradient(135deg, #000b1a 0%, #001a3d 100%)',
  },
  dark: {
    name: 'Azul Escuro',
    bg: 'linear-gradient(135deg, #000b1a 0%, #001f4d 50%, #000b1a 100%)',
  },
  wave: {
    name: 'Ondas',
    bg: 'linear-gradient(135deg, #00102b 0%, #0033a0 50%, #000b1a 100%)',
  },
};