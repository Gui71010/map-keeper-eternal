import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ImageIcon, MapPin, Crown, Palette, Briefcase, BarChart3, Globe, ChevronLeft, ChevronRight, Trash2, Rocket } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import GalaxyParticles from '@/components/GalaxyParticles';
import BrazilMap from '@/components/BrazilMap';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst, addProject, updateProject, removeProject } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const projectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const managerAnalysts = content.analysts.filter((a) => a.type === 'manager');
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const adminAnalysts = content.analysts.filter((a) => a.type === 'admin');
  const designAnalysts = content.analysts.filter((a) => a.type === 'design');
  const orgImage = content.orgChartUrl || '';
  const projects = content.projects || [];

  useEffect(() => {
    if (projects.length <= 1) return;
    projectTimerRef.current = setInterval(() => {
      setCurrentProjectIdx(prev => (prev + 1) % projects.length);
    }, 5000);
    return () => { if (projectTimerRef.current) clearInterval(projectTimerRef.current); };
  }, [projects.length]);

  const goToProject = (dir: 'prev' | 'next') => {
    if (projectTimerRef.current) clearInterval(projectTimerRef.current);
    setCurrentProjectIdx(prev => {
      if (dir === 'next') return (prev + 1) % projects.length;
      return (prev - 1 + projects.length) % projects.length;
    });
  };

  const SectionHeader = ({ icon: Icon, title, editKey, onAdd, addLabel }: { icon: any; title: string; editKey?: keyof typeof content; onAdd?: () => void; addLabel?: string }) => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        {isAdmin && editKey ? (
          <input className="text-2xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent" value={content[editKey] as string} onChange={(e) => updateContent({ [editKey]: e.target.value })} />
        ) : (
          <h3 className="text-2xl font-display font-bold text-foreground">{title}</h3>
        )}
      </div>
      {isAdmin && onAdd && (
        <button onClick={onAdd} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4" /> {addLabel || 'Adicionar'}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16">
        <GalaxyParticles />
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/2 w-80 h-80 rounded-full bg-teal blur-[100px]" /></div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? <input className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={content.areaTitle} onChange={(e) => updateContent({ areaTitle: e.target.value })} /> : <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">{content.areaTitle}</h2>}
          <p className="text-accent text-lg font-medium mb-2">AeC - Diretoria de Pessoas - People Analytics</p>
          <p className="text-primary-foreground/40 text-sm mb-6">Equipe de Business Intelligence</p>
          {isAdmin ? <textarea className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent" value={content.areaDescription} onChange={(e) => updateContent({ areaDescription: e.target.value })} /> : <p className="text-primary-foreground/80 leading-relaxed text-lg">{content.areaDescription}</p>}
        </div>
      </motion.section>

      {/* Organograma */}
      {(orgImage || isAdmin) && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="glass-card rounded-2xl p-4 overflow-hidden">
          {isAdmin ? <input className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2 bg-transparent border-b border-border w-full outline-none focus:border-accent" value={content.orgChartTitle} onChange={(e) => updateContent({ orgChartTitle: e.target.value })} /> : <h3 className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2">{content.orgChartTitle}</h3>}
          {orgImage && <img src={orgImage} alt="Hierarquia do Setor" className="w-full rounded-xl" />}
          {isAdmin && (
            <div className="px-4 pb-4 pt-3 space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><ImageIcon className="w-3 h-3" /> URL da imagem do organograma</label>
              <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={content.orgChartUrl} onChange={(e) => updateContent({ orgChartUrl: e.target.value })} placeholder="Cole a URL da nova imagem do organograma" />
            </div>
          )}
        </motion.section>
      )}

      {/* O que fazemos + Mapa */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="relative">
        <div className="absolute inset-0 rounded-2xl gradient-accent opacity-[0.15]" />
        <div className="relative glass-card rounded-2xl p-10 md:p-14 border-2 border-accent/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center"><Globe className="w-6 h-6 text-primary-foreground" /></div>
            {isAdmin ? <input className="text-3xl md:text-4xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent" value={content.aboutUsTitle} onChange={(e) => updateContent({ aboutUsTitle: e.target.value })} /> : <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">{content.aboutUsTitle}</h3>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              {isAdmin ? <textarea className="text-foreground/80 leading-relaxed text-lg bg-transparent border border-border rounded-lg p-3 w-full min-h-[300px] outline-none focus:border-accent whitespace-pre-wrap" value={content.aboutUsText} onChange={(e) => updateContent({ aboutUsText: e.target.value })} /> : <div className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">{content.aboutUsText}</div>}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center"><MapPin className="w-4 h-4 text-primary-foreground" /></div>
                <h4 className="font-display font-bold text-foreground text-lg">Nossas Localidades</h4>
              </div>
              <BrazilMap states={content.mapStates} onUpdateStates={(newStates) => updateContent({ mapStates: newStates })} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Intro text */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.6 }} className="text-center py-8">
        <div className="relative inline-block">
          <div className="absolute -inset-4 gradient-accent opacity-10 rounded-2xl blur-xl" />
          <div className="relative">
            {isAdmin ? <textarea className="text-xl md:text-2xl text-foreground font-display font-semibold bg-transparent border border-border rounded-lg p-4 w-full max-w-3xl mx-auto min-h-[60px] outline-none focus:border-accent text-center" value={content.analystIntroText} onChange={(e) => updateContent({ analystIntroText: e.target.value })} /> : <p className="text-xl md:text-2xl text-foreground font-display font-semibold max-w-3xl mx-auto">{content.analystIntroText}</p>}
            <div className="w-24 h-1 gradient-accent rounded-full mx-auto mt-4" />
          </div>
        </div>
      </motion.section>

      {/* Manager */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29, duration: 0.6 }}>
        <SectionHeader icon={Crown} title={content.managerTitle} editKey="managerTitle" onAdd={isAdmin ? () => addAnalyst({ id: Date.now().toString(), name: 'Novo Gerente', role: 'Gerente', area: 'People Analytics', photo: '', bio: 'Descrição.', type: 'manager' }) : undefined} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {managerAnalysts.map((analyst, i) => <AnalystCard key={analyst.id} analyst={analyst} index={i} isSelected={selectedAnalyst === analyst.id} onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)} showDetails editable showClickHint size="large" />)}
        </div>
      </motion.section>

      {/* BI Analysts */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <SectionHeader icon={BarChart3} title={content.biAnalystsTitle} editKey="biAnalystsTitle" onAdd={isAdmin ? () => addAnalyst({ id: Date.now().toString(), name: 'Novo Analista', role: 'Analista de BI', area: 'Nova Área', photo: '', bio: 'Descrição.', type: 'bi' }) : undefined} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {biAnalysts.map((analyst, i) => <AnalystCard key={analyst.id} analyst={analyst} index={i} isSelected={selectedAnalyst === analyst.id} onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)} showDetails editable showClickHint />)}
        </div>
      </motion.section>

      {/* Admin Analysts */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <SectionHeader icon={Briefcase} title={content.adminAnalystsTitle} editKey="adminAnalystsTitle" onAdd={isAdmin ? () => addAnalyst({ id: Date.now().toString(), name: 'Novo Analista Admin', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Descrição.', type: 'admin' }) : undefined} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {adminAnalysts.map((analyst, i) => <AnalystCard key={analyst.id} analyst={analyst} index={i} isSelected={selectedAnalyst === analyst.id} onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)} showDetails editable showClickHint />)}
        </div>
      </motion.section>

      {/* Design Analysts */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <SectionHeader icon={Palette} title={content.designAnalystsTitle} editKey="designAnalystsTitle" onAdd={isAdmin ? () => addAnalyst({ id: Date.now().toString(), name: 'Novo Designer', role: 'Analista de Design Gráfico', area: 'Design', photo: '', bio: 'Descrição.', type: 'design' }) : undefined} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {designAnalysts.map((analyst, i) => <AnalystCard key={analyst.id} analyst={analyst} index={i} isSelected={selectedAnalyst === analyst.id} onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)} showDetails editable showClickHint />)}
        </div>
      </motion.section>

      {/* Nossos principais projetos */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }} className="relative">
        <SectionHeader
          icon={Globe}
          title="Nossos principais projetos"
          onAdd={isAdmin ? () => addProject({ id: Date.now().toString(), title: 'Novo Projeto', description: 'Descrição do projeto.', imageUrl: '' }) : undefined}
          addLabel="Adicionar Projeto"
        />

        {projects.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, hsl(215, 50%, 12%), hsl(215, 40%, 18%))' }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[150px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary blur-[100px]" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 min-h-[400px]">
              {/* Image side */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectIdx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full min-h-[300px] md:min-h-[400px]"
                  >
                    {projects[currentProjectIdx]?.imageUrl ? (
                      <img src={projects[currentProjectIdx].imageUrl} alt={projects[currentProjectIdx].title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/10">
                        <Globe className="w-20 h-20 text-accent/30" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                {projects.length > 1 && (
                  <>
                    <button onClick={() => goToProject('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:border-accent hover:text-accent transition-all backdrop-blur-sm bg-foreground/10">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => goToProject('next')} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:border-accent hover:text-accent transition-all backdrop-blur-sm bg-foreground/10">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Text side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-10 h-1 bg-accent rounded-full mb-6" />
                    {isAdmin ? (
                      <input className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={projects[currentProjectIdx]?.title || ''} onChange={(e) => updateProject(projects[currentProjectIdx].id, { title: e.target.value })} />
                    ) : (
                      <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">{projects[currentProjectIdx]?.title}</h3>
                    )}
                    {isAdmin ? (
                      <textarea className="text-primary-foreground/70 text-lg leading-relaxed bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent" value={projects[currentProjectIdx]?.description || ''} onChange={(e) => updateProject(projects[currentProjectIdx].id, { description: e.target.value })} />
                    ) : (
                      <p className="text-primary-foreground/70 text-lg leading-relaxed">{projects[currentProjectIdx]?.description}</p>
                    )}
                    {isAdmin && (
                      <div className="mt-4 space-y-2">
                        <label className="text-xs text-primary-foreground/50">URL da imagem</label>
                        <input className="w-full p-2 rounded-lg border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent" value={projects[currentProjectIdx]?.imageUrl || ''} onChange={(e) => updateProject(projects[currentProjectIdx].id, { imageUrl: e.target.value })} placeholder="Cole a URL da imagem" />
                        <button onClick={() => removeProject(projects[currentProjectIdx].id)} className="text-destructive text-xs hover:underline flex items-center gap-1 mt-2"><Trash2 className="w-3 h-3" /> Remover projeto</button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                {projects.length > 1 && (
                  <div className="flex gap-2 mt-8">
                    {projects.map((_, i) => (
                      <button key={i} onClick={() => setCurrentProjectIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentProjectIdx ? 'w-8 bg-accent' : 'w-3 bg-primary-foreground/20'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default NossaAreaPage;
