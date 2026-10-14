import { useEffect, useState } from 'react';
import { Monitor, HardDrive, Cpu, Wifi, Clock } from 'lucide-react';
import { diskUsage } from '@/lib/vfs';

export default function AboutPC({ settings }) {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const nav = navigator;
    setInfo({
      platform: nav.platform || '—',
      language: nav.language || '—',
      cores: nav.hardwareConcurrency || '—',
      online: nav.onLine,
      screen: `${window.screen.width}×${window.screen.height}`,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      ua: nav.userAgent,
    });
  }, []);

  const usage = diskUsage();

  const Row = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
      <span className="text-blue-500">{icon}</span>
      <span className="text-sm text-zinc-500 w-40">{label}</span>
      <span className="text-sm font-medium flex-1 truncate">{value}</span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-zinc-900 text-black dark:text-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
          <Monitor size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Desktop Windows-inspired</h2>
          <p className="text-xs text-zinc-500">Interface web inspirada no Windows 11 · Não é o Windows original</p>
        </div>
      </div>
      <Row icon={<Cpu size={16} />} label="Núcleos do processador" value={info.cores} />
      <Row icon={<Monitor size={16} />} label="Tela do dispositivo" value={info.screen} />
      <Row icon={<Monitor size={16} />} label="Janela atual" value={info.viewport} />
      <Row icon={<Wifi size={16} />} label="Conexão" value={info.online ? 'Online' : 'Offline'} />
      <Row icon={<Clock size={16} />} label="Idioma" value={info.language} />
      <Row icon={<HardDrive size={16} />} label="Armazenamento virtual" value={`${usage.folders} pastas · ${usage.files} arquivos · ${usage.recycled} na lixeira`} />
      <Row icon={<Clock size={16} />} label="Fuso de exibição" value={settings?.useDeviceTime ? 'Dispositivo (real)' : settings?.timezone || 'America/Sao_Paulo'} />
    </div>
  );
}