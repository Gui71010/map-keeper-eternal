import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2, ExternalLink, User, Tag, Eye } from 'lucide-react';
import { Report, useAdmin } from '@/contexts/AdminContext';

interface ReportDetailModalProps {
  report: Report;
  creatorName: string;
  onClose: () => void;
  showMetrics?: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const ReportDetailModal = ({ report, creatorName, onClose, showMetrics = true, onNavigate, hasPrev, hasNext }: ReportDetailModalProps) => {
  const { isAdmin, updateReport, removeReport, content } = useAdmin();
  const [imgIndex, setImgIndex] = useState(0);
  const images = report.images.length > 0 ? report.images : [''];
  const nextImg = () => setImgIndex((p) => (p + 1) % images.length);
  const prevImg = () => setImgIndex((p) => (p - 1 + images.length) % images.length);
  const biAnalysts = content.analysts.filter(a => a.type === 'bi');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-lg" onClick={onClose}>
      {onNavigate && hasPrev && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }} className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground shadow-2xl border border-border/30 transition-all duration-300 hover:scale-110">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {onNavigate && hasNext && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate('next'); }} className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground shadow-2xl border border-border/30 transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[95vw] xl:max-w-[88vw] 2xl:max-w-[82vw] h-[94vh] overflow-y-auto relative rounded-3xl border border-border/40 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 10%), hsl(215, 35%, 7%))' }}
      >
        {/* Top accent line */}
        <div className="h-1 w-full gradient-accent rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-border/30 sticky top-0 z-10 backdrop-blur-xl" style={{ background: 'hsl(222, 40%, 10% / 0.95)' }}>
          <div className="flex-1 min-w-0">
            {isAdmin ? (
              <input className="text-2xl md:text-3xl font-display font-bold text-foreground bg-transparent border-b border-border w-full outline-none focus:border-accent" value={report.name} onChange={(e) => updateReport(report.id, { name: e.target.value })} />
            ) : (
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">{report.name}</h3>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 ml-4 p-2.5 rounded-xl hover:bg-muted/50 transition-colors border border-border/30">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 grid lg:grid-cols-[1.8fr_1fr] gap-10 items-start">
          {/* Image area */}
          <div className="flex flex-col space-y-4">
            <div className="bg-muted/10 rounded-2xl overflow-hidden relative border border-border/20 aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {images[imgIndex] ? (
                    <img src={images[imgIndex]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-3">
                      <Eye className="w-16 h-16" />
                      <span className="text-lg font-medium">Sem imagem</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all border border-border/30 shadow-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all border border-border/30 shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur-sm border border-border/30">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)} className={`h-2 rounded-full transition-all duration-300 ${i === imgIndex ? 'bg-accent w-6' : 'bg-muted-foreground/30 w-2'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">URLs das imagens (uma por linha)</label>
                <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm min-h-[80px]" value={report.images.join('\n')} onChange={(e) => updateReport(report.id, { images: e.target.value.split('\n').filter(Boolean) })} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Creator */}
            <div className="rounded-2xl p-5 border border-border/20" style={{ background: 'hsl(215, 25%, 12% / 0.5)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Criado por</span>
              </div>
              {isAdmin ? (
                <select className="w-full mt-2 p-3 rounded-xl border border-border bg-background text-foreground text-sm" value={report.creatorId} onChange={(e) => updateReport(report.id, { creatorId: e.target.value })}>
                  {biAnalysts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              ) : (
                <p className="text-accent font-display font-bold text-lg mt-1">{creatorName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">Descrição</span>
              {isAdmin ? (
                <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm min-h-[120px]" value={report.description} onChange={(e) => updateReport(report.id, { description: e.target.value })} />
              ) : (
                <p className="text-foreground/85 leading-relaxed text-base">{report.description}</p>
              )}
            </div>

            {/* Eligible areas */}
            <div className="rounded-2xl p-5 border-2 border-fuchsia-500/30" style={{ background: 'linear-gradient(135deg, hsl(290, 60%, 14% / 0.55), hsl(260, 50%, 12% / 0.55))' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-fuchsia-500/20 flex items-center justify-center ring-1 ring-fuchsia-500/40">
                  <Tag className="w-4 h-4 text-fuchsia-300" />
                </div>
                <span className="text-sm text-fuchsia-200 font-display font-bold uppercase tracking-wider">Áreas elegíveis</span>
              </div>
              {isAdmin ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Selecione as áreas que podem visualizar este relatório:</p>
                  <div className="flex flex-wrap gap-2">
                    {(content.eligibleAreasOptions || []).map((opt) => {
                      const selected = (report.eligibleAreas || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const cur = report.eligibleAreas || [];
                            updateReport(report.id, { eligibleAreas: selected ? cur.filter(a => a !== opt) : [...cur, opt] });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-400/60 shadow-md shadow-fuchsia-500/20' : 'bg-muted/20 text-muted-foreground border-border/40 hover:border-fuchsia-400/40'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {(content.eligibleAreasOptions || []).length === 0 && (
                    <p className="text-xs text-amber-300/80">Cadastre as opções de áreas no painel admin da página de Relatórios.</p>
                  )}
                </div>
              ) : (
                (report.eligibleAreas && report.eligibleAreas.length > 0) ? (
                  <div className="flex flex-wrap gap-2">
                    {report.eligibleAreas.map((area, i) => (
                      <span key={i} className="px-4 py-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/40 text-sm font-semibold shadow-sm shadow-fuchsia-500/10">
                        {area}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-sm">Todas as áreas</p>
              )}
            </div>

            {showMetrics && report.metrics.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 block">Métricas</span>
                {isAdmin ? (
                  <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm min-h-[80px]" value={report.metrics.join('\n')} onChange={(e) => updateReport(report.id, { metrics: e.target.value.split('\n').filter(Boolean) })} />
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {report.metrics.map((m, i) => (
                      <div key={i} className="px-4 py-3 rounded-xl bg-muted/30 border border-border/30 text-sm font-medium text-foreground">{m}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Link */}
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">Link do Relatório</span>
              {isAdmin ? (
                <input className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm" value={report.link || ''} onChange={(e) => updateReport(report.id, { link: e.target.value })} />
              ) : (
                report.link ? (
                  <a href={report.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <ExternalLink className="w-4 h-4" />
                    Acessar relatório
                  </a>
                ) : null
              )}
            </div>

            {isAdmin && (
              <button onClick={() => { removeReport(report.id); onClose(); }} className="text-destructive text-sm hover:underline flex items-center gap-1 mt-4">
                <Trash2 className="w-4 h-4" /> Remover relatório
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;
