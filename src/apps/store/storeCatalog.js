// Catálogo da Loja de Aplicativos do Desktop Samsung (King Maple).
// Estrutura de dados simples e documentada: para adicionar um app ao catálogo,
// inclua um objeto em STORE_APPS com os campos abaixo. Nada precisa mudar na UI.
//
// Campos de cada item:
//   id:            identificador único (string)
//   name:          nome exibido
//   category:      uma das CATEGORIES
//   icon:          componente lucide-react
//   color:         cor do ícone (hex)
//   description:   descrição curta exibida no cartão
//   url:           site/página web para abrir no navegador interno (opcional)
//   officialUrl:   página oficial (opcional; se igual a `url`, o botão não repete)
//   androidPackage: pacote Android (ex.: 'com.google.android.youtube') — reservado
//                   para FUTURO suporte nativo de detectar/iniciar apps instalados.
//                   NÃO é usado nesta versão (a loja não instala nem inicia APKs).

import { Youtube, Chrome, HardDrive, GraduationCap, Palette, Languages, Sparkles, Hexagon, Globe } from 'lucide-react';

import { loadState, saveState } from '@/lib/desktopStore';

export const CATEGORIES = ['Navegadores', 'Vídeos e Música', 'Ferramentas', 'Educação', 'Jogos', 'Meus Aplicativos Web'];

export const STORE_APPS = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Vídeos e Música',
    icon: Youtube,
    color: '#ef4444',
    description: 'Vídeos, canais e playlists. Dentro de janelas, o site do YouTube pode bloquear a exibição parcial.',
    url: 'https://www.youtube.com/',
    officialUrl: 'https://www.youtube.com/',
    androidPackage: 'com.google.android.youtube',
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    category: 'Navegadores',
    icon: Chrome,
    color: '#3b82f6',
    description: 'Navegador do Google. Nesta loja, abre apenas a página oficial — o app continua sendo o do aparelho.',
    officialUrl: 'https://www.google.com/chrome/',
    androidPackage: 'com.android.chrome',
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    category: 'Ferramentas',
    icon: HardDrive,
    color: '#22c55e',
    description: 'Seus arquivos e documentos na nuvem do Google, na versão web.',
    url: 'https://drive.google.com/',
    officialUrl: 'https://drive.google.com/',
    androidPackage: 'com.google.android.apps.docs',
  },
  {
    id: 'classroom',
    name: 'Google Sala de Aula',
    category: 'Educação',
    icon: GraduationCap,
    color: '#0ea5e9',
    description: 'Turmas, atividades e materiais da Google Sala de Aula, na versão web.',
    url: 'https://classroom.google.com/',
    officialUrl: 'https://classroom.google.com/',
    androidPackage: 'com.google.android.apps.classroom',
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'Ferramentas',
    icon: Palette,
    color: '#06b6d4',
    description: 'Criação de designs, apresentações e posts direto no navegador.',
    url: 'https://www.canva.com/',
    officialUrl: 'https://www.canva.com/',
    androidPackage: 'com.canva.editor',
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'Educação',
    icon: Languages,
    color: '#22c55e',
    description: 'Aprenda idiomas pelo site oficial, com progresso salvo na sua conta.',
    url: 'https://www.duolingo.com/',
    officialUrl: 'https://www.duolingo.com/',
    androidPackage: 'com.duolingo',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    category: 'Ferramentas',
    icon: Sparkles,
    color: '#f97316',
    description: 'Plataforma para criar aplicativos web com IA.',
    url: 'https://lovable.dev/',
    officialUrl: 'https://lovable.dev/',
  },
  {
    id: 'base44',
    name: 'Base44',
    category: 'Ferramentas',
    icon: Hexagon,
    color: '#8b5cf6',
    description: 'Plataforma de criação de aplicativos — a mesma usada neste projeto.',
    url: 'https://base44.com/',
    officialUrl: 'https://base44.com/',
  },
];

// Chave no localStorage dos apps cadastrados pelo usuário em "Meus Aplicativos Web".
// Usa a mesma persistência do resto do desktop; não toca nas outras chaves.
export const CUSTOM_APPS_KEY = 'win11_store_custom_apps';

export function getCustomApps() {
  return loadState(CUSTOM_APPS_KEY, []);
}

export function saveCustomApps(list) {
  saveState(CUSTOM_APPS_KEY, list);
}

// Validação: aceita apenas URLs HTTPS válidas, com domínio.
export function isValidHttpsUrl(value) {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'https:' && !!u.hostname && u.hostname.includes('.');
  } catch {
    return false;
  }
}

// Normaliza o endereço digitado adicionando https:// quando falta.
export function normalizeHttpsUrl(value) {
  const v = value.trim();
  if (!v) return '';
  if (/^https:\/\//i.test(v)) return v;
  if (/^http:\/\//i.test(v)) return v; // é rejeitado pela validação depois
  return 'https://' + v;
}

export function makeCustomApp({ name, url, description }) {
  return {
    id: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    category: 'Meus Aplicativos Web',
    icon: Globe,
    color: '#0ea5e9',
    description: (description || '').trim() || 'Aplicativo web cadastrado por você.',
    url,
    officialUrl: url,
  };
}