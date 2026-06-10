import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Search, FileText, BarChart3, Layers, Filter } from 'lucide-react';
import dataFlowImg from '@/assets/data-flow.jpg';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';

type FilterMode = 'analyst' | 'area';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, updateAnalyst, addReport } = useAdmin();
  // Mantemos o filterMode fixo em 'area' para preservar a lógica interna do seu componente
  const [filterMode, setFilterMode] = useState<FilterMode>('area');
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');

  // Unique list of areas derived from BI analysts
  const areas = useMemo(() => {
    const set = new Set<string>();
    biAnalysts.forEach((a) => a.area && set.add(a.area));
    return Array.from(set);
  }, [biAnalysts]);

  const filteredReports = content.reports
    .filter((r) => {
      if (filterMode === 'analyst') return !selectedAnalystId || r.creatorId === selectedAnalystId;
      if (filterMode === 'area') {
        if (!selectedArea) return true;
        const creator = content.analysts.find((a) => a.id === r.creatorId);
        return creator?.area === selectedArea;
      }
      return true;
    })
    .filter((r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';
  const selectedReport = content.reports.find((r) => r.id === selectedReportId);
  const navigateReport = (direction: 'prev' | 'next') => {
    const idx = filteredReports.findIndex((r) => r.id === selectedReportId);
    if (idx === -1) return;
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < filteredReports.length) setSelectedReportId(filteredReports[newIdx].id);
  };
  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);

  const areasCount = content.areasAtendidasCount ?? new Set(content.reports.flatMap((r) => r.eligibleAreas || [])).size;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16">
        <GalaxyParticles />
        <img src={dataFlowImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none" loading="eager" width={1280} height={768} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" /></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            {isAdmin ? <input className="text-4xl md:text-5xl font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent" value={content.portfolioTitle} onChange={(e) => updateContent({ portfolioTitle: e.target.value })} /> : <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">{content.portfolioTitle}</h2>}
          </div>
          {isAdmin ? <input className="text-accent text-lg font-medium mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent block" value={content.portfolioSubtitle} onChange={(e) => updateContent({ portfolioSubtitle: e.target.value })} /> : <p className="text-accent text-lg font-medium mb-4">{content.portfolioSubtitle}</p>}
          {isAdmin ? <textarea className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[80px] outline-none focus:border-accent" value={content.portfolioDescription} onChange={(e) => updateContent({ portfolioDescription: e.target.value })} /> : <p className="text-primary-foreground/80 leading-relaxed text-lg">{content.portfolioDescription}</p>}
        </div>
      </motion.section>

      {/* Stats */}
      {(() => {
        const selectedAnalyst = selectedAnalystId ? content.analysts.find((a) => a.id === selectedAnalystId) : null;
        const reportsForSelected = selectedAnalystId
          ? content.reports.filter((r) => r.creatorId === selectedAnalystId).length
          : content.reports.length;
        return (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Reports */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 border border-border/30 flex items-center gap-4 smooth-hover hover:border-accent/40">
              <div className="rounded-xl bg-accent/15 flex items-center justify-center shrink-0" style={{ width: '3.25rem', height: '3.25rem' }}>
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-accent text-3xl">{reportsForSelected}</p>
                <p className="text-muted-foreground text-sm">{selectedAnalyst ? 'Relatórios deste analista' : 'Relatórios criados'}</p>
              </div>
            </motion.div>

            {/* Card 2: Analyst / count */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              className="glass-card rounded-2xl p-6 border border-border/30 flex items-center gap-4 smooth-hover hover:border-accent/40">
              {selectedAnalyst?.photo ? (
                <div className="rounded-xl overflow-hidden shrink-0 ring-2 ring-primary/30" style={{ width: '3.25rem', height: '3.25rem' }}>
                  <img src={selectedAnalyst.photo} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl bg-primary/15 flex items-center justify-center shrink-0" style={{ width: '3.25rem', height: '3.25rem' }}>
                  <Filter className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className={`font-display font-bold text-primary ${selectedAnalyst ? 'text-xl leading-tight truncate' : 'text-3xl'}`}>{selectedAnalyst ? selectedAnalyst.name : 'Todas as Áreas'}</p>
                <p className="text-muted-foreground text-sm">{selectedAnalyst ? 'Analista selecionado' : 'Filtro ativo'}</p>
              </div>
            </motion.div>

            {/* Card 3: Áreas atendidas — editable */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              className="glass-card rounded-2xl p-6 border border-border/30 flex items-center gap-4 smooth-hover hover:border-emerald-500/40">
              <div className="rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0" style={{ width: '3.25rem', height: '3.25rem' }}>
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                {selectedAnalyst ? (
                  <p className="font-display font-bold text-emerald-400 text-xl leading-tight truncate">{selectedAnalyst.area}</p>
                ) : isAdmin ? (
                  <input
                    type="number"
                    className="font-display font-bold text-emerald-400 text-3xl bg-transparent border-b border-emerald-500/30 outline-none focus:border-emerald-400 w-24"
                    value={content.areasAtendidasCount ?? areasCount}
                    onChange={(e) => updateContent({ areasAtendidasCount: Number(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="font-display font-bold text-emerald-400 text-3xl">{areasCount}</p>
                )}
                <p className="text-muted-foreground text-sm">{selectedAnalyst ? 'Area de atuação' : 'Áreas atendidas'}</p>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {/* Exibição Fixa do Filtro por Área (Visual Original de Ícones) */}
      <AnimatePresence mode="wait">
        <motion.section
          key="filter-area"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl font-display font-bold text-foreground mb-6">Filtrar por Área</h3>
          <div className="flex flex-wrap gap-3.5">
            <button onClick={() => setSelectedArea(null)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-semibold smooth-hover border ${!selectedArea ? 'gradient-accent text-accent-foreground shadow-lg shadow-accent/25 border-transparent' : 'bg-card/50 text-foreground border-border/30 hover:border-accent/40 hover:shadow-lg'}`}
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><Layers className="w-5 h-5" /></div>
              Todas
            </button>
            {areas.map((area) => {
              const count = content.reports.filter((r) => {
                const c = content.analysts.find((a) => a.id === r.creatorId);
                return c?.area === area;
              }).length;
              const active = selectedArea === area;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(active ? null : area)}
                  className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-base font-medium smooth-hover border ${active ? 'gradient-accent text-accent-foreground shadow-lg shadow-accent/25 border-transparent' : 'bg-card/50 text-foreground border-border/30 hover:border-accent/40 hover:shadow-lg'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/15' : 'bg-accent/10'}`}>
                    <Layers className={`w-5 h-5 ${active ? 'text-accent-foreground' : 'text-accent'}`} />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block font-display font-semibold text-base leading-tight truncate">{area}</span>
                    <span className={`text-xs block leading-tight mt-0.5 ${active ? 'text-accent-foreground/75' : 'text-muted-foreground'}`}>{count} relatório{count !== 1 ? 's' : ''}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Busca */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="Buscar relatório pelo nome..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 smooth-hover text-base" />
      </motion.div>

      {/* Access Warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="rounded-2xl border-2 border-amber-500/40 p-5 flex items-start gap-4 shadow-lg shadow-amber-500/10"
        style={{ background: 'linear-gradient(135deg, hsl(38, 92%, 50% / 0.10), hsl(38, 92%, 50% / 0.04))' }}
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 ring-2 ring-amber-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 17h.01"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-base font-display font-bold text-amber-300">Acesso restrito por cargo e área</p>
          <p className="text-sm text-foreground/75 mt-1.5 leading-relaxed">Nem todos os colaboradores possuem acesso a todos os relatórios. O acesso é validado de acordo com o cargo e a área de atuação. Caso precise de acesso a um relatório específico, entre em contato com a equipe de BI.</p>
        </div>
      </motion.div>

      {/* Reports grid */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-display font-bold text-foreground">{filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''}</h3>
          {isAdmin && <button onClick={() => addReport({ id: Date.now().toString(), name: 'Novo Relatório', creatorId: biAnalysts[0]?.id || '', description: 'Descrição do relatório.', images: [], metrics: [], link: '', eligibleAreas: [] })} className="px-5 py-3 rounded-xl gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 smooth-hover flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> Adicionar</button>}
        </div>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report, i) => <ReportCard key={report.id} report={report} creatorName={getCreatorName(report.creatorId)} index={i} onClick={() => setSelectedReportId(report.id)} />)}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      <AnimatePresence>{selectedReport && <ReportDetailModal report={selectedReport} creatorName={getCreatorName(selectedReport.creatorId)} onClose={() => setSelectedReportId(null)} showMetrics={false} onNavigate={navigateReport} hasPrev={currentIdx > 0} hasNext={currentIdx < filteredReports.length - 1} />}</AnimatePresence>
    </div>
  );
};

export default RelatoriosCriadosPage;
