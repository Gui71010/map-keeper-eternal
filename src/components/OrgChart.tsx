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
  accentColor,
}: {
  analyst: Analyst;
  delay: number;
  isBoss?: boolean;
  onClick?: () => void;
  accentColor?: string;
}) => {
  const hoverBorder = accentColor || 'hsl(var(--accent))';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 18, stiffness: 120 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl transition-all duration-300 cursor-pointer group backdrop-blur-md ${
        isBoss
          ? 'px-10 py-8 border-2 border-transparent bg-gradient-to-br from-accent/10 via-card/90 to-primary/5 min-w-[240px]'
          : 'px-5 py-5 border border-transparent bg-card/50 min-w-[150px]'
      }`}
      style={{
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = isBoss ? 'hsl(var(--accent))' : hoverBorder;
        el.style.boxShadow = isBoss
          ? `0 0 40px hsl(var(--accent) / 0.2), 0 12px 40px hsl(var(--accent) / 0.1)`
          : `0 0 25px ${hoverBorder}20, 0 8px 30px ${hoverBorder}10`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'transparent';
        el.style.boxShadow = 'none';
      }}
    >
      <div
        className={`rounded-2xl overflow-hidden shrink-0 bg-muted/30 flex items-center justify-center shadow-xl transition-all duration-300 ${
          isBoss
            ? 'w-28 h-28 ring-3 ring-accent/30 group-hover:ring-accent/60'
            : 'w-18 h-18 ring-2 ring-border/30 group-hover:ring-accent/40'
        }`}
        style={{
          width: isBoss ? '7rem' : '4.5rem',
          height: isBoss ? '7rem' : '4.5rem',
        }}
      >
        {analyst.photo ? (
          <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
        ) : (
          <User className={`${isBoss ? 'w-12 h-12' : 'w-7 h-7'} text-muted-foreground/50`} />
        )}
      </div>

      <div className="text-center min-w-0">
        <h4 className={`font-display font-bold text-foreground leading-tight ${isBoss ? 'text-lg' : 'text-sm'}`}>
          {analyst.name}
        </h4>
        <p className={`text-muted-foreground mt-0.5 ${isBoss ? 'text-sm' : 'text-xs'}`}>
          {analyst.role}
        </p>
        <span
          className="inline-block mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: accentColor ? `${accentColor}15` : 'hsl(var(--accent) / 0.1)',
            color: accentColor || 'hsl(var(--accent))',
            borderColor: accentColor ? `${accentColor}30` : 'hsl(var(--accent) / 0.2)',
          }}
        >
          {analyst.area}
        </span>
      </div>

      {isBoss && (
        <div className="absolute -top-2.5 -right-2.5 w-9 h-9 rounded-full gradient-accent flex items-center justify-center shadow-lg ring-2 ring-background">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};

const VerticalLine = ({ height = 'h-10' }: { height?: string }) => (
  <div className="flex justify-center">
    <div className={`w-px ${height} bg-gradient-to-b from-accent/30 to-accent/5`} />
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

    {/* Area badge */}
    <div
      className="px-6 py-3 rounded-xl border font-display font-bold text-base text-white flex items-center gap-2.5 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        borderColor: `${gradientFrom}60`,
        boxShadow: `0 0 20px ${glowColor}20, 0 4px 16px hsl(0 0% 0% / 0.25)`,
      }}
    >
      <Icon className="w-5 h-5" />
      {title}
    </div>

    <VerticalLine height="h-5" />

    {/* Members */}
    <div className="flex flex-wrap justify-center gap-3">
      {analysts.map((analyst, i) => (
        <OrgNode
          key={analyst.id}
          analyst={analyst}
          delay={delay + 0.1 + i * 0.06}
          onClick={() => onAnalystClick?.(analyst.id)}
          accentColor={gradientFrom}
        />
      ))}
      {analysts.length === 0 && (
        <div className="text-muted-foreground/30 text-sm italic py-6">Nenhum membro</div>
      )}
    </div>
  </motion.div>
);

const OrgChart = ({ manager, biAnalysts, adminAnalysts, designAnalysts, onAnalystClick }: OrgChartProps) => {
  return (
    <div className="relative w-full py-8">
      {/* Subtle background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-[10%] w-64 h-64 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 w-56 h-56 rounded-full bg-primary/3 blur-[100px] -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        {/* Manager */}
        <div className="flex justify-center">
          {manager && (
            <OrgNode analyst={manager} delay={0.1} isBoss onClick={() => onAnalystClick?.(manager.id)} />
          )}
        </div>

        <VerticalLine height="h-10" />

        {/* Horizontal connector */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        {/* Area columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
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
