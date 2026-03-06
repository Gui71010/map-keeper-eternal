import { motion } from 'framer-motion';
import { User, Shield, BarChart3, Briefcase, Palette } from 'lucide-react';
import { Analyst } from '@/contexts/AdminContext';

interface OrgChartProps {
  manager: Analyst | undefined;
  biAnalysts: Analyst[];
  adminAnalysts: Analyst[];
  designAnalysts: Analyst[];
  onAnalystClick?: (id: string) => void;
}

const OrgNode = ({
  analyst,
  delay,
  isBoss,
  onClick,
}: {
  analyst: Analyst;
  delay: number;
  isBoss?: boolean;
  onClick?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: 'spring', damping: 18, stiffness: 120 }}
    whileHover={{ scale: 1.04, y: -4 }}
    onClick={onClick}
    className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer group backdrop-blur-md ${
      isBoss
        ? 'px-10 py-8 border-accent/50 bg-gradient-to-br from-accent/15 via-card/90 to-primary/10 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 min-w-[260px]'
        : 'px-6 py-5 border-border/30 bg-card/60 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 min-w-[160px]'
    }`}
  >
    <div
      className={`rounded-2xl overflow-hidden shrink-0 bg-muted/30 flex items-center justify-center shadow-xl ${
        isBoss
          ? 'w-32 h-32 ring-4 ring-accent/40'
          : 'w-20 h-20 ring-2 ring-border/40 group-hover:ring-accent/40'
      }`}
    >
      {analyst.photo ? (
        <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
      ) : (
        <User className={`${isBoss ? 'w-14 h-14' : 'w-9 h-9'} text-muted-foreground/60`} />
      )}
    </div>

    <div className="text-center min-w-0">
      <h4 className={`font-display font-bold text-foreground leading-tight ${isBoss ? 'text-xl' : 'text-base'}`}>
        {analyst.name}
      </h4>
      <p className={`text-muted-foreground mt-1 ${isBoss ? 'text-base' : 'text-sm'}`}>
        {analyst.role}
      </p>
      <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-lg bg-muted/40 text-foreground/70 border border-border/40">
        {analyst.area}
      </span>
    </div>

    {isBoss && (
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-xl ring-2 ring-background">
        <Shield className="w-5 h-5 text-primary-foreground" />
      </div>
    )}
  </motion.div>
);

const VerticalLine = ({ height = 'h-10' }: { height?: string }) => (
  <div className="flex justify-center">
    <div className={`w-0.5 ${height} bg-gradient-to-b from-accent/40 to-accent/10`} />
  </div>
);

const HorizontalLine = () => (
  <div className="flex justify-center">
    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
  </div>
);

const AreaGroup = ({
  title,
  icon: Icon,
  analysts,
  gradientFrom,
  gradientTo,
  glowColor,
  delay,
  onAnalystClick,
}: {
  title: string;
  icon: React.ElementType;
  analysts: Analyst[];
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  delay: number;
  onAnalystClick?: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, type: 'spring', damping: 20 }}
    className="flex flex-col items-center"
  >
    <VerticalLine height="h-8" />

    {/* Area header */}
    <div
      className="px-8 py-4 rounded-2xl border-2 font-display font-bold text-lg text-white flex items-center gap-3 shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        borderColor: `${gradientFrom}80`,
        boxShadow: `0 0 30px ${glowColor}30, 0 4px 20px rgba(0,0,0,0.3)`,
      }}
    >
      <Icon className="w-6 h-6" />
      {title}
    </div>

    <VerticalLine height="h-6" />

    {/* Members row - side by side */}
    <div className="flex flex-wrap justify-center gap-4">
      {analysts.map((analyst, i) => (
        <OrgNode
          key={analyst.id}
          analyst={analyst}
          delay={delay + 0.1 + i * 0.08}
          onClick={() => onAnalystClick?.(analyst.id)}
        />
      ))}
      {analysts.length === 0 && (
        <div className="text-muted-foreground/40 text-base italic py-6">Nenhum membro</div>
      )}
    </div>
  </motion.div>
);

const OrgChart = ({ manager, biAnalysts, adminAnalysts, designAnalysts, onAnalystClick }: OrgChartProps) => {
  return (
    <div className="relative w-full py-6">
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full bg-blue-500/8 blur-[140px]" />
        <div className="absolute top-1/3 right-[10%] w-80 h-80 rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-violet-500/8 blur-[120px] -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        {/* Manager at top */}
        <div className="flex justify-center">
          {manager && (
            <OrgNode analyst={manager} delay={0.1} isBoss onClick={() => onAnalystClick?.(manager.id)} />
          )}
        </div>

        <VerticalLine height="h-10" />

        {/* Horizontal line */}
        <div className="max-w-7xl mx-auto px-4">
          <HorizontalLine />
        </div>

        {/* Area columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          <AreaGroup
            title="Analistas de BI"
            icon={BarChart3}
            analysts={biAnalysts}
            gradientFrom="hsl(210, 90%, 50%)"
            gradientTo="hsl(195, 85%, 45%)"
            glowColor="hsl(210, 90%, 55%)"
            delay={0.25}
            onAnalystClick={onAnalystClick}
          />
          <AreaGroup
            title="Administrativo"
            icon={Briefcase}
            analysts={adminAnalysts}
            gradientFrom="hsl(160, 70%, 40%)"
            gradientTo="hsl(145, 65%, 45%)"
            glowColor="hsl(155, 70%, 45%)"
            delay={0.35}
            onAnalystClick={onAnalystClick}
          />
          <AreaGroup
            title="Design"
            icon={Palette}
            analysts={designAnalysts}
            gradientFrom="hsl(270, 65%, 55%)"
            gradientTo="hsl(285, 60%, 50%)"
            glowColor="hsl(275, 65%, 55%)"
            delay={0.45}
            onAnalystClick={onAnalystClick}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
