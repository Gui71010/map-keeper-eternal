import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ImageIcon, MapPin, Crown, Palette, Briefcase, BarChart3, Globe, ChevronLeft, ChevronRight, Trash2, Rocket, FileText, DollarSign, User, ChevronDown, Mail, Phone, MessageCircle, Plane } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import GalaxyParticles from '@/components/GalaxyParticles';
import BrazilMap from '@/components/BrazilMap';
import AreasRoadmap from '@/components/AreasRoadmap';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst, addProject, updateProject, removeProject, addAreaReportCard, updateAreaReportCard, removeAreaReportCard, addRqCategory, updateRqCategory, removeRqCategory, addRqReport, updateRqReport, removeRqReport } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const [expandedRqCategory, setExpandedRqCategory] = useState<string | null>(null);
  const [expandedRqCategory, setExpandedRqCategory] = useState<string | null>(null);
  const projectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const managerAnalysts = content.analysts.filter((a) => a.type === 'manager');
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const adminAnalysts = content.analysts.filter((a) => a.type === 'admin');
  const designAnalysts = content.analysts.filter((a) => a.type === 'design');
  const orgImage = content.orgChartUrl || '';
  const projects = content.projects || [];
  const areaReportCards = content.areaReportCards || [];

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
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
            {/* Relatórios por Área */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center"><FileText className="w-4 h-4 text-primary-foreground" /></div>
                  <h4 className="font-display font-bold text-foreground text-lg">Relatórios por Área</h4>
                </div>
                {isAdmin && (
                  <button onClick={() => addAreaReportCard({ id: Date.now().toString(), area: 'Nova Área', count: 0, icon: '📊' })} className="px-3 py-1.5 rounded-lg gradient-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {areaReportCards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="glass-card rounded-xl p-4 border border-accent/10 relative overflow-hidden group hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.08), transparent 70%)' }} />
                    <div className="relative flex items-center gap-4">
                      {isAdmin ? (
                        <input className="text-2xl w-10 bg-transparent border-b border-border text-center outline-none focus:border-accent" value={card.icon} onChange={(e) => updateAreaReportCard(card.id, { icon: e.target.value })} />
                      ) : (
                        <span className="text-2xl">{card.icon}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        {isAdmin ? (
                          <input className="font-display font-semibold text-foreground text-sm bg-transparent border-b border-border w-full outline-none focus:border-accent" value={card.area} onChange={(e) => updateAreaReportCard(card.id, { area: e.target.value })} />
                        ) : (
                          <p className="font-display font-semibold text-foreground text-sm truncate">{card.area}</p>
                        )}
                        <div className="flex items-baseline gap-1 mt-0.5">
                          {isAdmin ? (
                            <input type="number" className="text-xl font-display font-bold text-accent w-16 bg-transparent border-b border-border outline-none focus:border-accent" value={card.count} onChange={(e) => updateAreaReportCard(card.id, { count: parseInt(e.target.value) || 0 })} />
                          ) : (
                            <span className="text-xl font-display font-bold text-accent">{card.count}</span>
                          )}
                          <span className="text-foreground/50 text-xs">relatórios</span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => removeAreaReportCard(card.id)} className="text-destructive/60 hover:text-destructive transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Areas Roadmap */}
      <AreasRoadmap />

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
          icon={Rocket}
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

            <div className="relative z-10 grid md:grid-cols-2 min-h-[750px]">
              {/* Image side */}
              <div className="relative overflow-hidden flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectIdx}
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-full h-full flex items-center justify-center"
                    style={{ perspective: '1200px' }}
                  >
                    {projects[currentProjectIdx]?.imageUrl ? (
                      <img src={projects[currentProjectIdx].imageUrl} alt={projects[currentProjectIdx].title} className="max-w-full max-h-[700px] object-contain rounded-2xl shadow-2xl" />
                    ) : (
                      <div className="w-full h-[700px] flex items-center justify-center bg-muted/10 rounded-2xl">
                        <Rocket className="w-20 h-20 text-accent/30" />
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

            {/* Thumbnail strip */}
            {projects.length > 1 && (
              <div className="relative z-10 border-t border-primary-foreground/10 px-6 py-4">
                <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {projects.map((project, i) => (
                    <button
                      key={project.id}
                      onClick={() => setCurrentProjectIdx(i)}
                      className={`shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${i === currentProjectIdx ? 'ring-2 ring-accent scale-105 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                      style={{ width: '120px', height: '75px' }}
                    >
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-accent/40" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.section>

      {/* Tratativa de Requisições RQ */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative">
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent/20" style={{ background: 'linear-gradient(135deg, hsl(215, 50%, 8%), hsl(215, 40%, 14%))' }}>
          <GalaxyParticles />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-amber-500 blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-500 blur-[150px]" />
          </div>
          <div className="relative z-10 p-10 md:p-14">
            {/* Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                {isAdmin ? (
                  <input className="text-3xl md:text-4xl font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={content.rqTitle} onChange={(e) => updateContent({ rqTitle: e.target.value })} />
                ) : (
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{content.rqTitle}</h3>
                )}
              </div>
            </div>

            {/* Description + Analysts */}
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-10 items-start mb-10">
              <div>
                {isAdmin ? (
                  <textarea className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-4 w-full min-h-[150px] outline-none focus:border-accent" value={content.rqDescription} onChange={(e) => updateContent({ rqDescription: e.target.value })} />
                ) : (
                  <p className="text-primary-foreground/80 leading-relaxed text-lg">{content.rqDescription}</p>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-display font-bold text-primary-foreground/80 mb-4">Analistas Responsáveis</h4>
                {adminAnalysts.map((analyst, i) => (
                  <motion.button
                    key={analyst.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    onClick={() => setSelectedRqAnalyst(selectedRqAnalyst === analyst.id ? null : analyst.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 bg-white/5 ${
                      selectedRqAnalyst === analyst.id ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-transparent hover:border-amber-500/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 ring-2 ring-amber-500/20">
                      {analyst.photo ? (
                        <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-display font-semibold text-primary-foreground">{analyst.name}</p>
                      <p className="text-primary-foreground/50 text-sm">{analyst.role}</p>
                    </div>
                  </motion.button>
                ))}
                {selectedRqAnalyst && (
                  <button onClick={() => setSelectedRqAnalyst(null)} className="text-amber-400 text-xs hover:underline">Limpar filtro</button>
                )}
              </div>
            </div>

            {/* RQ Category Buttons */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-display font-bold text-primary-foreground/80">Categorias de Requisição</h4>
                {isAdmin && (
                  <button onClick={() => addRqCategory({ id: Date.now().toString(), label: 'Nova Categoria', description: 'Descrição da categoria.', callPath: 'ServiceNow > Caminho', responsibleAnalystIds: [] })} className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(content.rqCategories || [])
                  .filter(cat => !selectedRqAnalyst || (cat.responsibleAnalystIds || []).includes(selectedRqAnalyst))
                  .map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => setExpandedRqCategory(expandedRqCategory === cat.id ? null : cat.id)}
                      className={`w-full px-5 py-3 rounded-xl text-left font-medium transition-all duration-300 flex items-center justify-between border-2 ${
                        expandedRqCategory === cat.id
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-amber-500/5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30'
                      }`}
                    >
                      <span className="text-sm">{cat.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedRqCategory === cat.id ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedRqCategory === cat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-4 rounded-xl bg-white/5 border border-primary-foreground/10 space-y-3">
                            {isAdmin ? (
                              <>
                                <div>
                                  <label className="text-xs text-primary-foreground/50">Nome</label>
                                  <input className="w-full p-2 rounded-lg border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent" value={cat.label} onChange={(e) => updateRqCategory(cat.id, { label: e.target.value })} />
                                </div>
                                <div>
                                  <label className="text-xs text-primary-foreground/50">Descrição</label>
                                  <textarea className="w-full p-2 rounded-lg border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent min-h-[60px]" value={cat.description} onChange={(e) => updateRqCategory(cat.id, { description: e.target.value })} />
                                </div>
                                <div>
                                  <label className="text-xs text-primary-foreground/50">Caminho do Chamado</label>
                                  <input className="w-full p-2 rounded-lg border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent" value={cat.callPath} onChange={(e) => updateRqCategory(cat.id, { callPath: e.target.value })} />
                                </div>
                                <div>
                                  <label className="text-xs text-primary-foreground/50">Analistas Responsáveis</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {adminAnalysts.map(a => (
                                      <button
                                        key={a.id}
                                        onClick={() => {
                                          const ids = cat.responsibleAnalystIds || [];
                                          updateRqCategory(cat.id, {
                                            responsibleAnalystIds: ids.includes(a.id) ? ids.filter(i => i !== a.id) : [...ids, a.id]
                                          });
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                          (cat.responsibleAnalystIds || []).includes(a.id)
                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                            : 'border-primary-foreground/20 text-primary-foreground/50 hover:border-amber-500/30'
                                        }`}
                                      >
                                        {a.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <button onClick={() => removeRqCategory(cat.id)} className="text-destructive text-xs hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remover</button>
                              </>
                            ) : (
                              <>
                                <p className="text-primary-foreground/70 text-sm leading-relaxed">{cat.description}</p>
                                <div className="flex items-center gap-2 pt-2 border-t border-primary-foreground/10">
                                  <span className="text-xs text-primary-foreground/40">📋 Caminho:</span>
                                  <span className="text-xs text-amber-400 font-medium">{cat.callPath}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* RQ Reports */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-primary-foreground/80">Relatórios de RQ</h4>
                </div>
                {isAdmin && (
                  <button onClick={() => addRqReport({ id: Date.now().toString(), name: 'Novo Relatório', description: 'Descrição do relatório.', imageUrl: '' })} className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(content.rqReports || []).map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="flex gap-4 p-4 rounded-xl bg-white/5 border-2 border-transparent hover:border-amber-500/30 transition-all duration-300"
                  >
                    <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted/10 shrink-0 flex items-center justify-center">
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt={report.name} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-8 h-8 text-amber-500/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isAdmin ? (
                        <>
                          <input className="font-display font-bold text-primary-foreground text-sm bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent mb-1" value={report.name} onChange={(e) => updateRqReport(report.id, { name: e.target.value })} />
                          <textarea className="text-primary-foreground/60 text-xs leading-relaxed bg-transparent border border-primary-foreground/10 rounded p-1 w-full min-h-[40px] outline-none focus:border-accent" value={report.description} onChange={(e) => updateRqReport(report.id, { description: e.target.value })} />
                          <input className="w-full p-1 rounded border border-primary-foreground/10 bg-transparent text-primary-foreground text-xs outline-none focus:border-accent mt-1" value={report.imageUrl} onChange={(e) => updateRqReport(report.id, { imageUrl: e.target.value })} placeholder="URL da imagem" />
                          <button onClick={() => removeRqReport(report.id)} className="text-destructive text-xs hover:underline flex items-center gap-1 mt-1"><Trash2 className="w-3 h-3" /> Remover</button>
                        </>
                      ) : (
                        <>
                          <h5 className="font-display font-bold text-primary-foreground text-sm mb-1">{report.name}</h5>
                          <p className="text-primary-foreground/60 text-xs leading-relaxed">{report.description}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default NossaAreaPage;
