"use client";

export function MobileHeroVisual() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full max-w-2xl max-h-[500px]"
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="0.75" className="text-cyan-500/20">
          <line x1="100" y1="120" x2="250" y2="90" />
          <line x1="250" y1="90" x2="380" y2="150" />
          <line x1="380" y1="150" x2="520" y2="130" />
          <line x1="100" y1="120" x2="200" y2="240" />
          <line x1="200" y1="240" x2="380" y2="150" />
          <line x1="200" y1="240" x2="340" y2="290" />
          <line x1="340" y1="290" x2="500" y2="260" />
          <line x1="380" y1="150" x2="500" y2="260" />
          <line x1="250" y1="90" x2="340" y2="290" />
          <line x1="160" y1="180" x2="420" y2="210" />
        </g>
        {/* Nodes */}
        <circle cx="100" cy="120" r="4" className="fill-cyan-400" />
        <circle cx="250" cy="90" r="5" className="fill-emerald-400" />
        <circle cx="380" cy="150" r="6" className="fill-cyan-300" />
        <circle cx="520" cy="130" r="4" className="fill-violet-400" />
        <circle cx="200" cy="240" r="5" className="fill-cyan-400" />
        <circle cx="340" cy="290" r="6" className="fill-emerald-400" />
        <circle cx="500" cy="260" r="5" className="fill-sky-400" />
        <circle cx="160" cy="180" r="3" className="fill-emerald-300" />
        <circle cx="420" cy="210" r="4" className="fill-cyan-400" />
      </svg>
    </div>
  );
}
