import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ImageIcon, MapPin, Crown, Palette, Briefcase, BarChart3, Globe, ChevronLeft, ChevronRight, Trash2, Rocket, FileText, DollarSign, User, ChevronDown, Mail, Phone, MessageCircle, Plane, Database, Workflow, LineChart, Layers, Sparkles, Cpu, ExternalLink, LifeBuoy, AlertCircle, FileEdit, FilePlus, FileCheck, FileX, Flame, UserCheck, Code2, Zap, Bot, GitBranch, GraduationCap } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import GalaxyParticles from '@/components/GalaxyParticles';
import BrazilMap from '@/components/BrazilMap';
import AreasRoadmap from '@/components/AreasRoadmap';
import OrgChart from '@/components/OrgChart';
import ReportDetailModal from '@/components/ReportDetailModal';
import adminTeamImg from '@/assets/admin-team.jpg';
import dataPipelineImg from '@/assets/data-pipeline.jpg';
import journeyColetaImg from '@/assets/journey-coleta.jpg';
import journeyModelagemImg from '@/assets/journey-modelagem.jpg';
import journeyAnaliseImg from '@/assets/journey-analise.jpg';
import journeyDecisaoImg from '@/assets/journey-decisao.jpg';
import stackPowerBiImg from '@/assets/stack-powerbi.jpg';
import stackSqlImg from '@/assets/stack-sql.jpg';
import stackExcelImg from '@/assets/stack-excel.jpg';
import stackOrbiImg from '@/assets/stack-orbi.jpg';
import pythonHeroImg from '@/assets/python-automation-hero.jpg';
import pythonAutoTreinamentoImg from '@/assets/python-auto-treinamento.jpg';
import pythonAutoResImg from '@/assets/python-auto-res.jpg';
import pythonAutoRelatoriosImg from '@/assets/python-auto-relatorios.jpg';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst, addProject, updateProject, removeProject, addAreaReportCard, updateAreaReportCard, removeAreaReportCard } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const projectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const managerAnalysts = content.analysts.filter((a) => a.type === 'manager');
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const adminAnalysts = content.analysts.filter((a) => a.type === 'admin');
  const designAnalysts = content.analysts.filter((a) => a.type === 'design');
  const assistantAnalysts = content.analysts.filter((a) => a.type === 'assistant');
  const internAnalysts = content.analysts.filter((a) => a.type === 'intern');
  const orgImage = content.orgChartUrl || '';
  const projects = content.projects || [];
  const areaReportCards = content.areaReportCards || [];
  const eligibleAreasOptions = content.eligibleAreasOptions || [];
  // Auto-derive count from reports per area (so cards "conversam" com áreas elegíveis)
  const computedAreaCounts = areaReportCards.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = content.reports.filter(r => (r.eligibleAreas || []).includes(c.area)).length;
    return acc;
  }, {});

  useEffect(() => {
    if (projects.length <= 1 || isAdmin) return;
    const t = setTimeout(() => {
      setCurrentProjectIdx(prev => (prev + 1) % projects.length);
    }, 5000);
    projectTimerRef.current = t as unknown as ReturnType<typeof setInterval>;
    return () => clearTimeout(t);
  }, [projects.length, isAdmin, currentProjectIdx]);

  const goToProject = (dir: 'prev' | 'next') => {
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
        <img src={adminTeamImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen pointer-events-none" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/2 w-80 h-80 rounded-full bg-teal blur-[100px]" /></div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? <input className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={content.areaTitle} onChange={(e) => updateContent({ areaTitle: e.target.value })} /> : <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">{content.areaTitle}</h2>}
          <p className="text-accent text-lg font-medium mb-2">AeC - People Analytics</p>
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
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl">Estrutura organizacional da equipe de People Analytics</p>
          <OrgChart
            manager={managerAnalysts[0]}
            biAnalysts={biAnalysts}
            adminAnalysts={adminAnalysts}
            designAnalysts={designAnalysts}
            assistantAnalysts={assistantAnalysts}
            internAnalysts={internAnalysts}
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
                    className="glass-card rounded-xl p-4 border border-accent/10 relative overflow-hidden group hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="relative flex items-center gap-3">
                      {isAdmin ? (
                        <input className="text-2xl w-10 bg-transparent border-b border-border text-center outline-none focus:border-accent" value={card.icon} onChange={(e) => updateAreaReportCard(card.id, { icon: e.target.value })} />
                      ) : (
                        <span className="text-2xl shrink-0">{card.icon}</span>
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
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Assistente', role: 'Assistente de Pessoas', area: 'People Analytics', photo: '', bio: 'Descrição.', type: 'assistant' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Assistente</button>
          <button onClick={() => addAnalyst({ id: Date.now().toString(), name: 'Novo Estagiário', role: 'Estagiário', area: 'People Analytics', photo: '', bio: 'Descrição.', type: 'intern' })} className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"><Plus className="w-4 h-4" /> Estagiário</button>
        </motion.section>
      )}

      {/* === PIPELINE DE DADOS - Jornada do Dado === */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20" style={{ background: 'linear-gradient(160deg, hsl(220, 45%, 8%), hsl(220, 35%, 13%))' }}>
          <GalaxyParticles />
          <img src={dataPipelineImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen pointer-events-none" loading="lazy" width={1280} height={768} />
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/70 to-transparent pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-accent/15 blur-[150px]" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-[150px]" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-accent/30 shrink-0">
                <Workflow className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">A Jornada do Dado</h3>
                <div className="w-20 h-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 mt-2" />
              </div>
            </div>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-3xl mb-10">
              Da captura à decisão estratégica — conheça o pipeline que transforma dados brutos em insights que movem a Diretoria de Pessoas.
            </p>

            {/* Pipeline steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 relative">
              <div className="hidden lg:block absolute top-[88px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

              {[
                { icon: Database, color: 'from-blue-500 to-cyan-500', title: '1. Coleta', desc: 'Conectamos múltiplas fontes — Orbi, sistemas internos, planilhas e bases externas.', image: journeyColetaImg },
                { icon: Layers, color: 'from-cyan-500 to-teal-500', title: '2. Modelagem', desc: 'Estruturamos os dados, validamos a integridade e desenhamos métricas confiáveis.', image: journeyModelagemImg },
                { icon: Cpu, color: 'from-teal-500 to-emerald-500', title: '3. Análise', desc: 'Aplicamos lógica analítica e narrativa para extrair padrões e oportunidades.', image: journeyAnaliseImg },
                { icon: LineChart, color: 'from-emerald-500 to-amber-500', title: '4. Decisão', desc: 'Entregamos dashboards e relatórios que orientam a estratégia da Diretoria.', image: journeyDecisaoImg },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                  className="group relative rounded-2xl border border-primary-foreground/10 overflow-hidden hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20"
                  style={{ background: 'linear-gradient(160deg, hsl(220, 40%, 11%), hsl(220, 35%, 9%))' }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    <div className={`absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl ring-2 ring-white/10 z-10`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-display font-bold text-primary-foreground text-lg mb-2">{step.title}</h4>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ferramentas & Stack */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-cyan-400" />
                <h4 className="text-xl md:text-2xl font-display font-bold text-primary-foreground">Ferramentas & Stack</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Power BI', desc: 'Visualização e modelagem de dashboards corporativos.', image: stackPowerBiImg, color: 'from-amber-500 to-yellow-500' },
                  { title: 'SQL & Bases', desc: 'Consultas, integrações e modelagem dimensional.', image: stackSqlImg, color: 'from-blue-500 to-indigo-500' },
                  { title: 'Excel Avançado', desc: 'Análises rápidas, prototipação e validação cruzada.', image: stackExcelImg, color: 'from-emerald-500 to-green-500' },
                  { title: 'Orbi & Sistemas', desc: 'Integração com as fontes oficiais da Diretoria.', image: stackOrbiImg, color: 'from-violet-500 to-purple-500' },
                ].map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="group rounded-2xl border border-primary-foreground/10 overflow-hidden hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20"
                    style={{ background: 'linear-gradient(160deg, hsl(220, 40%, 11%), hsl(220, 35%, 9%))' }}
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img src={t.image} alt={t.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                      <div className={`absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent`} />
                      <div className={`absolute bottom-2 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r ${t.color} text-white text-xs font-semibold shadow-lg`}>{t.title}</div>
                    </div>
                    <div className="p-4">
                      <p className="text-primary-foreground/70 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats / signature numbers (editable) */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-cyan-400" />
                <h4 className="text-xl md:text-2xl font-display font-bold text-primary-foreground">Nossos números</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(content.dataJourneyStats || []).map((s, i) => {
                  const IconMap: Record<string, any> = { FileText, Database, Sparkles, LineChart, Layers, Cpu };
                  const Ico = IconMap[s.icon] || FileText;
                  const styles = [
                    { image: journeyColetaImg, color: 'from-amber-500 to-orange-500', glow: 'hsl(35, 90%, 55%)', text: 'from-amber-300 to-orange-300' },
                    { image: journeyModelagemImg, color: 'from-violet-500 to-purple-500', glow: 'hsl(270, 70%, 60%)', text: 'from-violet-300 to-purple-300' },
                    { image: journeyAnaliseImg, color: 'from-teal-500 to-cyan-500', glow: 'hsl(180, 70%, 50%)', text: 'from-teal-300 to-cyan-300' },
                    { image: journeyDecisaoImg, color: 'from-emerald-500 to-green-500', glow: 'hsl(150, 70%, 45%)', text: 'from-emerald-300 to-green-300' },
                  ];
                  const st = styles[i % styles.length];
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08, type: 'spring' }}
                      className="relative rounded-xl border border-primary-foreground/10 hover:border-accent/50 transition-all duration-500 group overflow-hidden hover:-translate-y-1"
                      style={{ background: 'linear-gradient(160deg, hsl(220, 40%, 11%), hsl(220, 35%, 8%))', boxShadow: `0 8px 24px ${st.glow}15` }}
                    >
                      <img src={st.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/40 pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 20%, ${st.glow}22, transparent 65%)` }} />
                      <div className="relative p-5">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${st.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
                          <Ico className="w-5 h-5 text-white" />
                        </div>
                        {isAdmin ? (
                          <>
                            <input
                              value={s.value}
                              onChange={(e) => updateContent({ dataJourneyStats: content.dataJourneyStats.map(x => x.id === s.id ? { ...x, value: e.target.value } : x) })}
                              className="w-full text-3xl font-display font-bold bg-transparent border-b border-accent/30 text-primary-foreground outline-none focus:border-accent"
                            />
                            <input
                              value={s.label}
                              onChange={(e) => updateContent({ dataJourneyStats: content.dataJourneyStats.map(x => x.id === s.id ? { ...x, label: e.target.value } : x) })}
                              className="w-full text-xs text-primary-foreground/70 uppercase tracking-wider mt-2 bg-transparent border-b border-border/30 outline-none focus:border-accent"
                            />
                          </>
                        ) : (
                          <>
                            <div className={`text-3xl font-display font-bold bg-gradient-to-r ${st.text} bg-clip-text text-transparent`}>{s.value}</div>
                            <div className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">{s.label}</div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Princípios */}
            <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Governança', desc: 'Padrões claros, métricas auditáveis e dados confiáveis em toda a cadeia.', icon: Sparkles, color: 'from-teal-500 to-cyan-500', image: journeyModelagemImg, glow: 'hsl(180, 70%, 50%)' },
                { title: 'Velocidade', desc: 'Entregas ágeis sem abrir mão da qualidade analítica.', icon: Cpu, color: 'from-cyan-500 to-blue-500', image: dataPipelineImg, glow: 'hsl(210, 90%, 55%)' },
                { title: 'Impacto', desc: 'Cada relatório nasce para gerar decisão e resultado mensurável.', icon: LineChart, color: 'from-emerald-500 to-teal-500', image: journeyDecisaoImg, glow: 'hsl(150, 70%, 45%)' },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className="relative rounded-2xl border border-primary-foreground/10 hover:border-accent/50 transition-all duration-500 group overflow-hidden hover:-translate-y-1"
                  style={{ background: 'linear-gradient(160deg, hsl(220, 40%, 11%), hsl(220, 35%, 8%))', boxShadow: `0 8px 24px ${p.glow}15` }}
                >
                  <img src={p.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/40 pointer-events-none" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 20%, ${p.glow}25, transparent 65%)` }} />
                  <div className="relative p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="font-display font-bold text-primary-foreground text-lg mb-1">{p.title}</h5>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quote / closing */}
            <div className="relative rounded-2xl p-6 md:p-8 border border-accent/25 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(174, 50%, 12% / 0.8), hsl(220, 40%, 10% / 0.8))' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="text-6xl font-display text-accent/40 leading-none">"</div>
                <div>
                  <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed italic">
                    Não entregamos apenas números — entregamos clareza, contexto e direção para que cada decisão da Diretoria de Pessoas seja construída com confiança.
                  </p>
                  <p className="text-accent text-sm font-semibold mt-3">— Equipe People Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Nossos principais projetos — Showcase holográfico */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative">
        <SectionHeader
          icon={Rocket}
          title="Nossos principais projetos"
          onAdd={isAdmin ? () => addProject({ id: Date.now().toString(), title: 'Novo Projeto', description: 'Descrição do projeto.', imageUrl: '' }) : undefined}
          addLabel="Adicionar Projeto"
        />

        {projects.length > 0 && (() => {
          const current = projects[currentProjectIdx];
          const nextIdx = (currentProjectIdx + 1) % projects.length;
          const next = projects[nextIdx];
          return (
            <div className="relative">
              {/* Ambient glows */}
              <div className="absolute -top-10 -left-10 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-[28rem] h-[28rem] rounded-full bg-cyan/10 blur-[120px] pointer-events-none" />

              <div className="relative grid lg:grid-cols-12 gap-8 items-stretch">
                {/* === Visual stack === */}
                <div className="lg:col-span-7 relative group min-h-[480px] lg:min-h-[640px]">
                  {/* Decorative offset frames */}
                  <div className="absolute inset-0 bg-accent/5 rounded-3xl border border-primary-foreground/5 translate-x-4 translate-y-4" />
                  <div className="absolute inset-0 bg-cyan/5 rounded-3xl border border-primary-foreground/5 -translate-x-4 -translate-y-4" />

                  <div className="relative h-full w-full rounded-3xl border border-primary-foreground/10 overflow-hidden shadow-2xl bg-navy group-hover:border-accent/30 transition-colors duration-500">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        {current.imageUrl ? (
                          <img src={current.imageUrl} alt={current.title} className="w-full h-full object-cover transform transition-transform duration-[1200ms] group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                            <Rocket className="w-24 h-24 text-accent/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                      </motion.div>
                    </AnimatePresence>

                    {/* Floating badge */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 bg-navy/60 backdrop-blur-md px-4 py-2 rounded-full border border-accent/25 z-10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                      </span>
                      <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-widest">Destaque Analytics</span>
                    </div>

                    {/* Nav controls inside image */}
                    {projects.length > 1 && (
                      <div className="absolute bottom-6 left-6 flex gap-3 z-10">
                        <button onClick={() => goToProject('prev')} className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-foreground/5 hover:bg-primary-foreground/10 border border-primary-foreground/10 text-primary-foreground transition-all backdrop-blur-md hover:scale-110">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => goToProject('next')} className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20 hover:bg-accent/40 border border-accent/40 text-accent transition-all backdrop-blur-md hover:scale-110">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* === Content side === */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:pl-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="space-y-5"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/20">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                          PROJETO {String(currentProjectIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                        </span>
                      </div>

                      {isAdmin ? (
                        <input
                          className="text-3xl lg:text-5xl font-black text-primary-foreground leading-tight tracking-tight bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent"
                          value={current.title || ''}
                          onChange={(e) => updateProject(current.id, { title: e.target.value })}
                        />
                      ) : (
                        <h1 className="text-3xl lg:text-5xl font-black text-primary-foreground leading-tight tracking-tight">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan">
                            {current.title}
                          </span>
                        </h1>
                      )}

                      {isAdmin ? (
                        <textarea
                          className="text-base text-primary-foreground/70 leading-relaxed bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent"
                          value={current.description || ''}
                          onChange={(e) => updateProject(current.id, { description: e.target.value })}
                        />
                      ) : (
                        <p className="text-lg text-primary-foreground/70 leading-relaxed max-w-md font-light">
                          {current.description}
                        </p>
                      )}

                      {isAdmin && (
                        <div className="space-y-2 pt-2">
                          <label className="text-xs text-primary-foreground/50">URL da imagem</label>
                          <input
                            className="w-full p-2 rounded-lg border border-primary-foreground/10 bg-transparent text-primary-foreground text-sm outline-none focus:border-accent"
                            value={current.imageUrl || ''}
                            onChange={(e) => updateProject(current.id, { imageUrl: e.target.value })}
                            placeholder="Cole a URL da imagem"
                          />
                          <button onClick={() => removeProject(current.id)} className="text-destructive text-xs hover:underline flex items-center gap-1 mt-2">
                            <Trash2 className="w-3 h-3" /> Remover projeto
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress + next */}
                  {projects.length > 1 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-primary-foreground/50 truncate pr-3">Próximo: {next.title}</span>
                        <span className="text-accent shrink-0">Auto · 5s</span>
                      </div>
                      <div className="h-1 w-full bg-primary-foreground/5 rounded-full overflow-hidden">
                        <motion.div
                          key={current.id}
                          initial={{ width: '0%' }}
                          animate={{ width: isAdmin ? '0%' : '100%' }}
                          transition={{ duration: isAdmin ? 0 : 5, ease: 'linear' }}
                          className="h-full bg-gradient-to-r from-accent to-cyan relative shadow-[0_0_10px_hsl(var(--accent)/0.5)]"
                        >
                          <div className="absolute top-0 right-0 h-full w-4 bg-primary-foreground/30 blur-sm" />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnails — esteira que acompanha o projeto atual */}
                  {projects.length > 1 && (() => {
                    const VISIBLE = 4;
                    const maxStart = Math.max(0, projects.length - VISIBLE);
                    // mantém o ativo por perto do centro da janela visível
                    const desired = currentProjectIdx - Math.floor((VISIBLE - 1) / 2);
                    const start = Math.min(maxStart, Math.max(0, desired));
                    const itemPct = 100 / VISIBLE;
                    return (
                      <div className="relative overflow-hidden">
                        <motion.div
                          className="flex gap-3"
                          animate={{ x: `-${start * itemPct}%` }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          style={{ width: `${(projects.length / VISIBLE) * 100}%` }}
                        >
                          {projects.map((p, i) => {
                            const active = i === currentProjectIdx;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setCurrentProjectIdx(i)}
                                style={{ width: `calc(${100 / projects.length}% - ${(12 * (projects.length - 1)) / projects.length}px)` }}
                                className={`group relative shrink-0 pt-[60%] rounded-xl overflow-hidden transition-all duration-300 ${active ? 'border-2 border-accent shadow-[0_0_15px_hsl(var(--accent)/0.35)]' : 'border border-primary-foreground/10 hover:border-primary-foreground/30 opacity-60 hover:opacity-100'}`}
                              >
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-navy-light/40">
                                    <Rocket className="w-4 h-4 text-accent/40" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                        {/* Fades laterais */}
                        {start > 0 && <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-navy to-transparent" />}
                        {start < maxStart && <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-navy to-transparent" />}
                      </div>
                    );
                  })()}

                  {/* Dots when many */}
                  {projects.length > 4 && (
                    <div className="flex gap-2 flex-wrap">
                      {projects.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentProjectIdx(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === currentProjectIdx ? 'w-8 bg-accent' : 'w-3 bg-primary-foreground/20 hover:bg-primary-foreground/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </motion.section>

      {/* === AUTOMAÇÕES EM PYTHON === */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/25" style={{ background: 'linear-gradient(160deg, hsl(220, 50%, 7%), hsl(220, 40%, 11%))' }}>
          <img src={pythonHeroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none" loading="lazy" width={1280} height={720} />
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-navy/40 pointer-events-none" />
          <GalaxyParticles />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-yellow-500/10 blur-[150px]" />
            <div className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-[150px]" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-blue-500 flex items-center justify-center shadow-xl shadow-yellow-500/30 shrink-0">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isAdmin ? (
                    <input value={content.pythonTag} onChange={(e) => updateContent({ pythonTag: e.target.value })} className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 bg-transparent outline-none" />
                  ) : (
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">{content.pythonTag}</span>
                  )}
                </div>
                {isAdmin ? (
                  <input value={content.pythonTitle} onChange={(e) => updateContent({ pythonTitle: e.target.value })} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 outline-none focus:border-yellow-400 w-full" />
                ) : (
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{content.pythonTitle}</h3>
                )}
                <div className="w-24 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 mt-2" />
              </div>
            </div>
            {isAdmin ? (
              <textarea value={content.pythonDescription} onChange={(e) => updateContent({ pythonDescription: e.target.value })} className="text-primary-foreground/75 text-lg leading-relaxed max-w-3xl mb-10 bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-yellow-400" />
            ) : (
              <p className="text-primary-foreground/75 text-lg leading-relaxed max-w-3xl mb-10">{content.pythonDescription}</p>
            )}

            {/* Highlight cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {content.pythonCards.map((c, i) => {
                const images = [pythonAutoResImg, pythonAutoTreinamentoImg, pythonAutoRelatoriosImg];
                const icons = [Bot, GraduationCap, Zap];
                const colors = ['from-amber-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-teal-500 to-emerald-500'];
                const Icon = icons[i % icons.length];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="group rounded-2xl border border-primary-foreground/10 overflow-hidden hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/15 relative"
                    style={{ background: 'linear-gradient(160deg, hsl(220, 42%, 10%), hsl(220, 38%, 8%))' }}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={images[i % images.length]} alt={c.title} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" loading="lazy" width={800} height={600} />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
                      <div className={`absolute top-3 left-3 w-11 h-11 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shadow-xl ring-2 ring-white/10`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {isAdmin ? (
                        <input value={c.tag} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(x => x.id === c.id ? { ...x, tag: e.target.value } : x) })} className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-primary-foreground/90 backdrop-blur-sm border border-white/10 w-20 outline-none" />
                      ) : (
                        <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-primary-foreground/90 backdrop-blur-sm border border-white/10">{c.tag}</span>
                      )}
                    </div>
                    <div className="p-5">
                      {isAdmin ? (
                        <>
                          <input value={c.title} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(x => x.id === c.id ? { ...x, title: e.target.value } : x) })} className="font-display font-bold text-primary-foreground text-lg leading-tight bg-transparent border-b border-primary-foreground/15 w-full outline-none focus:border-yellow-400" />
                          <input value={c.subtitle} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(x => x.id === c.id ? { ...x, subtitle: e.target.value } : x) })} className="text-yellow-300/80 text-xs font-medium uppercase tracking-wider mt-1 bg-transparent border-b border-primary-foreground/10 w-full outline-none focus:border-yellow-400" />
                          <textarea value={c.desc} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(x => x.id === c.id ? { ...x, desc: e.target.value } : x) })} className="text-primary-foreground/65 text-sm leading-relaxed mt-3 bg-transparent border border-primary-foreground/10 rounded-lg p-2 w-full min-h-[80px] outline-none focus:border-yellow-400" />
                          <button onClick={() => updateContent({ pythonCards: content.pythonCards.filter(x => x.id !== c.id) })} className="mt-2 text-xs text-destructive/70 hover:text-destructive flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remover</button>
                        </>
                      ) : (
                        <>
                          <h4 className="font-display font-bold text-primary-foreground text-lg leading-tight">{c.title}</h4>
                          <p className="text-yellow-300/80 text-xs font-medium uppercase tracking-wider mt-0.5">{c.subtitle}</p>
                          <p className="text-primary-foreground/65 text-sm leading-relaxed mt-3">{c.desc}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {isAdmin && content.pythonCards.length < 3 && (
                <button onClick={() => updateContent({ pythonCards: [...content.pythonCards, { id: Date.now().toString(), title: 'Novo', subtitle: 'Subtítulo', desc: 'Descrição.', tag: 'Tag' }] })} className="rounded-2xl border-2 border-dashed border-yellow-500/30 text-yellow-300/80 hover:bg-yellow-500/5 transition flex items-center justify-center gap-2 p-8 text-sm font-medium"><Plus className="w-4 h-4" /> Adicionar card</button>
              )}
            </div>

            {/* Code snippet stylized */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
              <div className="rounded-2xl border border-yellow-500/25 overflow-hidden shadow-2xl" style={{ background: 'hsl(220, 50%, 5%)' }}>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-yellow-500/15 bg-black/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  {isAdmin ? (
                    <input value={content.pythonCodeFilename} onChange={(e) => updateContent({ pythonCodeFilename: e.target.value })} className="text-[11px] font-mono text-primary-foreground/50 ml-2 bg-transparent border-b border-primary-foreground/10 outline-none" />
                  ) : (
                    <span className="text-[11px] font-mono text-primary-foreground/50 ml-2">{content.pythonCodeFilename}</span>
                  )}
                  <GitBranch className="w-3.5 h-3.5 text-primary-foreground/30 ml-auto" />
                  <span className="text-[10px] font-mono text-primary-foreground/40">main</span>
                </div>
                {isAdmin ? (
                  <textarea value={content.pythonCode} onChange={(e) => updateContent({ pythonCode: e.target.value })} className="p-5 text-[12.5px] leading-relaxed font-mono text-primary-foreground/85 w-full min-h-[280px] bg-transparent outline-none focus:bg-black/20" />
                ) : (
                  <pre className="p-5 text-[12.5px] leading-relaxed font-mono text-primary-foreground/85 overflow-x-auto">{content.pythonCode}</pre>
                )}
              </div>

              <div className="rounded-2xl border border-primary-foreground/10 p-6 flex flex-col gap-4" style={{ background: 'hsl(220, 38%, 10% / 0.7)' }}>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  {isAdmin ? (
                    <input value={content.pythonImpactTitle} onChange={(e) => updateContent({ pythonImpactTitle: e.target.value })} className="font-display font-bold text-primary-foreground text-lg bg-transparent border-b border-primary-foreground/15 outline-none focus:border-yellow-400 flex-1" />
                  ) : (
                    <h4 className="font-display font-bold text-primary-foreground text-lg">{content.pythonImpactTitle}</h4>
                  )}
                  {isAdmin && (
                    <button onClick={() => updateContent({ pythonImpactItems: [...content.pythonImpactItems, { id: Date.now().toString(), t: 'Novo', d: 'Descrição.' }] })} className="text-xs text-yellow-300 hover:text-yellow-200 flex items-center gap-1"><Plus className="w-3 h-3" /></button>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  {content.pythonImpactItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-3 rounded-xl p-3 border border-primary-foreground/5 hover:border-yellow-500/30 transition-colors" style={{ background: 'hsl(220, 35%, 8% / 0.6)' }}>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {isAdmin ? (
                          <>
                            <input value={item.t} onChange={(e) => updateContent({ pythonImpactItems: content.pythonImpactItems.map(x => x.id === item.id ? { ...x, t: e.target.value } : x) })} className="font-semibold text-primary-foreground bg-transparent border-b border-primary-foreground/10 w-full outline-none focus:border-yellow-400" />
                            <textarea value={item.d} onChange={(e) => updateContent({ pythonImpactItems: content.pythonImpactItems.map(x => x.id === item.id ? { ...x, d: e.target.value } : x) })} className="text-primary-foreground/65 text-xs leading-relaxed bg-transparent border border-primary-foreground/10 rounded p-1.5 w-full mt-1 outline-none focus:border-yellow-400" />
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-primary-foreground">{item.t}</p>
                            <p className="text-primary-foreground/65 text-xs leading-relaxed">{item.d}</p>
                          </>
                        )}
                      </div>
                      {isAdmin && (
                        <button onClick={() => updateContent({ pythonImpactItems: content.pythonImpactItems.filter(x => x.id !== item.id) })} className="text-destructive/60 hover:text-destructive shrink-0"><Trash2 className="w-3 h-3" /></button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>



      {/* === CHAMADOS / SERVICE DESK === */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20" style={{ background: 'linear-gradient(160deg, hsl(220, 45%, 9%), hsl(220, 35%, 12%))' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[140px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/10 blur-[140px]" />
          </div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 shrink-0">
                  <LifeBuoy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">Abertura de Chamados</h3>
                  <p className="text-primary-foreground/60 text-base mt-1">Solicite alterações, correções ou novos relatórios via GestaoX</p>
                  <div className="w-20 h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mt-3" />
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2">
                <a
                  href={content.gestaoxUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Acessar Sistema GestaoX
                </a>
                {isAdmin && (
                  <input
                    type="url"
                    value={content.gestaoxUrl || ''}
                    onChange={(e) => updateContent({ gestaoxUrl: e.target.value })}
                    placeholder="https://..."
                    className="text-xs px-3 py-2 rounded-lg bg-background/60 border border-amber-500/30 text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-amber-400"
                  />
                )}
              </div>
            </div>

            <p className="text-primary-foreground/70 text-base leading-relaxed mb-6 max-w-3xl">
              Toda solicitação relacionada aos relatórios da Diretoria de Pessoas deve ser registrada no <span className="text-amber-400 font-semibold">Service Desk</span>.
              Use os caminhos abaixo no portal <span className="text-amber-400 font-semibold">Sistema GestaoX</span> para abrir o chamado correto e garantir o atendimento dentro do SLA.
            </p>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Categorias', value: '3', icon: LifeBuoy, color: 'from-amber-500 to-orange-500' },
                { label: 'Tipos de chamado', value: '6', icon: FileText, color: 'from-teal-500 to-cyan-500' },
                { label: 'SLA mais rápido', value: '27h', icon: Flame, color: 'from-rose-500 to-red-500' },
                { label: 'Atendimento', value: '100%', icon: FileCheck, color: 'from-emerald-500 to-green-500' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4 border border-primary-foreground/10 flex items-center gap-3 hover:border-accent/40 transition-colors" style={{ background: 'hsl(220, 38%, 11%)' }}>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md shrink-0`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-display font-bold text-primary-foreground leading-none">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-foreground/60 mt-1 font-semibold">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>


            {/* Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Flame,
                  color: 'from-rose-500 to-red-500',
                  title: 'Mapa de Calor Instrutor',
                  path: 'People Analytics › Mapa de Calor Instrutor',
                  items: [
                    { name: 'Correções e Contestações de Resultados', sla: 'SLA 45h úteis', kind: 'Solicitação', tone: 'text-rose-300', itemIcon: FileEdit },
                  ],
                },
                {
                  icon: FileText,
                  color: 'from-teal-500 to-cyan-500',
                  title: 'Relatórios',
                  path: 'People Analytics › Relatórios',
                  items: [
                    { name: 'Alteração de Relatório', sla: 'SLA Negociado', kind: 'Tarefa', tone: 'text-cyan-300', itemIcon: FileEdit },
                    { name: 'Criação de Relatório', sla: 'SLA Negociado', kind: 'Tarefa', tone: 'text-cyan-300', itemIcon: FilePlus },
                    { name: 'Erros e correções', sla: 'SLA 36h úteis', kind: 'Solicitação', tone: 'text-cyan-300', itemIcon: FileX },
                    { name: 'Liberação de Relatórios', sla: 'SLA 27h úteis', kind: 'Incidente', tone: 'text-amber-300', itemIcon: FileCheck },
                  ],
                },
                {
                  icon: DollarSign,
                  color: 'from-emerald-500 to-green-500',
                  title: 'Remuneração Variável',
                  path: 'People Analytics › Remuneração Variável',
                  items: [
                    { name: 'Contestação', sla: 'SLA 27h úteis', kind: 'Solicitação', tone: 'text-emerald-300', itemIcon: FileEdit },
                  ],
                },
              ].map((cat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="rounded-2xl border border-primary-foreground/10 overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 flex flex-col"
                  style={{ background: 'hsl(220, 38%, 10%)' }}
                >
                  <div className={`p-5 bg-gradient-to-r ${cat.color} flex items-center gap-3`}>
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20 shrink-0">
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-white text-lg leading-tight">{cat.title}</h4>
                      <p className="text-white/80 text-[11px] font-mono mt-1 truncate">{cat.path}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5 flex-1">
                    {cat.items.map((it, j) => {
                      const ItemIco = it.itemIcon;
                      return (
                        <div key={j} className="group rounded-xl p-3.5 border border-primary-foreground/10 hover:border-accent/40 hover:translate-x-0.5 transition-all flex items-start gap-3" style={{ background: 'hsl(220, 35%, 12%)' }}>
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} bg-opacity-20 flex items-center justify-center shrink-0 shadow-md ring-1 ring-white/10`}>
                            <ItemIco className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-primary-foreground text-sm font-semibold leading-snug">{it.name}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${it.tone} font-mono font-semibold border border-white/5`}>{it.sla}</span>
                              <span className="text-[10px] text-primary-foreground/60 px-2 py-0.5 rounded-full bg-primary-foreground/5 border border-primary-foreground/10">{it.kind}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tip box */}
            <div className="mt-8 rounded-xl p-5 border border-amber-500/25 flex items-start gap-3" style={{ background: 'hsl(35, 50%, 12% / 0.4)' }}>
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-primary-foreground text-sm font-semibold mb-1">Dica de uso</p>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  Escolha sempre a categoria correta para evitar redirecionamentos e reduzir o tempo de atendimento.
                  Em caso de dúvida, entre em contato com a equipe pelo e-mail <span className="text-amber-400 font-semibold">{content.directoryEmail}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default NossaAreaPage;
