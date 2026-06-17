import { motion } from 'framer-motion';
import { User, Shield, BarChart3, Briefcase, Palette, MousePointerClick, Sparkles, UserCheck, GraduationCap, Users, Trash2, Plus, X } from 'lucide-react';
import { Analyst } from '@/contexts/AdminContext';

export interface CustomGroupRender {
  id: string;
  title: string;
  color: string;
  analystIds: string[];
}

interface OrgChartProps {
  manager: Analyst | undefined;
  biAnalysts: Analyst[];
  adminAnalysts: Analyst[];
  designAnalysts: Analyst[];
  assistantAnalysts: Analyst[];
  internAnalysts: Analyst[];
  onAnalystClick?: (id: string) => void;
  customGroups?: CustomGroupRender[];
  allAnalysts?: Analyst[];
  isAdmin?: boolean;
  onAddCustomGroup?: () => void;
  onUpdateCustomGroup?: (id: string, data: Partial<CustomGroupRender>) => void;
  onRemoveCustomGroup?: (id: string) => void;
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
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`relative flex items-center gap-4 rounded-2xl cursor-pointer group backdrop-blur-md w-full overflow-hidden ${
        isBoss ? 'p-5 border-2 border-accent/40 max-w-[420px]' : 'p-4 border border-border/30'
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
      {/* Animated accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
        <div
          className="w-full h-[200%] animate-[stripe-move_3.5s_ease-in-out_infinite]"
          style={{ background: `linear-gradient(180deg, transparent, ${hoverBorder}, ${hoverBorder}, transparent)` }}
        />
      </div>

      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${hoverBorder}10, transparent 60%)` }}
      />

      {/* Photo */}
      <div
        className={`rounded-2xl overflow-hidden shrink-0 bg-muted/30 flex items-center justify-center shadow-xl ring-2 transition-all duration-300 relative z-10 ${
          isBoss ? 'ring-accent/40 group-hover:ring-accent/70' : 'ring-border/30 group-hover:ring-accent/50'
        }`}
        style={{
          width: isBoss ? '5.5rem' : '4.5rem',
          height: isBoss ? '5.5rem' : '4.5rem',
        }}
      >
        {analyst.photo ? (
          <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
        ) : (
          <User className={`${isBoss ? 'w-10 h-10' : 'w-7 h-7'} text-muted-foreground/50`} />
        )}
      </div>

      {/* Name + Area */}
      <div className="flex-1 min-w-0 relative z-10">
        <h4 className={`font-display font-bold text-foreground leading-tight ${isBoss ? 'text-lg' : 'text-base'}`}>
          {analyst.name}
        </h4>
        <span
          className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
          style={{
            backgroundColor: accentColor ? `${accentColor}18` : 'hsl(var(--accent) / 0.1)',
            color: accentColor || 'hsl(var(--accent))',
            borderColor: accentColor ? `${accentColor}40` : 'hsl(var(--accent) / 0.2)',
          }}
        >
          <Sparkles className="w-2.5 h-2.5" />
          {analyst.area}
        </span>
      </div>

      {isBoss && (
        <div className="absolute -top-3 -right-3 w-11 h-11 rounded-full gradient-accent flex items-center justify-center shadow-xl shadow-accent/30 ring-2 ring-background z-20">
          <Shield className="w-5 h-5 text-primary-foreground" />
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
    <div
      className="px-5 py-2.5 rounded-xl border font-display font-bold text-sm text-white flex items-center gap-2 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        borderColor: `${gradientFrom}60`,
        boxShadow: `0 0 20px ${glowColor}20, 0 4px 16px hsl(0 0% 0% / 0.25)`,
      }}
    >
      <Icon className="w-4 h-4" />
      {title}
    </div>
    <VerticalLine height="h-5" />
    <div className="flex flex-col gap-3 w-full">
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
        <div className="text-muted-foreground/30 text-sm italic py-6 text-center">Nenhum membro</div>
      )}
    </div>
  </motion.div>
);

const OrgChart = ({ manager, biAnalysts, adminAnalysts, designAnalysts, assistantAnalysts, internAnalysts, onAnalystClick }: OrgChartProps) => {
  return (
    <div className="relative w-full py-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-[10%] w-64 h-64 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10">
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
            <MousePointerClick className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Clique em uma pessoa para ver o <span className="text-accent font-semibold">perfil completo</span>
            </span>
          </div>
        </motion.div>

        <div className="flex justify-center">
          {manager && (
            <OrgNode analyst={manager} delay={0.1} isBoss onClick={() => onAnalystClick?.(manager.id)} />
          )}
        </div>

        <VerticalLine height="h-10" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 max-w-7xl mx-auto px-4 items-start">
          <AreaGroup title="Analistas de BI" icon={BarChart3} analysts={biAnalysts} gradientFrom="hsl(210, 90%, 50%)" gradientTo="hsl(195, 85%, 45%)" glowColor="hsl(210, 90%, 55%)" delay={0.25} onAnalystClick={onAnalystClick} />
          <AreaGroup title="Administrativo" icon={Briefcase} analysts={adminAnalysts} gradientFrom="hsl(160, 70%, 40%)" gradientTo="hsl(145, 65%, 45%)" glowColor="hsl(155, 70%, 45%)" delay={0.35} onAnalystClick={onAnalystClick} />
          <AreaGroup title="Assistente de Pessoas" icon={UserCheck} analysts={assistantAnalysts} gradientFrom="hsl(35, 90%, 55%)" gradientTo="hsl(20, 85%, 50%)" glowColor="hsl(30, 90%, 55%)" delay={0.4} onAnalystClick={onAnalystClick} />
          <AreaGroup title="Design" icon={Palette} analysts={designAnalysts} gradientFrom="hsl(270, 65%, 55%)" gradientTo="hsl(285, 60%, 50%)" glowColor="hsl(275, 65%, 55%)" delay={0.45} onAnalystClick={onAnalystClick} />
          <AreaGroup title="Estagiários" icon={GraduationCap} analysts={internAnalysts} gradientFrom="hsl(190, 85%, 50%)" gradientTo="hsl(170, 75%, 45%)" glowColor="hsl(180, 80%, 50%)" delay={0.5} onAnalystClick={onAnalystClick} />
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
