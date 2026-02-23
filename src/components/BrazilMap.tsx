import { useState, useEffect } from 'react';
import { MapState, MapCity, useAdmin } from '@/contexts/AdminContext';
import { Plus, Trash2, X } from 'lucide-react';

// Coordenadas simplificadas para TODOS os estados (Posicionamento de Labels)
const STATE_LABELS: Record<string, { x: number; y: number }> = {
  RR: { x: 180, y: 50 }, AP: { x: 260, y: 65 }, AM: { x: 130, y: 100 },
  PA: { x: 220, y: 110 }, MA: { x: 280, y: 115 }, PI: { x: 300, y: 135 },
  CE: { x: 325, y: 125 }, RN: { x: 345, y: 135 }, PB: { x: 345, y: 150 },
  PE: { x: 340, y: 165 }, AL: { x: 345, y: 180 }, SE: { x: 338, y: 190 },
  BA: { x: 300, y: 195 }, TO: { x: 235, y: 165 }, MT: { x: 180, y: 190 },
  GO: { x: 230, y: 220 }, DF: { x: 245, y: 215 }, RO: { x: 125, y: 175 },
  AC: { x: 70, y: 170 }, MS: { x: 185, y: 265 }, MG: { x: 275, y: 250 },
  ES: { x: 315, y: 260 }, RJ: { x: 295, y: 285 }, SP: { x: 240, y: 290 },
  PR: { x: 215, y: 315 }, SC: { x: 225, y: 340 }, RS: { x: 200, y: 370 }
};

// Componente Tooltip (Manteve sua lógica original)
const CityTooltip = ({ cities, stateCode, x, y }: { cities: MapCity[]; stateCode: string; x: number; y: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (cities.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % cities.length), 5000);
    return () => clearInterval(interval);
  }, [cities.length]);
  const city = cities[currentIndex];
  if (!city) return null;
  return (
    <div className="absolute z-50 pointer-events-none" style={{ left: x + 15, top: y - 10, transform: 'translateY(-100%)' }}>
      <div className="glass-card rounded-xl shadow-2xl overflow-hidden min-w-[200px] bg-white/90 backdrop-blur-sm border border-slate-200">
        {city.imageUrl && <div className="w-full h-24 overflow-hidden"><img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" /></div>}
        <div className="p-2">
          <p className="font-bold text-slate-800 text-xs">{city.name}</p>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white mt-1">{stateCode}</span>
        </div>
      </div>
    </div>
  );
};

interface BrazilMapProps {
  states: MapState[];
  onUpdateStates?: (states: MapState[]) => void;
}

const BrazilMap = ({ states, onUpdateStates }: BrazilMapProps) => {
  const { isAdmin } = useAdmin();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const activeStateCodes = states.map(s => s.stateCode);

  const handleMouseMove = (e: React.MouseEvent, code: string) => {
    const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredState(code);
  };

  // Funções de Gerenciamento (Manteve sua lógica)
  const addState = (code: string) => {
    if (!onUpdateStates || activeStateCodes.includes(code)) return;
    onUpdateStates([...states, { id: Date.now().toString(), stateCode: code, stateName: code, cities: [] }]);
  };

  // AJUSTE DO VIEWBOX: Agora focado no Brasil inteiro (0 0 400 450)
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full max-w-2xl bg-slate-50/50 rounded-3xl p-4">
        <svg viewBox="50 30 350 400" className="w-full h-auto drop-shadow-sm">
          {/* Aqui você deve colar os <path> ou <polygon> de todos os estados */}
          {Object.keys(STATE_LABELS).map((code) => {
            const isActive = activeStateCodes.includes(code);
            const isHovered = hoveredState === code;
            
            return (
              <g key={code} 
                 onMouseMove={(e) => handleMouseMove(e, code)}
                 onMouseLeave={() => setHoveredState(null)}
                 onClick={() => isAdmin && !isActive && addState(code)}
                 className="cursor-pointer transition-all">
                
                {/* REPRESENTAÇÃO VISUAL (Substitua pelo Path real do SVG se tiver) */}
                <circle 
                  cx={STATE_LABELS[code].x} 
                  cy={STATE_LABELS[code].y} 
                  r={isActive ? "12" : "8"}
                  fill={isActive ? (isHovered ? '#3b82f6' : '#93c5fd') : '#e2e8f0'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                
                <text 
                  x={STATE_LABELS[code].x} 
                  y={STATE_LABELS[code].y + 4} 
                  textAnchor="middle" 
                  className="pointer-events-none select-none"
                  fill={isActive ? '#1e293b' : '#94a3b8'} 
                  fontSize="8" 
                  fontWeight="bold"
                >
                  {code}
                </text>
              </g>
            );
          })}
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

      {/* PAINEL ADMIN (Resumido para o exemplo) */}
      {isAdmin && (
        <div className="w-full mt-8 p-4 border-t border-slate-100">
           <h4 className="text-sm font-bold mb-4">Estados Ativos no Site:</h4>
           <div className="flex flex-wrap gap-2">
             {states.map(s => (
               <div key={s.id} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                 {s.stateCode}
                 <button onClick={() => onUpdateStates?.(states.filter(item => item.id !== s.id))}><X size={14}/></button>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
