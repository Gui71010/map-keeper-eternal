import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, MousePointerClick, X, Plus, Sparkles, Wrench, ClipboardList, Calendar, Shield } from 'lucide-react';
import { Analyst, useAdmin } from '@/contexts/AdminContext';
import { useState } from 'react';

interface AnalystCardProps {
  analyst: Analyst;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  editable?: boolean;
  size?: 'normal' | 'large';
  showClickHint?: boolean;
}

const AnalystCard = ({ analyst, index, isSelected, onClick, showDetails, editable, size = 'normal', showClickHint }: AnalystCardProps) => {
  const { isAdmin, updateAnalyst, removeAnalyst } = useAdmin();
  const [newSkill, setNewSkill] = useState('');
  const [newAttribution, setNewAttribution] = useState('');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateAnalyst(analyst.id, { skills: [...(analyst.skills || []), newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (idx: number) => {
    updateAnalyst(analyst.id, { skills: (analyst.skills || []).filter((_, i) => i !== idx) });
  };

  const addAttribution = () => {
    if (!newAttribution.trim()) return;
    updateAnalyst(analyst.id, { attributions: [...(analyst.attributions || []), newAttribution.trim()] });
    setNewAttribution('');
  };

  const removeAttribution = (idx: number) => {
    updateAnalyst(analyst.id, { attributions: (analyst.attributions || []).filter((_, i) => i !== idx) });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.08 }}
        onClick={onClick}
        className={`glass-card rounded-xl transition-all duration-300 cursor-pointer hover:shadow-xl border-2 ${
          size === 'large' ? 'p-8' : 'p-6'
        } ${
          isSelected ? 'ring-2 ring-accent shadow-xl shadow-accent/10' : ''
        } ${
          analyst.type === 'manager'
            ? 'border-accent/30 bg-gradient-to-br from-card/90 to-accent/5 hover:border-accent hover:shadow-accent/20 hover:shadow-lg'
            : 'border-transparent hover:border-accent/50 hover:shadow-accent/10 hover:shadow-lg'
        }`}
      >
        <div className={`flex items-center gap-4 ${size === 'large' ? 'flex-col text-center sm:flex-row sm:text-left' : ''}`}>
          <div className={`relative rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center ${
            size === 'large' ? 'w-24 h-24 ring-4 ring-accent/20' : 'w-16 h-16'
          } ${analyst.type === 'manager' ? 'ring-4 ring-accent/30 shadow-lg shadow-accent/10' : ''}`}>
            {analyst.photo ? (
              <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
            ) : (
              <User className={`${size === 'large' ? 'w-12 h-12' : 'w-8 h-8'} text-muted-foreground`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-display font-semibold text-foreground truncate ${size === 'large' ? 'text-xl' : 'text-lg'}`}>{analyst.name}</h4>
            <p className="text-muted-foreground text-sm">{analyst.role}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full font-medium bg-accent/10 text-accent border border-accent/20 text-xs">
              {analyst.area}
            </span>
          </div>
        </div>

        {showClickHint && !isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 mt-3 text-xs text-accent/70"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Clique para mais informações</span>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showDetails && isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={onClick}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[92vh] overflow-y-auto relative rounded-3xl border-2 border-accent/20 shadow-2xl shadow-accent/10"
              style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 12%), hsl(215, 35%, 8%))' }}
            >
              {/* Close button */}
              <button
                onClick={onClick}
                className="absolute top-5 right-5 p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors z-10 border border-border/50"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              {/* Top accent bar */}
              <div className="h-1.5 w-full gradient-accent rounded-t-3xl" />

              <div className="p-8 md:p-10">
                {/* Profile Header - horizontal layout */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                  <div className="relative shrink-0">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-2xl ring-4 ring-accent/20 border-2 border-accent/10">
                      {analyst.photo ? (
                        <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-20 h-20 text-muted-foreground" />
                      )}
                    </div>
                    {analyst.type === 'manager' && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left flex-1 md:py-4">
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">{analyst.name}</h3>
                    <p className="text-lg text-muted-foreground mt-2">{analyst.role}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
                      <span className="inline-block px-5 py-2 rounded-full font-semibold bg-accent/15 text-accent border border-accent/25 text-sm">
                        {analyst.area}
                      </span>
                      {analyst.age && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="text-foreground text-sm font-medium">{analyst.age} anos</span>
                        </div>
                      )}
                    </div>
                    {/* Bio inline next to photo */}
                    {analyst.bio && !isAdmin && (
                      <p className="text-foreground/80 leading-relaxed text-base mt-5">{analyst.bio}</p>
                    )}
                  </div>
                </div>

                {isAdmin && editable ? (
                  <div className="space-y-6">
                    {/* Basic fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Nome</label>
                        <input className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={analyst.name} onChange={(e) => updateAnalyst(analyst.id, { name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Idade</label>
                        <input className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={analyst.age || ''} onChange={(e) => updateAnalyst(analyst.id, { age: e.target.value })} placeholder="Ex: 25" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Cargo</label>
                        <input className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={analyst.role} onChange={(e) => updateAnalyst(analyst.id, { role: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Área</label>
                        <input className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={analyst.area} onChange={(e) => updateAnalyst(analyst.id, { area: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">URL da Foto</label>
                      <input className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={analyst.photo} onChange={(e) => updateAnalyst(analyst.id, { photo: e.target.value })} placeholder="Cole a URL da imagem aqui" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Bio</label>
                      <textarea className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm min-h-[80px] focus:border-accent outline-none transition" value={analyst.bio} onChange={(e) => updateAnalyst(analyst.id, { bio: e.target.value })} />
                    </div>

                    {/* Attributions */}
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/50">
                      <label className="text-sm text-foreground font-semibold flex items-center gap-2 mb-4"><ClipboardList className="w-4 h-4 text-accent" /> Atribuições</label>
                      <div className="space-y-2 mb-3">
                        {(analyst.attributions || []).map((attr, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                            <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                            <span className="flex-1 text-sm text-foreground">{attr}</span>
                            <button onClick={() => removeAttribution(i)} className="text-destructive/60 hover:text-destructive transition"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input className="flex-1 p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={newAttribution} onChange={(e) => setNewAttribution(e.target.value)} placeholder="Nova atribuição" onKeyDown={(e) => e.key === 'Enter' && addAttribution()} />
                        <button onClick={addAttribution} className="px-4 py-3 rounded-xl gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/50">
                      <label className="text-sm text-foreground font-semibold flex items-center gap-2 mb-4"><Wrench className="w-4 h-4 text-accent" /> Habilidades & Ferramentas</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(analyst.skills || []).map((skill, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/25 text-sm font-medium">
                            {skill}
                            <button onClick={() => removeSkill(i)} className="hover:text-destructive transition"><X className="w-3.5 h-3.5" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input className="flex-1 p-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:border-accent outline-none transition" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ex: Power BI, SQL, Python..." onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                        <button onClick={addSkill} className="px-4 py-3 rounded-xl gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); removeAnalyst(analyst.id); }} className="text-destructive text-sm hover:underline flex items-center gap-1.5 mt-2">
                      <Trash2 className="w-4 h-4" /> Remover analista
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quick stats bar */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl p-4 text-center border border-accent/15" style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.10), hsl(var(--accent) / 0.03))' }}>
                        <p className="text-2xl font-display font-bold text-accent">{(analyst.attributions || []).length}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Atribuições</p>
                      </div>
                      <div className="rounded-xl p-4 text-center border border-accent/15" style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.10), hsl(var(--accent) / 0.03))' }}>
                        <p className="text-2xl font-display font-bold text-accent">{(analyst.skills || []).length}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Habilidades</p>
                      </div>
                      <div className="rounded-xl p-4 text-center border border-accent/15 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.10), hsl(var(--accent) / 0.03))' }}>
                        <p className="text-sm font-display font-bold text-accent leading-tight">{analyst.area}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Área</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Attributions */}
                      {(analyst.attributions || []).length > 0 && (
                        <div className="rounded-2xl p-6 border border-border/30" style={{ background: 'linear-gradient(135deg, hsl(215, 25%, 14% / 0.4), hsl(215, 30%, 10% / 0.6))' }}>
                          <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                              <ClipboardList className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <h4 className="font-display font-bold text-foreground text-lg">Atribuições</h4>
                          </div>
                          <div className="space-y-2.5">
                            {analyst.attributions!.map((attr, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                                <span className="text-foreground/90 text-sm leading-relaxed">{attr}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {(analyst.skills || []).length > 0 && (
                        <div className="rounded-2xl p-6 border border-border/30" style={{ background: 'linear-gradient(135deg, hsl(215, 25%, 14% / 0.4), hsl(215, 30%, 10% / 0.6))' }}>
                          <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <h4 className="font-display font-bold text-foreground text-lg">Habilidades & Ferramentas</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analyst.skills!.map((skill, i) => (
                              <span key={i} className="px-3.5 py-1.5 rounded-full bg-accent/12 text-accent border border-accent/25 text-sm font-semibold shadow-sm hover:bg-accent/20 transition-colors">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalystCard;
