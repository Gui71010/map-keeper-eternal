import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, MousePointerClick, X, Plus, Sparkles, Wrench, ClipboardList, Calendar } from 'lucide-react';
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
            onClick={onClick}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={onClick}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-lg ring-4 ring-accent/20">
                    {analyst.photo ? (
                      <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-3xl font-display font-bold text-foreground">{analyst.name}</h3>
                    <p className="text-lg text-muted-foreground mt-1">{analyst.role}</p>
                    <span className="inline-block mt-2 px-4 py-1 rounded-full font-medium bg-accent/10 text-accent border border-accent/20 text-sm">
                      {analyst.area}
                    </span>
                    {analyst.age && (
                      <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">{analyst.age} anos</span>
                      </div>
                    )}
                  </div>
                </div>

                {isAdmin && editable ? (
                  <div className="space-y-5">
                    {/* Basic fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">Nome</label>
                        <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.name} onChange={(e) => updateAnalyst(analyst.id, { name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Idade</label>
                        <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.age || ''} onChange={(e) => updateAnalyst(analyst.id, { age: e.target.value })} placeholder="Ex: 25" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">Cargo</label>
                        <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.role} onChange={(e) => updateAnalyst(analyst.id, { role: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Área</label>
                        <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.area} onChange={(e) => updateAnalyst(analyst.id, { area: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">URL da Foto</label>
                      <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.photo} onChange={(e) => updateAnalyst(analyst.id, { photo: e.target.value })} placeholder="Cole a URL da imagem aqui" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Bio</label>
                      <textarea className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[60px]" value={analyst.bio} onChange={(e) => updateAnalyst(analyst.id, { bio: e.target.value })} />
                    </div>

                    {/* Attributions */}
                    <div>
                      <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><ClipboardList className="w-3 h-3" /> Atribuições</label>
                      <div className="space-y-1.5 mb-2">
                        {(analyst.attributions || []).map((attr, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                            <span className="flex-1 text-sm text-foreground">{attr}</span>
                            <button onClick={() => removeAttribution(i)} className="text-destructive/60 hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input className="flex-1 p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={newAttribution} onChange={(e) => setNewAttribution(e.target.value)} placeholder="Nova atribuição" onKeyDown={(e) => e.key === 'Enter' && addAttribution()} />
                        <button onClick={addAttribution} className="px-3 py-2 rounded-lg gradient-accent text-accent-foreground text-xs font-medium"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Wrench className="w-3 h-3" /> Habilidades & Ferramentas</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(analyst.skills || []).map((skill, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-medium">
                            {skill}
                            <button onClick={() => removeSkill(i)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input className="flex-1 p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ex: Power BI, SQL, Python..." onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                        <button onClick={addSkill} className="px-3 py-2 rounded-lg gradient-accent text-accent-foreground text-xs font-medium"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); removeAnalyst(analyst.id); }} className="text-destructive text-sm hover:underline flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remover analista
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Bio */}
                    <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                      <p className="text-foreground leading-relaxed text-base">{analyst.bio}</p>
                    </div>

                    {/* Attributions */}
                    {(analyst.attributions || []).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ClipboardList className="w-4 h-4 text-accent" />
                          <h4 className="font-display font-semibold text-foreground text-sm">Atribuições</h4>
                        </div>
                        <div className="space-y-2">
                          {analyst.attributions!.map((attr, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              <span className="text-foreground/80 text-sm">{attr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {(analyst.skills || []).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <h4 className="font-display font-semibold text-foreground text-sm">Habilidades & Ferramentas</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analyst.skills!.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
