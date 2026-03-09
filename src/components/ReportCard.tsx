import { motion } from 'framer-motion';
import { FileText, User, ArrowUpRight } from 'lucide-react';
import { Report } from '@/contexts/AdminContext';

interface ReportCardProps {
  report: Report;
  creatorName: string;
  index: number;
  onClick: () => void;
}

const ReportCard = ({ report, creatorName, index, onClick }: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04 }}
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent/40 transition-all duration-400"
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 40px hsl(var(--accent) / 0.12), 0 0 0 1px hsl(var(--accent) / 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="aspect-video bg-muted/30 relative overflow-hidden">
        {report.images[0] ? (
          <img src={report.images[0]} alt={report.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
            <FileText className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-end p-3">
          <div className="w-9 h-9 rounded-full bg-accent/90 flex items-center justify-center shadow-lg">
            <ArrowUpRight className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-display font-bold text-foreground truncate text-base">{report.name}</h4>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{report.description}</p>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
            <User className="w-3 h-3 text-accent" />
          </div>
          <span className="text-xs text-accent font-medium">{creatorName}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
