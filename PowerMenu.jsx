import { Moon, RotateCw, X, Power, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function PowerMenu({ onClose, onSuspend, onRestart, onCloseApp }) {
  const [showShutdownInfo, setShowShutdownInfo] = useState(false);

  return (
    <div className="absolute inset-0 z-[9500] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-72 rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onSuspend} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm">
          <Moon size={18} /> Suspender interface
        </button>
        <button onClick={onRestart} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm">
          <RotateCw size={18} /> Reiniciar a interface
        </button>
        <button onClick={onCloseApp} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm">
          <X size={18} /> Fechar aplicativo
        </button>
        <button onClick={() => setShowShutdownInfo(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm">
          <Power size={18} /> Desligar dispositivo
        </button>
        {showShutdownInfo && (
          <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex gap-2">
            <AlertTriangle size={28} className="shrink-0" />
            <p>
              Um site não pode desligar o celular diretamente. Para desligar de verdade, use o menu de energia do próprio Android
              (mantenha o botão de energia pressionado). Esta interface não simula um desligamento real.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}