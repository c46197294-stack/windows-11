import { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

// Aviso de orientação: um site não pode forçar a rotação da tela,
// então orienta o usuário em vez de fingir que travou a orientação.
export default function RotatePrompt() {
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => setPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    if (window.screen?.orientation) window.screen.orientation.addEventListener('change', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
      window.screen?.orientation?.removeEventListener?.('change', check);
    };
  }, []);

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!portrait || !isTouch || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9800] bg-[#001233] flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
        <RotateCw size={32} />
      </div>
      <h2 className="text-lg font-semibold">Gire o dispositivo</h2>
      <p className="text-sm text-white/70 max-w-xs">
        Esta interface foi projetada para uso em orientação horizontal (paisagem), como no Samsung Galaxy A14 5G e tablets Galaxy.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
      >
        Continuar na vertical
      </button>
      <p className="text-xs text-white/40 max-w-xs">
        Um site não pode forçar a rotação da tela. Para travar em horizontal, ative a rotação automática do Android ou use o
        bloqueio de orientação do navegador. No APK nativo, a orientação horizontal será travada no manifesto.
      </p>
    </div>
  );
}