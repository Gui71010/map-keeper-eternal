import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2, ExternalLink, User, Tag } from 'lucide-react';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      {onNavigate && hasPrev && <button onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }} className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 shadow-2xl border border-navy-light/30 transition-all hover:scale-110"><ChevronLeft className="w-7 h-7" /></button>}
      {onNavigate && hasNext && <button onClick={(e) => { e.stopPropagation(); onNavigate('next'); }} className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 shadow-2xl border border-navy-light/30 transition-all hover:scale-110"><ChevronRight className="w-7 h-7" /></button>}

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-2xl w-full max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] h-[94vh] overflow-y-auto relative mx-2">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10">
          <div className="flex-1 min-w-0">
            {isAdmin ? (
              <input className="text-2xl md:text-4xl font-display font-bold text-foreground bg-transparent border-b border-border w-full outline-none focus:border-accent" value={report.name} onChange={(e) => updateReport(report.id, { name: e.target.value })} />
            ) : (
              <h3 className="text-2xl md:text-4xl font-display font-bold text-foreground">{report.name}</h3>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 ml-4 p-3 rounded-xl hover:bg-muted transition-colors"><X className="w-7 h-7" /></button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          {/* Image area - much larger */}
          <div className="flex flex-col space-y-4">
            <div className="bg-muted/20 rounded-2xl overflow-hidden relative flex items-center justify-center border border-border/30" style={{ minHeight: '70vh', maxHeight: '85vh' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full absolute inset-0 flex items-center justify-center p-4"
                >
                  {images[imgIndex] ? (
                    <img src={images[imgIndex]} alt="" className="max-w-full max-h-full object-contain rounded-lg" style={{ minHeight: '60vh' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg" style={{ minHeight: '60vh' }}>
                      Sem imagem
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all border border-border/50">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all border border-border/50">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, i) => <button key={i} onClick={() => setImgIndex(i)} className={`w-3 h-3 rounded-full transition-all ${i === imgIndex ? 'bg-accent w-8' : 'bg-foreground/30'}`} />)}
                  </div>
                </>
              )}
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">URLs das imagens (uma por linha)</label>
                <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm min-h-[80px]" value={report.images.join('\n')} onChange={(e) => updateReport(report.id, { images: e.target.value.split('\n').filter(Boolean) })} placeholder="Cole as URLs das imagens, uma por linha" />
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="space-y-8">
            {/* Creator */}
            <div className="glass-card rounded-2xl p-6 border border-accent/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Criado por</span>
              </div>
              {isAdmin ? (
                <select className="w-full mt-2 p-3 rounded-xl border border-border bg-background text-foreground text-base" value={report.creatorId} onChange={(e) => updateReport(report.id, { creatorId: e.target.value })}>
                  {biAnalysts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              ) : (
                <p className="text-accent font-display font-bold text-xl mt-1">{creatorName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <span className="text-sm text-muted-foreground font-medium block mb-2">Descrição</span>
              {isAdmin ? (
                <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-base min-h-[120px]" value={report.description} onChange={(e) => updateReport(report.id, { description: e.target.value })} />
              ) : (
                <p className="text-foreground leading-relaxed text-lg">{report.description}</p>
              )}
            </div>

            {/* Eligible areas */}
            <div className="glass-card rounded-2xl p-6 border border-accent/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-accent" />
                </div>
                <span className="text-base text-foreground font-display font-bold">Áreas elegíveis à visualização</span>
              </div>
              {isAdmin ? (
                <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-base min-h-[80px]" value={(report.eligibleAreas || []).join('\n')} onChange={(e) => updateReport(report.id, { eligibleAreas: e.target.value.split('\n').filter(Boolean) })} placeholder="Uma área por linha" />
              ) : (
                (report.eligibleAreas && report.eligibleAreas.length > 0) ? (
                  <div className="flex flex-wrap gap-3">
                    {report.eligibleAreas.map((area, i) => (
                      <span key={i} className="px-5 py-2.5 rounded-xl bg-accent/15 text-accent border border-accent/25 text-base font-semibold">
                        {area}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-lg">Todas as áreas</p>
              )}
            </div>

            {showMetrics && (
              <div>
                <span className="text-sm text-muted-foreground font-medium mb-3 block">Métricas</span>
                {isAdmin ? (
                  <textarea className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-base min-h-[80px]" value={report.metrics.join('\n')} onChange={(e) => updateReport(report.id, { metrics: e.target.value.split('\n').filter(Boolean) })} placeholder="Uma métrica por linha" />
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {report.metrics.map((m, i) => (
                      <div key={i} className="px-5 py-4 rounded-xl bg-muted/50 border border-border text-base font-medium text-foreground">{m}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Link */}
            <div>
              <span className="text-sm text-muted-foreground font-medium block mb-2">Link do Relatório</span>
              {isAdmin ? (
                <input className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-base" value={report.link || ''} onChange={(e) => updateReport(report.id, { link: e.target.value })} placeholder="Cole o link do relatório aqui" />
              ) : (
                report.link ? (
                  <a href={report.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl gradient-accent text-accent-foreground font-semibold text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <ExternalLink className="w-5 h-5" />
                    Clique para acessar
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
