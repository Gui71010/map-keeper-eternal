import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, HeartPulse, Building2, Users } from 'lucide-react';

const areas = [
  {
    id: 'treinamento',
    name: 'Treinamento',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'hsl(210, 100%, 55%)',
    description: 'Acompanhamento de horas de treinamento, eficácia dos programas e desenvolvimento de pessoas em todas as unidades.',
  },
  {
    id: 'medicina',
    name: 'Medicina',
    icon: HeartPulse,
    color: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    glowColor: 'hsl(160, 80%, 45%)',
    description: 'Indicadores de saúde ocupacional, gestão de atestados, exames periódicos e bem-estar dos colaboradores.',
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    icon: Building2,
    color: 'from-violet-500 to-purple-400',
    shadowColor: 'shadow-violet-500/20',
    borderColor: 'border-violet-500/50',
    glowColor: 'hsl(270, 70%, 55%)',
    description: 'Análise de headcount, movimentações de pessoal, turnover e indicadores estratégicos da diretoria.',
  },
  {
    id: 'recrutamento',
    name: 'Recrutamento',
    icon: Users,
    color: 'from-amber-500 to-orange-400',
    shadowColor: 'shadow-amber-500/20',
    borderColor: 'border-amber-500/50',
    glowColor: 'hsl(35, 90%, 55%)',
    description: 'Funil admissional completo, métricas de seleção, tempo de contratação e análise de candidatos.',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {areas.map((area, i) => {
            const Icon = area.icon;
            const isHovered = hoveredId === area.id;

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredId(area.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group"
              >
                {/* Connector dot on timeline */}
                <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+1rem)]">
                  <motion.div
                    animate={{ scale: isHovered ? 1.5 : 1 }}
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${area.color} shadow-lg`}
                  />
                </div>

                <motion.div
                  animate={{
                    y: isHovered ? -8 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`glass-card rounded-2xl p-6 border-2 transition-all duration-300 h-full ${
                    isHovered
                      ? `${area.shadowColor} shadow-2xl ${area.borderColor}`
                      : 'border-border/50 hover:shadow-lg'
                  }`}
                  style={isHovered ? { boxShadow: `0 0 25px ${area.glowColor}30, 0 0 50px ${area.glowColor}15` } : {}}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${area.color} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h4 className="text-lg font-display font-bold text-foreground mb-2">{area.name}</h4>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                  </motion.div>

                  {!isHovered && (
                    <p className="text-accent text-xs font-medium mt-2">Passe o mouse para saber mais →</p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default AreasRoadmap;
