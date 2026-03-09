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
    borderHover: 'hsl(210, 100%, 55%)',
    description: 'Acompanhamento de horas de treinamento, eficácia dos programas e desenvolvimento de pessoas em todas as unidades.',
  },
  {
    id: 'medicina',
    name: 'Medicina',
    icon: HeartPulse,
    color: 'from-emerald-500 to-teal-400',
    glowColor: 'hsl(160, 80%, 45%)',
    borderHover: 'hsl(160, 80%, 45%)',
    description: 'Indicadores de saúde ocupacional, gestão de atestados, exames periódicos e bem-estar dos colaboradores.',
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    icon: Building2,
    color: 'from-violet-500 to-purple-400',
    glowColor: 'hsl(270, 70%, 55%)',
    borderHover: 'hsl(270, 70%, 55%)',
    description: 'Análise de headcount, movimentações de pessoal, turnover e indicadores estratégicos da diretoria.',
  },
  {
    id: 'recrutamento',
    name: 'Recrutamento',
    icon: Users,
    color: 'from-amber-500 to-orange-400',
    glowColor: 'hsl(35, 90%, 55%)',
    borderHover: 'hsl(35, 90%, 55%)',
    description: 'Funil admissional completo, métricas de seleção, tempo de contratação e análise de candidatos.',
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    icon: ClipboardList,
    color: 'from-rose-500 to-pink-400',
    glowColor: 'hsl(350, 80%, 55%)',
    borderHover: 'hsl(350, 80%, 55%)',
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
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Nossas Áreas de Atuação</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Conheça os pilares que sustentam nossa operação de People Analytics</p>
          <div className="w-24 h-1 gradient-accent rounded-full mx-auto mt-5" />
        </motion.div>
      </div>

      <div className="relative">
        {/* Timeline connector */}
        <div className="hidden lg:block absolute top-1/2 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            const isHovered = hoveredId === area.id;

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08, duration: 0.5 }}
                onMouseEnter={() => setHoveredId(area.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group"
              >
                {/* Connector dot */}
                <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+1rem)]">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${area.color} shadow-lg transition-all duration-400`}
                    style={{
                      transform: isHovered ? 'scale(1.8)' : 'scale(1)',
                      boxShadow: isHovered ? `0 0 12px ${area.glowColor}60` : 'none',
                    }}
                  />
                </div>

                <div
                  className="glass-card rounded-2xl p-7 h-full transition-all duration-400 cursor-default"
                  style={{
                    border: `2px solid ${isHovered ? area.borderHover : 'hsl(215, 25%, 18% / 0.5)'}`,
                    boxShadow: isHovered
                      ? `0 0 30px ${area.glowColor}25, 0 0 60px ${area.glowColor}10, 0 8px 32px ${area.glowColor}08, inset 0 1px 0 ${area.glowColor}15`
                      : '0 2px 8px hsl(215, 25%, 8% / 0.3)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Subtle glow overlay on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-400"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `radial-gradient(circle at 30% 30%, ${area.glowColor}08, transparent 60%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-5 shadow-lg transition-all duration-400`}
                      style={{
                        transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
                        boxShadow: isHovered ? `0 8px 24px ${area.glowColor}30` : `0 4px 12px ${area.glowColor}15`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h4 className="text-lg font-display font-bold text-foreground mb-2">{area.name}</h4>

                    <p className="text-muted-foreground text-sm leading-relaxed opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                      {area.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default AreasRoadmap;
