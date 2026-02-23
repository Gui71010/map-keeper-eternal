import { useState, useEffect } from 'react';
import { MapState, MapCity, useAdmin } from '@/contexts/AdminContext';
import { Plus, Trash2, X } from 'lucide-react';

// Polígonos simplificados para o BRASIL INTEIRO (Coordenadas ajustadas para viewBox 0 0 600 600)
const STATE_POLYGONS: Record<string, string> = {
  AC: "63.2,270.3 71.7,272.1 79.5,285.8 107.8,291.5 111.4,286.9 110.1,273.5 118.8,266.3 118.8,260.6 112.5,255.4 113.6,244.6 100.3,246.6 86.1,234.3 77.3,234.1 63.6,245.9 59.9,258.8",
  AL: "542.5,252.3 549.9,252.3 553.4,258.9 547.4,264.4 538.7,260.4",
  AP: "367.6,73.4 384.3,80.1 391.8,98.6 386.3,115.3 365.4,115.3 351.4,103.4 353.4,85.6",
  AM: "107.8,291.5 158.4,295.3 194.2,284.1 234.6,285.6 244.9,235.1 262.8,172.9 253.9,150.1 230.1,133.5 208.2,143.1 161.4,117.8 138.8,119.5 120.4,136.7 112.5,152.9 84.7,163.6 77.3,184.4 86.1,234.3 100.3,246.6 113.6,244.6 112.5,255.4 118.8,260.6 118.8,266.3 110.1,273.5 111.4,286.9",
  BA: "419.7,263.8 458.2,217.4 485.6,206.1 520.1,223.3 530.8,245.7 517.2,301.9 499.7,351.4 468.2,357.5 450.4,324.7 425.6,303.8",
  CE: "484.8,154.5 504.1,155.6 525.9,168.1 526.9,186.8 506.6,197.8 493.4,186.8",
  DF: "405.6,339.6 414.6,339.6 414.6,346.6 405.6,346.6",
  ES: "508.4,374.9 518.2,382.1 513.7,411.3 496.3,411.3 495.2,389.6",
  GO: "360.7,381.1 386.3,311.1 419.7,303.8 425.6,303.8 450.4,324.7 419.4,395.9 396.9,401.3 371.4,394.8",
  MA: "394.3,121.8 419.7,126.3 448.6,155.1 445.6,211.4 419.7,263.8 387.6,252.1 368.1,208.9 367.6,151.3",
  MT: "234.6,285.6 273.1,265.9 337.8,265.9 386.3,311.1 360.7,381.1 310.1,400.1 275.6,394.8 251.4,374.3 226.9,374.3 216.4,342.3",
  MS: "275.6,394.8 310.1,400.1 346.6,441.4 340.6,482.4 286.9,492.4 256.4,464.9 251.4,424.1",
  MG: "419.4,395.9 450.4,324.7 468.2,357.5 499.7,351.4 513.7,411.3 483.4,463.3 438.4,463.3 392.4,426.3",
  PA: "262.8,172.9 334.8,126.1 353.4,85.6 365.4,115.3 386.3,115.3 367.6,151.3 368.1,208.9 387.6,252.1 337.8,265.9 273.1,265.9 244.9,235.1",
  PB: "528.1,192.1 556.1,192.1 558.1,206.1 530.1,206.1",
  PR: "313.4,500.4 365.4,500.4 382.4,535.4 313.4,545.4 300.4,520.4",
  PE: "506.6,197.8 526.9,186.8 558.1,206.1 556.1,225.1 520.1,223.3 485.6,206.1",
  PI: "448.6,155.1 484.8,154.5 493.4,186.8 506.6,197.8 485.6,206.1 458.2,217.4 445.6,211.4",
  RJ: "483.4,463.3 503.4,443.3 513.7,443.3 503.4,473.3",
  RN: "526.9,168.1 553.4,173.1 556.1,192.1 528.1,192.1",
  RS: "310.4,565.4 355.4,565.4 345.4,610.4 280.4,600.4",
  RO: "158.4,295.3 192.4,332.3 216.4,342.3 226.9,374.3 180.4,374.3 158.4,332.3",
  RR: "230.1,133.5 253.9,150.1 262.8,172.9 244.9,117.8 221.4,92.8 190.4,92.8 161.4,117.8",
  SC: "313.4,545.4 382.4,535.4 375.4,565.4 310.4,565.4",
  SP: "346.6,441.4 392.4,426.3 438.4,463.3 365.4,500.4 346.6,482.4",
  SE: "538.7,260.4 547.4,264.4 543.4,275.4 532.4,272.4",
  TO: "368.1,208.9 387.6,252.1 419.7,263.8 386.3,311.1 337.8,265.9",
};

// Coordenadas para as siglas no centro de cada estado
const STATE_LABELS: Record<string, { x: number; y: number }> = {
  AC: { x: 85, y: 265 }, AL: { x: 545, y: 258 }, AP: { x: 370, y: 100 }, AM: { x: 170, y: 210 },
  BA: { x: 475, y: 280 }, CE: { x: 505, y: 175 }, DF: { x: 410, y: 343 }, ES: { x: 505, y: 395 },
  GO: { x: 400, y: 360 }, MA: { x: 415, y: 185 }, MT: { x: 295, y: 330 }, MS: { x: 300, y: 450 },
  MG: { x: 450, y: 415 }, PA: { x: 315, y: 190 }, PB: { x: 545, y: 198 }, PR: { x: 340, y: 520 },
  PE: { x: 530, y: 215 }, PI: { x: 470, y: 190 }, RJ: { x: 500, y: 455 }, RN: { x: 542, y: 182 },
  RS: { x: 315, y: 590 }, RO: { x: 195, y: 340 }, RR: { x: 215, y: 125 }, SC: { x: 345, y: 555 },
  SP: { x: 385, y: 470 }, SE: { x: 540, y: 268 }, TO: { x: 375, y: 265 },
};

// Componente do Tooltip (Balão que aparece ao passar o mouse)
const CityTooltip = ({ cities, stateCode, x, y }: { cities: MapCity[]; stateCode: string; x: number; y: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (cities.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % cities.length), 8000);
    return () => clearInterval(interval);
  }, [cities.length]);
  
  const city = cities[currentIndex];
  if (!city) return null;

  return (
    <div className="absolute z-50 pointer-events-none" style={{ left: x + 15, top: y - 10, transform: 'translateY(-100%)' }}>
      <div className="glass-card rounded-xl shadow-2xl overflow-hidden min-w-[200px] border border-white/20">
        {city.imageUrl && <div className="w-full h-32 overflow-hidden"><img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" /></div>}
        <div className="p-3 bg-white/90">
          <p className="font-bold text-slate-800 text-sm">{city.name}</p>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white mt-1">{stateCode}</span>
        </div>
      </div>
    </div>
  );
};

const BrazilMap = ({ states, onUpdateStates }: { states: MapState[]; onUpdateStates?: (states: MapState[]) => void }) => {
  const { isAdmin } = useAdmin();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const activeStateCodes = states.map(s => s.stateCode);

  const handleMouseMove = (e: React.MouseEvent, code: string) => {
    if (activeStateCodes.includes(code)) {
      const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
      if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setHoveredState(code);
    }
  };

  const addState = (code: string) => {
    if (!onUpdateStates) return;
    onUpdateStates([...states, { id: Date.now().toString(), stateCode: code, stateName: code, cities: [] }]);
  };

  return (
    <div className="relative flex flex-col items-center w-full bg-slate-50/50 rounded-3xl p-4">
      <div className="relative w-full max-w-[550px]">
        {/* VIEWBOX 0 0 600 650 garante que o Brasil inteiro apareça */}
        <svg viewBox="50 70 520 550" className="w-full h-auto drop-shadow-xl">
          {Object.keys(STATE_POLYGONS).map((code) => {
            const isActive = activeStateCodes.includes(code);
            const isHovered = hoveredState === code;
            
            return (
              <polygon
                key={code}
                points={STATE_POLYGONS[code]}
                fill={isActive ? (isHovered ? '#0ea5e9' : '#7dd3fc') : '#f1f5f9'}
                stroke={isActive ? '#0284c7' : '#cbd5e1'}
                strokeWidth={isActive ? 1.5 : 1}
                className={`transition-all duration-300 ${isAdmin || isActive ? 'cursor-pointer' : ''}`}
                onMouseMove={(e) => handleMouseMove(e, code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => isAdmin && !isActive && addState(code)}
              />
            );
          })}
          
          {Object.keys(STATE_LABELS).map((code) => (
            <text
              key={`label-${code}`}
              x={STATE_LABELS[code].x}
              y={STATE_LABELS[code].y}
              textAnchor="middle"
              className="pointer-events-none select-none font-bold"
              fill={activeStateCodes.includes(code) ? '#0369a1' : '#94a3b8'}
              fontSize="11"
            >
              {code}
            </text>
          ))}
        </svg>

        {hoveredState && activeStateCodes.includes(hoveredState) && (
          <CityTooltip 
            cities={states.find(s => s.stateCode === hoveredState)?.cities || []} 
            stateCode={hoveredState} 
            x={tooltipPos.x} 
            y={tooltipPos.y} 
          />
        )}
      </div>
      
      {isAdmin && <p className="mt-4 text-xs text-slate-400 italic">Modo Admin: Clique em um estado cinza para ativar.</p>}
    </div>
  );
};

export default BrazilMap;
