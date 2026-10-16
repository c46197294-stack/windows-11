import {
  Monitor,
  Trash2,
  Folder,
  Globe,
  Settings as SettingsIcon,
  Calculator as CalcIcon,
  StickyNote,
  CalendarDays,
  LayoutGrid,
  Info,
  FileArchive as ArchiveIcon,
  Store,
} from 'lucide-react';

import Calculator from './Calculator';
import Notepad from './Notepad';
import CalendarApp from './CalendarApp';
import Settings from './Settings';
import FileExplorer from './FileExplorer';
import Browser from './Browser';
import RecycleBin from './RecycleBin';
import AppManager from './AppManager';
import AboutPC from './AboutPC';
import ExportSource from './ExportSource';
import AppStore from './AppStore';

// Registro central de aplicativos. Cada app tem nome, ícone, cor e componente.
export const APPS = [
  { id: 'thispc', name: 'Este Computador', icon: Monitor, color: '#2D73A6', component: AboutPC, defaultSize: { w: 580, h: 440 } },
  { id: 'recycle', name: 'Lixeira', icon: Trash2, color: '#5A9BD5', component: RecycleBin, defaultSize: { w: 560, h: 420 } },
  { id: 'files', name: 'Meus Arquivos', icon: Folder, color: '#F6C361', component: FileExplorer, defaultSize: { w: 640, h: 460 } },
  { id: 'browser', name: 'Navegador', icon: Globe, color: '#3b82f6', component: Browser, defaultSize: { w: 720, h: 500 } },
  { id: 'calculator', name: 'Calculadora', icon: CalcIcon, color: '#10b981', component: Calculator, defaultSize: { w: 320, h: 480 } },
  { id: 'notepad', name: 'Bloco de Notas', icon: StickyNote, color: '#f59e0b', component: Notepad, defaultSize: { w: 560, h: 440 } },
  { id: 'calendar', name: 'Calendário', icon: CalendarDays, color: '#ef4444', component: CalendarApp, defaultSize: { w: 640, h: 500 } },
  { id: 'appmanager', name: 'Aplicativos', icon: LayoutGrid, color: '#8b5cf6', component: AppManager, defaultSize: { w: 600, h: 460 } },
  { id: 'store', name: 'Loja de Aplicativos', icon: Store, color: '#2563eb', component: AppStore, defaultSize: { w: 680, h: 500 } },
  { id: 'settings', name: 'Configurações', icon: SettingsIcon, color: '#64748b', component: Settings, defaultSize: { w: 640, h: 500 } },
  { id: 'about', name: 'Sobre o Sistema', icon: Info, color: '#0ea5e9', component: AboutPC, defaultSize: { w: 520, h: 420 } },
  { id: 'export', name: 'Exportar Código', icon: ArchiveIcon, color: '#16a34a', component: ExportSource, defaultSize: { w: 480, h: 460 } },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a]));