import React, { useMemo } from 'react';

function generateSVG(caption) {
  const c = (caption || '').toLowerCase();
  if (c.includes('atom') || c.includes('estructura') || c.includes('molecular') || c.includes('molecula')) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <circle cx="100" cy="80" r="40" fill="none" stroke="#004b71" strokeWidth="3" />
        <circle cx="200" cy="80" r="25" fill="none" stroke="#006494" strokeWidth="3" />
        <circle cx="150" cy="150" r="30" fill="none" stroke="#6c228c" strokeWidth="3" />
        <circle cx="100" cy="80" r="8" fill="#004b71" opacity="0.3" />
        <circle cx="200" cy="80" r="6" fill="#006494" opacity="0.3" />
        <circle cx="150" cy="150" r="7" fill="#6c228c" opacity="0.3" />
        <line x1="120" y1="62" x2="185" y2="72" stroke="#004b71" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="110" y1="105" x2="140" y2="135" stroke="#004b71" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="205" y1="100" x2="160" y2="135" stroke="#006494" strokeWidth="2" strokeDasharray="4,3" />
        <text x="150" y="195" textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
          {caption || 'Estructura molecular'}
        </text>
      </svg>
    );
  }
  if (c.includes('tabla') || c.includes('periodi')) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        {Array.from({length:5}).map((_, i) => (
          <g key={i}>
            <rect x={10 + i*58} y={20} width={54} height={30} fill="none" stroke="#004b71" strokeWidth="1.5" rx="3" />
            <rect x={10 + i*58} y={55} width={54} height={30} fill="none" stroke="#006494" strokeWidth="1.5" rx="3" />
            <rect x={10 + i*58} y={90} width={54} height={30} fill="none" stroke="#6c228c" strokeWidth="1.5" rx="3" />
            <text x={37 + i*58} y={39} textAnchor="middle" fill="#004b71" fontSize="10" fontWeight="bold">{['H','He','Li','Be','B'][i]}</text>
            <text x={37 + i*58} y={74} textAnchor="middle" fill="#006494" fontSize="10" fontWeight="bold">{['C','N','O','F','Ne'][i]}</text>
            <text x={37 + i*58} y={109} textAnchor="middle" fill="#6c228c" fontSize="10" fontWeight="bold">{['Na','Mg','Al','Si','P'][i]}</text>
          </g>
        ))}
        <text x="150" y={160} textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
          {caption || 'Tabla periodica'}
        </text>
      </svg>
    );
  }
  if (c.includes('lab') || c.includes('instrument') || c.includes('experimento')) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <rect x="120" y="60" width="60" height="80" rx="5" fill="none" stroke="#004b71" strokeWidth="2" />
        <line x1="130" y1="60" x2="130" y2="40" stroke="#006494" strokeWidth="2" />
        <line x1="170" y1="60" x2="170" y2="40" stroke="#006494" strokeWidth="2" />
        <line x1="130" y1="40" x2="170" y2="40" stroke="#006494" strokeWidth="2" />
        <rect x="135" y="100" width="30" height="20" rx="2" fill="#86f8c8" opacity="0.5" />
        <circle cx="150" cy="145" r="5" fill="#004b71" opacity="0.4" />
        <line x1="90" y1="155" x2="210" y2="155" stroke="#e2e2e3" strokeWidth="2" />
        <text x="150" y="180" textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
          {caption || 'Material de laboratorio'}
        </text>
      </svg>
    );
  }
  if (c.includes('ruta') || c.includes('sintesis') || c.includes('reaccion') || c.includes('mecanismo')) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <text x="45" y="50" textAnchor="middle" fill="#004b71" fontSize="12" fontWeight="bold">A</text>
        <rect x="15" y="35" width="60" height="30" rx="5" fill="none" stroke="#004b71" strokeWidth="2" />
        <line x1="75" y1="50" x2="95" y2="50" stroke="#006494" strokeWidth="2" />
        <polygon points="95,45 105,50 95,55" fill="#006494" />
        <text x="130" y="50" textAnchor="middle" fill="#40484f" fontSize="9">Paso 1</text>
        <rect x="105" y="35" width="50" height="30" rx="5" fill="none" stroke="#006494" strokeWidth="2" />
        <text x="45" y="120" textAnchor="middle" fill="#004b71" fontSize="12" fontWeight="bold">B</text>
        <rect x="15" y="105" width="60" height="30" rx="5" fill="none" stroke="#004b71" strokeWidth="2" />
        <line x1="75" y1="120" x2="95" y2="120" stroke="#006494" strokeWidth="2" />
        <polygon points="95,115 105,120 95,125" fill="#006494" />
        <text x="130" y="120" textAnchor="middle" fill="#40484f" fontSize="9">Paso 2</text>
        <rect x="105" y="105" width="50" height="30" rx="5" fill="none" stroke="#6c228c" strokeWidth="2" />
        <line x1="155" y1="50" x2="175" y2="50" stroke="#6c228c" strokeWidth="2" />
        <polygon points="175,45 185,50 175,55" fill="#6c228c" />
        <rect x="185" y="35" width="60" height="30" rx="5" fill="none" stroke="#6c228c" strokeWidth="2" />
        <text x="215" y="50" textAnchor="middle" fill="#6c228c" fontSize="12" fontWeight="bold">C</text>
        <line x1="155" y1="120" x2="185" y2="120" stroke="#6c228c" strokeWidth="2" />
        <polygon points="185,115 195,120 185,125" fill="#6c228c" />
        <text x="215" y="120" textAnchor="middle" fill="#6c228c" fontSize="12" fontWeight="bold">D</text>
        <text x="150" y={170} textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
          {caption || 'Ruta sintetica'}
        </text>
      </svg>
    );
  }
  if (c.includes('diagram') || c.includes('esquema') || c.includes('proceso') || c.includes('flujo')) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <rect x="40" y="20" width="80" height="40" rx="5" fill="none" stroke="#004b71" strokeWidth="2" />
        <text x="80" y="45" textAnchor="middle" fill="#004b71" fontSize="11" fontWeight="bold">Entrada</text>
        <line x1="120" y1="40" x2="155" y2="40" stroke="#006494" strokeWidth="2" />
        <polygon points="155,35 165,40 155,45" fill="#006494" />
        <rect x="165" y="20" width="80" height="40" rx="5" fill="none" stroke="#006494" strokeWidth="2" />
        <text x="205" y="45" textAnchor="middle" fill="#006494" fontSize="11" fontWeight="bold">Proceso</text>
        <line x1="245" y1="40" x2="265" y2="40" stroke="#6c228c" strokeWidth="2" />
        <polygon points="265,35 275,40 265,45" fill="#6c228c" />
        <rect x="170" y="90" width="70" height="35" rx="5" fill="none" stroke="#004b71" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="205" y="111" textAnchor="middle" fill="#40484f" fontSize="9">Retroalimentacion</text>
        <line x1="205" y1="90" x2="205" y2="65" stroke="#40484f" strokeWidth="1.5" strokeDasharray="3,3" />
        <polygon points="201,65 205,60 209,65" fill="#40484f" />
        <text x="150" y={160} textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
          {caption || 'Diagrama de flujo'}
        </text>
      </svg>
    );
  }
  // Default: molecular/generic chemistry
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <circle cx="150" cy="80" r="50" fill="none" stroke="#004b71" strokeWidth="2" strokeDasharray="4,4" />
      <circle cx="150" cy="80" r="15" fill="#004b71" opacity="0.15" />
      <circle cx="120" cy="50" r="8" fill="#006494" opacity="0.25" />
      <circle cx="180" cy="50" r="8" fill="#006494" opacity="0.25" />
      <circle cx="120" cy="110" r="8" fill="#006494" opacity="0.25" />
      <circle cx="180" cy="110" r="8" fill="#006494" opacity="0.25" />
      <line x1="128" y1="55" x2="143" y2="72" stroke="#004b71" strokeWidth="1.5" />
      <line x1="157" y1="72" x2="172" y2="55" stroke="#004b71" strokeWidth="1.5" />
      <line x1="128" y1="105" x2="143" y2="88" stroke="#004b71" strokeWidth="1.5" />
      <line x1="157" y1="88" x2="172" y2="105" stroke="#004b71" strokeWidth="1.5" />
      <text x="150" y={170} textAnchor="middle" fill="#40484f" fontSize="11" fontFamily="Inter, sans-serif">
        {caption || 'Diagrama quimico'}
      </text>
    </svg>
  );
}

export const ImageBlock = ({ caption }) => {
  const svg = useMemo(() => generateSVG(caption), [caption]);
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-5">
      <div className="bg-white border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 bg-gradient-to-b from-[#f8f9fa] to-white">
          <div className="max-h-56 flex items-center justify-center">
            {svg}
          </div>
        </div>
      </div>
    </div>
  );
};
