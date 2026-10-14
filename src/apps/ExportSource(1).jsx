import { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

const ZIP_URL = 'https://base44.app/api/apps/6ace5e3b97a6f28803e7c1fd/files/mp/public/6ace5e3b97a6f28803e7c1fd/04e6223aa_Desktop_Flow_Source.zip';

export default function ExportSource() {
  const [baixado, setBaixado] = useState(false);

  return (
    <div className="p-5 h-full overflow-y-auto text-sm text-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Download size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-white">Exportar Código-Fonte</h2>
          <p className="text-xs text-slate-400">Desktop_Flow_Source.zip — 116 arquivos</p>
        </div>
      </div>

      <p className="mb-2 text-slate-300">
        Baixe o projeto completo em um único arquivo ZIP, com a estrutura original de pastas
        preservada e pronto para a compilação Android via Capacitor.
      </p>
      <ul className="list-disc list-inside text-slate-400 mb-5 space-y-1 text-xs">
        <li>Código-fonte real: JSX, JS, CSS, HTML, hooks, libs internas e apps</li>
        <li>Configurações: package.json, Vite, Tailwind, PostCSS, ESLint, jsconfig</li>
        <li>Guia de compilação: EXPORT_ANDROID.md + capacitor.config.example.json</li>
        <li>Sem segredos, senhas ou tokens — apenas o guia de exportação</li>
      </ul>

      <a
        href={ZIP_URL}
        download="Desktop_Flow_Source.zip"
        onClick={() => setBaixado(true)}
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
      >
        <Download size={18} />
        Baixar código-fonte completo (.ZIP)
      </a>

      {baixado && (
        <p className="mt-3 flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 size={14} />
          Download iniciado. Se não começar, toque e segure o botão e escolha "Abrir em nova aba".
        </p>
      )}
    </div>
  );
}