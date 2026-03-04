import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';
import { Analyst } from '@/contexts/AdminContext';

interface OrgChartProps {
  manager: Analyst | undefined;
  biAnalysts: Analyst[];
  adminAnalysts: Analyst[];
  designAnalysts: Analyst[];
  onAnalystClick?: (id: string) => void;
}

const OrgNode = ({ analyst, delay, isBoss, onClick }: { analyst: Analyst; delay: number; isBoss?: boolean; onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: 'spring', damping: 20 }}
    onClick={onClick}
    className={`relative flex items-center gap-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
      isBoss
        ? 'p-6 border-accent/40 bg-gradient-to-r from-card/90 to-accent/10 hover:border-accent hover:shadow-xl hover:shadow-accent/15 min-w-[320px]'
        : 'p-4 border-border/40 bg-card/70 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 backdrop-blur-sm'
    }`}
  >
    <div className={`rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center shadow-lg ${
      isBoss ? 'w-20 h-20 ring-4 ring-accent/30' : 'w-14 h-14 ring-2 ring-border/50 group-hover:ring-accent/30'
    }`}>
      {analyst.photo ? (
        <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
      ) : (
        <User className={`${isBoss ? 'w-10 h-10' : 'w-7 h-7'} text-muted-foreground`} />
      )}
    </div>
    <div className="min-w-0">
      <h4 className={`font-display font-bold text-foreground truncate ${isBoss ? 'text-2xl' : 'text-base'}`}>{analyst.name}</h4>
      <p className={`text-muted-foreground ${isBoss ? 'text-base' : 'text-sm'}`}>{analyst.role}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">SQUAD</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted/50 text-foreground/70 border border-border/50">{analyst.area}</span>
      </div>
    </div>
    {isBoss && (
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-accent flex items-center justify-center shadow-lg">
        <Shield className="w-4 h-4 text-primary-foreground" />
      </div>
    )}
  </motion.div>
);

const ConnectorLine = ({ className }: { className?: string }) => (
  <div className={`bg-accent/25 ${className}`} />
);

const OrgChart = ({ manager, biAnalysts, adminAnalysts, designAnalysts, onAnalystClick }: OrgChartProps) => {
  const allMembers = [...biAnalysts, ...adminAnalysts, ...designAnalysts];
  const leftCol = allMembers.filter((_, i) => i % 2 === 0);
  const rightCol = allMembers.filter((_, i) => i % 2 !== 0);

  return (
    <div className="relative w-full py-8">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* Manager at top center */}
        <div className="flex justify-center mb-2">
          {manager && <OrgNode analyst={manager} delay={0.1} isBoss onClick={() => onAnalystClick?.(manager.id)} />}
        </div>

        {/* Vertical connector from manager */}
        <div className="flex justify-center">
          <ConnectorLine className="w-0.5 h-12" />
        </div>

        {/* Horizontal line */}
        <div className="flex justify-center px-8 md:px-16 lg:px-24">
          <ConnectorLine className="h-0.5 w-full max-w-4xl" />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-0 max-w-5xl mx-auto px-4">
          {/* Left column */}
          <div className="space-y-4">
            {leftCol.map((analyst, i) => (
              <div key={analyst.id} className="relative">
                {/* Connector stub */}
                <div className="hidden md:block absolute top-1/2 -right-6 w-6 h-0.5 bg-accent/20" />
                <OrgNode analyst={analyst} delay={0.2 + i * 0.08} onClick={() => onAnalystClick?.(analyst.id)} />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {rightCol.map((analyst, i) => (
              <div key={analyst.id} className="relative">
                {/* Connector stub */}
                <div className="hidden md:block absolute top-1/2 -left-6 w-6 h-0.5 bg-accent/20" />
                <OrgNode analyst={analyst} delay={0.25 + i * 0.08} onClick={() => onAnalystClick?.(analyst.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
