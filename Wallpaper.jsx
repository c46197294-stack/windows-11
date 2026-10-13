import { WALLPAPERS } from '@/lib/desktopStore';

export default function Wallpaper({ wallpaper }) {
  const w = WALLPAPERS[wallpaper] || WALLPAPERS.bloom;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: w.bg }}>
      {/* Formas abstratas estilo Bloom */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#001a3d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0047ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000b1a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="400" cy="300" rx="380" ry="260" fill="url(#g1)" />
        <ellipse cx="850" cy="500" rx="420" ry="300" fill="url(#g2)" />
        <path d="M300,100 Q600,0 900,200 T1200,150 L1200,0 L300,0 Z" fill="#0a2d6e" opacity="0.3" />
      </svg>
    </div>
  );
}