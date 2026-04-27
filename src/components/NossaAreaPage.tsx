import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ImageIcon, MapPin, Crown, Palette, Briefcase, BarChart3, Globe, ChevronLeft, ChevronRight, Trash2, Rocket, FileText, DollarSign, User, ChevronDown, Mail, Phone, MessageCircle, Plane } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import GalaxyParticles from '@/components/GalaxyParticles';
import BrazilMap from '@/components/BrazilMap';
import AreasRoadmap from '@/components/AreasRoadmap';
import OrgChart from '@/components/OrgChart';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst, addProject, updateProject, removeProject, addAreaReportCard, updateAreaReportCard, removeAreaReportCard, addRqCategory, updateRqCategory, removeRqCategory, addRqReport, updateRqReport, removeRqReport } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
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

      {/* Nossas Áreas de Atuação */}
      <AreasRoadmap />

      {/* Organograma Interativo */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative overflow-hidden rounded-2xl border-2 border-accent/15" style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 8% / 0.85), hsl(215, 35%, 6% / 0.9))' }}>
        <GalaxyParticles />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-accent/4 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-primary/3 blur-[100px]" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            {isAdmin ? <input className="text-3xl md:text-4xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent" value={content.orgChartTitle} onChange={(e) => updateContent({ orgChartTitle: e.target.value })} /> : <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">{content.orgChartTitle}</h3>}
          </div>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl">Estrutura organizacional da equipe de People Analytics — Diretoria de Pessoas</p>
          <OrgChart
            manager={managerAnalysts[0]}
            biAnalysts={biAnalysts}
            adminAnalysts={adminAnalysts}
            designAnalysts={designAnalysts}
            onAnalystClick={(id) => setSelectedAnalyst(selectedAnalyst === id ? null : id)}
          />
        </div>
      </motion.section>

      {/* Analyst detail modals - triggered from OrgChart */}
      {content.analysts.map((analyst, i) => (
        <div key={analyst.id} style={{ display: 'contents' }}>
          {selectedAnalyst === analyst.id && (
            <AnalystCard
              analyst={analyst}
              index={i}
              isSelected={true}
              onClick={() => setSelectedAnalyst(null)}
              showDetails
              editable
              size="normal"
            />
          )}
        </div>
      ))}

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

      {/* Areas Roadmap moved above */}

      {/* Admin: Add analysts */}
      {isAdmin && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-wrap gap-3">
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Gerente', role: 'Gerente', area: 'People Analytics', photo: '', bio: 'Descrição.', type: 'manager' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Gerente</button>
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Analista BI', role: 'Analista de BI', area: 'Nova Área', photo: '', bio: 'Descrição.', type: 'bi' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Analista BI</button>
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Admin', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Descrição.', type: 'admin' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Analista Admin</button>
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Designer', role: 'Designer', area: 'Design', photo: '', bio: 'Descrição.', type: 'design' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Designer</button>
        </motion.section>
      )}

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
        <div className="relative overflow-hidden rounded-2xl border border-accent/20" style={{ background: 'linear-gradient(160deg, hsl(220, 45%, 8%), hsl(220, 35%, 13%))' }}>
          <GalaxyParticles />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-accent/10 blur-[150px]" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-[150px]" />
          </div>
          <div className="relative z-10 p-8 md:p-12">
            {/* Header with gradient line */}
            <div className="flex items-start gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-accent/20 shrink-0">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isAdmin ? (
                  <input className="text-3xl md:text-4xl font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={content.rqTitle} onChange={(e) => updateContent({ rqTitle: e.target.value })} />
                ) : (
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{content.rqTitle}</h3>
                )}
                <div className="w-20 h-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 mt-3" />
              </div>
            </div>

            {/* Description + Analysts in modern layout */}
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 mb-12">
              <div className="rounded-2xl p-6 border border-primary-foreground/8" style={{ background: 'hsl(220, 35%, 11%)' }}>
                {isAdmin ? (
                  <textarea className="text-primary-foreground/80 leading-relaxed text-base bg-transparent border border-primary-foreground/10 rounded-lg p-4 w-full min-h-[150px] outline-none focus:border-accent" value={content.rqDescription} onChange={(e) => updateContent({ rqDescription: e.target.value })} />
                ) : (
                  <p className="text-primary-foreground/75 leading-relaxed text-base">{content.rqDescription}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
                  <h4 className="text-sm font-display font-bold text-primary-foreground/70 uppercase tracking-wider">Analistas Responsáveis</h4>
                </div>
                {adminAnalysts.map((analyst, i) => (
                  <motion.div
                    key={analyst.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-primary-foreground/8 hover:border-accent/40 transition-all duration-300 group"
                    style={{ background: 'hsl(220, 35%, 11%)' }}
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all">
                      {analyst.photo ? (
                        <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-display font-semibold text-primary-foreground text-sm">{analyst.name}</p>
                      <p className="text-primary-foreground/40 text-xs">{analyst.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RQ Categories - Modern card grid */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
                  <h4 className="text-sm font-display font-bold text-primary-foreground/70 uppercase tracking-wider">Categorias de Requisição</h4>
                </div>
                {isAdmin && (
                  <button onClick={() => addRqCategory({ id: Date.now().toString(), label: 'Nova Categoria', description: 'Descrição da categoria.', callPath: 'ServiceNow > Caminho', responsibleAnalystIds: [] })} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(content.rqCategories || []).map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.08 }}
                  >
                    <button
                      onClick={() => setExpandedRqCategory(expandedRqCategory === cat.id ? null : cat.id)}
                      className="w-full text-left"
                    >
                      <div
                        className={`rounded-xl p-5 border transition-all duration-300 ${
                          expandedRqCategory === cat.id
                            ? 'border-accent/50 shadow-lg shadow-accent/15'
                            : 'border-primary-foreground/8 hover:border-accent/30'
                        }`}
                        style={{ background: expandedRqCategory === cat.id ? 'hsl(220, 35%, 13%)' : 'hsl(220, 35%, 11%)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${expandedRqCategory === cat.id ? 'bg-accent' : 'bg-primary-foreground/20'}`} />
                            <span className={`font-display font-semibold text-sm transition-colors duration-300 ${expandedRqCategory === cat.id ? 'text-accent' : 'text-primary-foreground/80'}`}>{cat.label}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-primary-foreground/40 transition-transform duration-300 ${expandedRqCategory === cat.id ? 'rotate-180 text-accent' : ''}`} />
                        </div>
                      </div>
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
                          <div className="mt-2 p-5 rounded-xl border border-primary-foreground/8 space-y-3" style={{ background: 'hsl(220, 35%, 11%)' }}>
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
                                <button onClick={() => removeRqCategory(cat.id)} className="text-destructive text-xs hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remover</button>
                              </>
                            ) : (
                              <>
                                <p className="text-primary-foreground/65 text-sm leading-relaxed">{cat.description}</p>
                                <div className="flex items-center gap-2 pt-3 border-t border-primary-foreground/8">
                                  <span className="text-xs text-primary-foreground/35">📋 Caminho:</span>
                                  <span className="text-xs text-accent font-medium">{cat.callPath}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Travel Contact - Modern card */}
            <div className="mb-12 rounded-2xl overflow-hidden border border-primary-foreground/8" style={{ background: 'linear-gradient(135deg, hsl(220, 35%, 11%), hsl(220, 30%, 14%))' }}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  {isAdmin ? (
                    <input className="text-lg font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 flex-1 outline-none focus:border-accent" value={content.rqTravelTitle || 'Solicitações de Viagens'} onChange={(e) => updateContent({ rqTravelTitle: e.target.value })} />
                  ) : (
                    <h4 className="text-lg font-display font-bold text-primary-foreground">{content.rqTravelTitle || 'Solicitações de Viagens'}</h4>
                  )}
                </div>
                {isAdmin ? (
                  <textarea className="text-primary-foreground/60 text-sm leading-relaxed bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[50px] outline-none focus:border-accent mb-4" value={content.rqTravelDescription || ''} onChange={(e) => updateContent({ rqTravelDescription: e.target.value })} />
                ) : (
                  <p className="text-primary-foreground/60 text-sm leading-relaxed mb-5">{content.rqTravelDescription || ''}</p>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-sky-400" />
                  </div>
                  {isAdmin ? (
                    <input className="text-base font-display font-semibold text-sky-400 bg-transparent border-b border-primary-foreground/20 outline-none focus:border-accent" value={content.rqTravelContactName || ''} onChange={(e) => updateContent({ rqTravelContactName: e.target.value })} placeholder="Nome do contato" />
                  ) : (
                    <span className="text-base font-display font-semibold text-sky-400">{content.rqTravelContactName || ''}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-primary-foreground/8 hover:border-sky-500/30 transition-all" style={{ background: 'hsl(220, 35%, 10%)' }}>
                    <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-primary-foreground/35 text-[10px] uppercase tracking-wider">E-mail</p>
                      {isAdmin ? (
                        <input className="text-primary-foreground text-sm bg-transparent border-b border-primary-foreground/10 w-full outline-none focus:border-accent" value={content.rqTravelContactEmail || ''} onChange={(e) => updateContent({ rqTravelContactEmail: e.target.value })} />
                      ) : (
                        <a href={`mailto:${content.rqTravelContactEmail}`} className="text-primary-foreground text-sm hover:text-sky-400 transition-colors truncate block">{content.rqTravelContactEmail || ''}</a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-primary-foreground/8 hover:border-sky-500/30 transition-all" style={{ background: 'hsl(220, 35%, 10%)' }}>
                    <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-primary-foreground/35 text-[10px] uppercase tracking-wider">Teams</p>
                      {isAdmin ? (
                        <input className="text-primary-foreground text-sm bg-transparent border-b border-primary-foreground/10 w-full outline-none focus:border-accent" value={content.rqTravelContactTeams || ''} onChange={(e) => updateContent({ rqTravelContactTeams: e.target.value })} />
                      ) : (
                        <span className="text-primary-foreground text-sm truncate block">{content.rqTravelContactTeams || ''}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-primary-foreground/8 hover:border-green-500/30 transition-all" style={{ background: 'hsl(220, 35%, 10%)' }}>
                    <svg className="w-4 h-4 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <div className="min-w-0">
                      <p className="text-primary-foreground/35 text-[10px] uppercase tracking-wider">WhatsApp</p>
                      {isAdmin ? (
                        <input className="text-primary-foreground text-sm bg-transparent border-b border-primary-foreground/10 w-full outline-none focus:border-accent" value={content.rqTravelContactWhatsapp || ''} onChange={(e) => updateContent({ rqTravelContactWhatsapp: e.target.value })} />
                      ) : (
                        <a href={`https://wa.me/${(content.rqTravelContactWhatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-foreground text-sm hover:text-green-400 transition-colors truncate block">{content.rqTravelContactWhatsapp || ''}</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RQ Reports */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
                  <h4 className="text-sm font-display font-bold text-primary-foreground/70 uppercase tracking-wider">Relatórios de RQ</h4>
                </div>
                {isAdmin && (
                  <button onClick={() => addRqReport({ id: Date.now().toString(), name: 'Novo Relatório', description: 'Descrição do relatório.', imageUrl: '' })} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(content.rqReports || []).map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="group rounded-xl overflow-hidden border border-primary-foreground/8 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/15"
                    style={{ background: 'hsl(220, 35%, 11%)' }}
                  >
                    <div className="w-full h-48 overflow-hidden relative">
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt={report.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
                          <FileText className="w-12 h-12 text-accent/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {isAdmin ? (
                        <>
                          <input className="font-display font-bold text-primary-foreground text-base bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent mb-2" value={report.name} onChange={(e) => updateRqReport(report.id, { name: e.target.value })} />
                          <textarea className="text-primary-foreground/60 text-sm leading-relaxed bg-transparent border border-primary-foreground/10 rounded p-2 w-full min-h-[60px] outline-none focus:border-accent" value={report.description} onChange={(e) => updateRqReport(report.id, { description: e.target.value })} />
                          <input className="w-full p-2 rounded border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent mt-2" value={report.imageUrl} onChange={(e) => updateRqReport(report.id, { imageUrl: e.target.value })} placeholder="URL da imagem" />
                          <button onClick={() => removeRqReport(report.id)} className="text-destructive text-xs hover:underline flex items-center gap-1 mt-2"><Trash2 className="w-3 h-3" /> Remover</button>
                        </>
                      ) : (
                        <>
                          <h5 className="font-display font-bold text-primary-foreground text-base mb-2">{report.name}</h5>
                          <p className="text-primary-foreground/55 text-sm leading-relaxed">{report.description}</p>
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
