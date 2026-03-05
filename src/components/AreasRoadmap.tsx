import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, HeartPulse, Building2, Users, ClipboardList } from 'lucide-react';

const areas = [
  {
    id: 'treinamento',
    name: 'Treinamento',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-400',
    glowColor: 'hsl(210, 100%, 55%)',
    borderColor: 'border-blue-400',
    description: 'Acompanhamento de horas de treinamento, eficácia dos programas e desenvolvimento de pessoas em todas as unidades.',
  },
  {
    id: 'medicina',
    name: 'Medicina',
    icon: HeartPulse,
    color: 'from-emerald-500 to-teal-400',
    glowColor: 'hsl(160, 80%, 45%)',
    borderColor: 'border-emerald-400',
    description: 'Indicadores de saúde ocupacional, gestão de atestados, exames periódicos e bem-estar dos colaboradores.',
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    icon: Building2,
    color: 'from-violet-500 to-purple-400',
    glowColor: 'hsl(270, 70%, 55%)',
    borderColor: 'border-violet-400',
    description: 'Análise de headcount, movimentações de pessoal, turnover e indicadores estratégicos da diretoria.',
  },
  {
    id: 'recrutamento',
    name: 'Recrutamento',
    icon: Users,
    color: 'from-amber-500 to-orange-400',
    glowColor: 'hsl(35, 90%, 55%)',
    borderColor: 'border-amber-400',
    description: 'Funil admissional completo, métricas de seleção, tempo de contratação e análise de candidatos.',
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    icon: ClipboardList,
    color: 'from-rose-500 to-pink-400',
    glowColor: 'hsl(350, 80%, 55%)',
    borderColor: 'border-rose-400',
    description: 'Gestão de processos internos, controle de documentação, suporte operacional e indicadores administrativos da diretoria.',
  },
];

const AreasRoadmap = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.27, duration: 0.6 }}
      className="relative"
    >
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Nossas Áreas de Atuação</h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Conheça os pilares que sustentam nossa operação de People Analytics</p>
        <div className="w-24 h-1 gradient-accent rounded-full mx-auto mt-4" />
      </div>

      {/* Timeline line */}
      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
          {areas.map((area) => {
            const Icon = area.icon;
            const isHovered = hoveredId === area.id;

            return (
              <div
                key={area.id}
                onMouseEnter={() => setHoveredId(area.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group"
              >
                {/* Connector dot on timeline */}
                <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+1rem)]">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${area.color} shadow-lg transition-transform duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`}
                  />
                </div>

                <div
                  className={`glass-card rounded-2xl p-6 border-2 transition-all duration-300 h-full ${
                    isHovered
                      ? `${area.borderColor} shadow-lg`
                      : 'border-border/50'
                  }`}
                  style={{
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 0 30px ${area.glowColor}40, 0 0 60px ${area.glowColor}20, 0 8px 32px rgba(0,0,0,0.3)` : '',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${area.color} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h4 className="text-lg font-display font-bold text-foreground mb-2">{area.name}</h4>

                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isHovered ? '200px' : '0px',
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                  </div>

                  {!isHovered && (
                    <p className="text-accent text-xs font-medium mt-2">Passe o mouse para saber mais →</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default AreasRoadmap;
