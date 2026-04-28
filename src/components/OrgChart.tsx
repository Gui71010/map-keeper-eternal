import { motion } from 'framer-motion';
import { User, Shield, BarChart3, Briefcase, Palette, MousePointerClick, ChevronRight, FileBarChart, Sparkles } from 'lucide-react';
import { Analyst, useAdmin } from '@/contexts/AdminContext';

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
  reportsCount,
}: {
  analyst: Analyst;
  delay: number;
  isBoss?: boolean;
  onClick?: () => void;
  accentColor?: string;
  reportsCount?: number;
}) => {
  const hoverBorder = accentColor || 'hsl(var(--accent))';
  const skills = analyst.skills || [];
  const previewSkills = skills.slice(0, isBoss ? 4 : 3);
  const extraSkills = skills.length - previewSkills.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 18, stiffness: 120 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`relative flex items-stretch gap-5 rounded-2xl cursor-pointer group backdrop-blur-md w-full overflow-hidden ${
        isBoss
          ? 'p-6 border-2 border-accent/40 max-w-[520px]'
          : 'p-5 border border-border/30'
      }`}
      style={{
        background: isBoss
          ? 'linear-gradient(135deg, hsl(215, 40%, 14% / 0.95), hsl(215, 35%, 10% / 0.95))'
          : 'linear-gradient(135deg, hsl(215, 35%, 13% / 0.6), hsl(215, 30%, 9% / 0.7))',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = isBoss ? 'hsl(var(--accent))' : hoverBorder;
        el.style.boxShadow = isBoss
          ? `0 0 50px hsl(var(--accent) / 0.25), 0 16px 48px hsl(var(--accent) / 0.12)`
          : `0 0 30px ${hoverBorder}25, 0 10px 36px ${hoverBorder}15`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = isBoss ? 'hsl(var(--accent) / 0.4)' : 'hsl(215, 25%, 18% / 0.3)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Decorative accent stripe on the left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(180deg, ${hoverBorder}, transparent)` }}
      />
      {/* Subtle radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${hoverBorder}10, transparent 60%)` }}
      />

      {/* LEFT: Photo */}
      <div
        className={`rounded-2xl overflow-hidden shrink-0 bg-muted/30 flex items-center justify-center shadow-xl ring-2 transition-all duration-300 self-start relative z-10 ${
          isBoss ? 'ring-accent/40 group-hover:ring-accent/70' : 'ring-border/30 group-hover:ring-accent/50'
        }`}
        style={{
          width: isBoss ? '6.5rem' : '5.5rem',
          height: isBoss ? '6.5rem' : '5.5rem',
        }}
      >
        {analyst.photo ? (
          <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
        ) : (
          <User className={`${isBoss ? 'w-12 h-12' : 'w-9 h-9'} text-muted-foreground/50`} />
        )}
      </div>

      {/* CENTER: Identity + competencies */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5 relative z-10">
        <div className="min-w-0">
          <h4 className={`font-display font-bold text-foreground leading-tight ${isBoss ? 'text-lg' : 'text-base'}`}>
            {analyst.name}
          </h4>
          <p className={`text-muted-foreground mt-1 ${isBoss ? 'text-sm' : 'text-xs'}`}>
            {analyst.role}
          </p>
          <span
            className="inline-block mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: accentColor ? `${accentColor}18` : 'hsl(var(--accent) / 0.1)',
              color: accentColor || 'hsl(var(--accent))',
              borderColor: accentColor ? `${accentColor}40` : 'hsl(var(--accent) / 0.2)',
            }}
          >
            {analyst.area}
          </span>
        </div>

        {/* Competencies */}
        {previewSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {previewSkills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/50 text-foreground/75 border border-border/50"
              >
                <Sparkles className="w-2.5 h-2.5 opacity-70" style={{ color: hoverBorder }} />
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground/80 border border-border/30">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* Reports created counter */}
        {typeof reportsCount === 'number' && reportsCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <FileBarChart className="w-3.5 h-3.5" style={{ color: hoverBorder }} />
            <span><strong className="text-foreground/90 font-bold">{reportsCount}</strong> relatório{reportsCount !== 1 ? 's' : ''} criado{reportsCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* RIGHT: lateral "Ver perfil" affordance */}
      <div className="flex flex-col items-center justify-center shrink-0 self-stretch pl-4 border-l border-border/30 group-hover:border-accent/40 transition-colors relative z-10">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${hoverBorder}30, ${hoverBorder}12)`,
            border: `1px solid ${hoverBorder}50`,
            boxShadow: `0 4px 12px ${hoverBorder}20`,
          }}
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" style={{ color: hoverBorder }} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider mt-2 text-muted-foreground/80 group-hover:text-foreground/90 transition-colors">
          Perfil
        </span>
      </div>

      {isBoss && (
        <div className="absolute -top-2.5 -right-2.5 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-lg ring-2 ring-background z-20">
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
  reportsCountBy,
}: {
  title: string;
  icon: React.ElementType;
  analysts: Analyst[];
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  delay: number;
  onAnalystClick?: (id: string) => void;
  reportsCountBy: (id: string) => number;
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

    {/* Members - vertical stack of horizontal cards */}
    <div className="flex flex-col gap-3 w-full">
      {analysts.map((analyst, i) => (
        <OrgNode
          key={analyst.id}
          analyst={analyst}
          delay={delay + 0.1 + i * 0.06}
          onClick={() => onAnalystClick?.(analyst.id)}
          accentColor={gradientFrom}
          reportsCount={reportsCountBy(analyst.id)}
        />
      ))}
      {analysts.length === 0 && (
        <div className="text-muted-foreground/30 text-sm italic py-6 text-center">Nenhum membro</div>
      )}
    </div>
  </motion.div>
);

const OrgChart = ({ manager, biAnalysts, adminAnalysts, designAnalysts, onAnalystClick }: OrgChartProps) => {
  const { content } = useAdmin();
  const reportsCountBy = (analystId: string) =>
    (content.reports || []).filter(r => r.creatorId === analystId).length;

  return (
    <div className="relative w-full py-8">
      {/* Subtle background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-[10%] w-64 h-64 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 w-56 h-56 rounded-full bg-primary/3 blur-[100px] -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        {/* CTA Hint */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-accent/30 backdrop-blur-md shadow-lg shadow-accent/10"
            style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.12), hsl(var(--accent) / 0.04))' }}
          >
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/70 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <MousePointerClick className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Clique em qualquer pessoa para ver as <span className="text-accent font-semibold">competências e atribuições</span>
            </span>
          </div>
        </motion.div>

        {/* Manager */}
        <div className="flex justify-center">
          {manager && (
            <OrgNode
              analyst={manager}
              delay={0.1}
              isBoss
              onClick={() => onAnalystClick?.(manager.id)}
              reportsCount={reportsCountBy(manager.id)}
            />
          )}
        </div>

        <VerticalLine height="h-10" />

        {/* Horizontal connector */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        {/* Area columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 items-start">
          <AreaGroup
            title="Analistas de BI"
            icon={BarChart3}
            analysts={biAnalysts}
            gradientFrom="hsl(210, 90%, 50%)"
            gradientTo="hsl(195, 85%, 45%)"
            glowColor="hsl(210, 90%, 55%)"
            delay={0.25}
            onAnalystClick={onAnalystClick}
            reportsCountBy={reportsCountBy}
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
            reportsCountBy={reportsCountBy}
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
            reportsCountBy={reportsCountBy}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
