import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, ExternalLink, Search, Globe } from 'lucide-react';

function normalizeUrl(input) {
  const v = input.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+/.test(v) && !v.includes(' ')) return 'https://' + v;
  return 'https://www.google.com/search?q=' + encodeURIComponent(v);
}

const QUICK_LINKS = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'Wikipedia', url: 'https://pt.wikipedia.org' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'Base44', url: 'https://base44.com' },
];

export default function Browser({ startUrl }) {
  const [url, setUrl] = useState('');
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [idx, setIdx] = useState(-1);
  const [failed, setFailed] = useState(false);

  function go(input) {
    const u = normalizeUrl(input);
    if (!u) return;
    const next = [...history.slice(0, idx + 1), u];
    setHistory(next);
    setIdx(next.length - 1);
    setCurrent(u);
    setUrl(u);
    setFailed(false);
  }

  function back() {
    if (idx > 0) {
      const i = idx - 1;
      setIdx(i);
      setCurrent(history[i]);
      setUrl(history[i]);
      setFailed(false);
    }
  }

  function forward() {
    if (idx < history.length - 1) {
      const i = idx + 1;
      setIdx(i);
      setCurrent(history[i]);
      setUrl(history[i]);
      setFailed(false);
    }
  }

  function reload() {
    if (current) {
      setFailed(false);
      setCurrent(current + (current.includes('?') ? '&' : '?') + '_r=' + Date.now());
      setTimeout(() => setUrl(current), 0);
    }
  }

  function home() {
    setCurrent(null);
    setUrl('');
    setFailed(false);
  }

  // Abertura via Loja de Aplicativos (startUrl): navega para o endereço ao mudar.
  useEffect(() => {
    if (startUrl) go(startUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startUrl]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex items-center gap-1 px-2 py-2 border-b border-zinc-200 dark:border-zinc-700">
        <button onClick={back} disabled={idx <= 0} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ArrowLeft size={16} /></button>
        <button onClick={forward} disabled={idx >= history.length - 1} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ArrowRight size={16} /></button>
        <button onClick={reload} disabled={!current} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><RotateCw size={16} /></button>
        <button onClick={home} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><Home size={16} /></button>
        <form
          onSubmit={(e) => { e.preventDefault(); go(url); }}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800"
        >
          <Search size={14} className="text-zinc-400" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pesquisar ou digite um endereço"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </form>
        {current && (
          <a href={current} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Abrir em nova aba">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      <div className="flex-1 relative bg-white">
        {!current ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 p-6">
            <Globe size={56} className="text-blue-500" />
            <form
              onSubmit={(e) => { e.preventDefault(); go(url); }}
              className="w-full max-w-md flex items-center gap-2 px-4 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-600 shadow-sm"
            >
              <Search size={18} className="text-zinc-400" />
              <input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pesquisar na web..."
                className="flex-1 bg-transparent outline-none"
              />
              <button type="submit" className="px-3 py-1 text-sm rounded-full bg-blue-600 text-white">Ir</button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {QUICK_LINKS.map((q) => (
                <button
                  key={q.url}
                  onClick={() => go(q.url)}
                  className="px-3 py-1.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  {q.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 max-w-sm text-center">
              Aviso: alguns sites bloqueiam exibição dentro de outras páginas por segurança.
              Se uma página não carregar, use o botão de abrir em nova aba.
            </p>
          </div>
        ) : (
          <>
            <iframe
              key={current}
              src={current}
              title="Navegador"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
              onError={() => setFailed(true)}
            />
            {failed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900 p-6 text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">Este site não permite ser exibido dentro do navegador integrado.</p>
                <a href={current} target="_blank" rel="noreferrer" className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Abrir em nova aba</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}