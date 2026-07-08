import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Search, FileText, BarChart3, Check, Building2, Layers, Tag, Globe } from 'lucide-react';
import dataFlowImg from '@/assets/data-flow.jpg';
import bgReports from '@/assets/data-pipeline.jpg';
import bgAnalysts from '@/assets/admin-team.jpg';
import bgAreas from '@/assets/journey-decisao.jpg';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, updateAnalyst, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const areaIcons = [Building2, Tag, Layers, Globe, Building2, Tag];
  const areaColors = [
    { text: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-400/40', glow: 'shadow-cyan-500/20' },
    { text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-400/40', glow: 'shadow-fuchsia-500/20' },
    { text: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-400/40', glow: 'shadow-amber-500/20' },
    { text: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-400/40', glow: 'shadow-emerald-500/20' },
    { text: 'text-rose-300', bg: 'bg-rose-500/20', border: 'border-rose-400/40', glow: 'shadow-rose-500/20' },
    { text: 'text-violet-300', bg: 'bg-violet-500/20', border: 'border-violet-400/40', glow: 'shadow-violet-500/20' },
  ];
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const eligibleAreasOptions = content.eligibleAreasOptions || [];
  const filteredReports = content.reports
    .filter((r) => !selectedAnalystId || r.creatorId === selectedAnalystId)
    .filter((r) => !selectedAreaFilter || (r.eligibleAreas || []).includes(selectedAreaFilter))
    .filter((r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';
  const selectedReport = content.reports.find((r) => r.id === selectedReportId);
  const navigateReport = (direction: 'prev' | 'next') => { const idx = filteredReports.findIndex((r) => r.id === selectedReportId); if (idx === -1) return; const newIdx = direction === 'next' ? idx + 1 : idx - 1; if (newIdx >= 0 && newIdx < filteredReports.length) setSelectedReportId(filteredReports[newIdx].id); };
  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);
  const getAreaMeta = (area: string, idx: number) => {
    const safeIdx = idx % areaColors.length;
    const Icon = areaIcons[safeIdx % areaIcons.length];
    return { Icon, ...areaColors[safeIdx] };
  };

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
        const selectedAnalyst = selectedAnalystId ? content.analysts.find(a => a.id === selectedAnalystId) : null;
        const baseReports = content.reports
          .filter(r => !selectedAnalystId || r.creatorId === selectedAnalystId)
          .filter(r => !selectedAreaFilter || (r.eligibleAreas || []).includes(selectedAreaFilter));
        const reportsForSelected = baseReports.length;
        const areasAtendidas = selectedAreaFilter
          ? 1
          : new Set(baseReports.flatMap(r => r.eligibleAreas || [])).size;
        const stats = [
          {
            icon: FileText,
            value: reportsForSelected,
            label: selectedAnalyst ? 'Relatórios deste analista' : selectedAreaFilter ? `Relatórios em ${selectedAreaFilter}` : 'Relatórios criados',
            color: 'text-accent',
            bg: 'bg-accent/15',
            bgImg: bgReports,
          },
          {
            icon: User,
            value: selectedAnalyst ? selectedAnalyst.name : biAnalysts.length,
            label: selectedAnalyst ? 'Analista selecionado' : 'Analistas',
            color: 'text-primary',
            bg: 'bg-primary/15',
            isText: !!selectedAnalyst,
            avatar: selectedAnalyst?.photo,
            bgImg: bgAnalysts,
          },
          {
            icon: BarChart3,
            value: selectedAnalyst ? selectedAnalyst.area : selectedAreaFilter || areasAtendidas,
            label: selectedAnalyst ? 'Área de atuação' : selectedAreaFilter ? 'Área filtrada' : 'Áreas atendidas',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/15',
            isText: !!selectedAnalyst || !!selectedAreaFilter,
            bgImg: bgAreas,
          },
        ];
        return (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="relative rounded-2xl overflow-hidden border border-border/30 flex items-center gap-4 hover:border-accent/30 transition-all duration-400 group"
                style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px hsl(var(--accent) / 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Background image */}
                <img src={stat.bgImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-25 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/60 pointer-events-none" />
                <div className="relative z-10 p-6 flex items-center gap-4 w-full">
                  {stat.avatar ? (
                    <div className="rounded-xl overflow-hidden shrink-0 ring-2 ring-primary/30" style={{ width: '3.25rem', height: '3.25rem' }}>
                      <img src={stat.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`rounded-xl ${stat.bg} flex items-center justify-center shrink-0 backdrop-blur-sm`} style={{ width: '3.25rem', height: '3.25rem' }}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`font-display font-bold ${stat.color} ${stat.isText ? 'text-xl leading-tight truncate' : 'text-3xl'}`}>{stat.value}</p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      })()}

      {/* Analyst filter */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {isAdmin ? <input className="text-xl font-display font-bold text-foreground mb-6 bg-transparent border-b border-border outline-none focus:border-accent block" value={content.filterByAnalystTitle} onChange={(e) => updateContent({ filterByAnalystTitle: e.target.value })} /> : <h3 className="text-xl font-display font-bold text-foreground mb-6">{content.filterByAnalystTitle}</h3>}
        <div className="flex flex-wrap gap-3.5">
          <button onClick={() => setSelectedAnalystId(null)}
            className={`relative flex items-center gap-3.5 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 border overflow-hidden ${
              !selectedAnalystId
                ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 border-transparent'
                : 'glass-card text-foreground border-border/40 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {!selectedAnalystId && <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30" />}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${!selectedAnalystId ? 'bg-white/15' : 'bg-accent/15'}`}>
              {!selectedAnalystId ? <Check className="w-5 h-5" /> : <User className="w-5 h-5 text-accent" />}
            </div>
            <span>Todos</span>
          </button>
          {biAnalysts.map((a) => (
            <div key={a.id} className="relative group">
              <button onClick={() => setSelectedAnalystId(selectedAnalystId === a.id ? null : a.id)}
                className={`relative flex items-center gap-3.5 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 border overflow-hidden ${
                  selectedAnalystId === a.id
                    ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 border-transparent'
                    : 'glass-card text-foreground border-border/40 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {selectedAnalystId === a.id && <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30" />}
                <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center border-2 ${selectedAnalystId === a.id ? 'border-white/40 ring-2 ring-white/20' : 'border-accent/20 ring-1 ring-accent/10'}`}>
                  {a.photo ? <img src={a.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="text-left min-w-0">
                  <span className="block font-display font-semibold text-base leading-tight truncate">{a.name}</span>
                  <span className={`text-xs block leading-tight mt-0.5 ${selectedAnalystId === a.id ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>{a.role || '—'}</span>
                </div>
                {selectedAnalystId === a.id && (
                  <div className="ml-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
              {isAdmin && <div className="absolute top-full left-0 mt-1 z-20 hidden group-hover:block"><div className="glass-card rounded-lg p-3 shadow-xl w-64 space-y-2"><label className="text-xs text-muted-foreground">URL da Foto</label><input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs" value={a.photo} onChange={(e) => updateAnalyst(a.id, { photo: e.target.value })} placeholder="Cole a URL da imagem" onClick={(e) => e.stopPropagation()} /></div></div>}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Area filter */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-foreground">Filtrar por Área Elegível</h3>
          {isAdmin && (
            <button
              onClick={() => {
                const novo = prompt('Nome da nova área elegível:');
                if (novo && novo.trim()) updateContent({ eligibleAreasOptions: [...eligibleAreasOptions, novo.trim()] });
              }}
              className="px-3 py-1.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/40 text-xs font-medium hover:bg-fuchsia-500/30 transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Nova área
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3.5">
          {/* Todas */}
          <button
            onClick={() => setSelectedAreaFilter(null)}
            className={`relative flex items-center gap-3.5 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 border overflow-hidden ${
              !selectedAreaFilter
                ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 border-transparent'
                : 'glass-card text-foreground border-border/40 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {!selectedAreaFilter && <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30" />}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${!selectedAreaFilter ? 'bg-white/15' : 'bg-accent/15'}`}>
              {!selectedAreaFilter ? <Check className="w-5 h-5" /> : <Layers className="w-5 h-5 text-accent" />}
            </div>
            <span>Todas</span>
          </button>

          {eligibleAreasOptions.map((area, idx) => {
            const isSelected = selectedAreaFilter === area;
            const { Icon, text, bg, border } = getAreaMeta(area, idx);
            return (
              <div key={area} className="relative group">
                <button
                  onClick={() => setSelectedAreaFilter(isSelected ? null : area)}
                  className={`relative flex items-center gap-3.5 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 border overflow-hidden ${
                    isSelected
                      ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 border-transparent'
                      : `glass-card text-foreground border-border/40 hover:${border} hover:shadow-lg hover:-translate-y-0.5`
                  }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30" />}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/15' : `${bg} ${border} border`}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : text}`} />
                  </div>
                  <span className="font-display font-semibold text-base leading-tight truncate">{area}</span>
                  {isSelected && (
                    <div className="ml-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (confirm(`Remover a área "${area}"?`)) { updateContent({ eligibleAreasOptions: eligibleAreasOptions.filter(a => a !== area) }); if (selectedAreaFilter === area) setSelectedAreaFilter(null); } }}
                    title="Remover área"
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center shadow-md border border-background z-10 hover:scale-110 transition"
                  >×</button>
                )}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" placeholder="Buscar relatório pelo nome..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all text-base" />
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
          {isAdmin && <button onClick={() => addReport({ id: Date.now().toString(), name: 'Novo Relatório', creatorId: biAnalysts[0]?.id || '', description: 'Descrição do relatório.', images: [], metrics: [], link: '', eligibleAreas: [] })} className="px-5 py-3 rounded-xl gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> Adicionar</button>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>{filteredReports.map((report, i) => <ReportCard key={report.id} report={report} creatorName={getCreatorName(report.creatorId)} index={i} onClick={() => setSelectedReportId(report.id)} />)}</AnimatePresence>
        </div>
      </motion.section>

      <AnimatePresence>{selectedReport && <ReportDetailModal report={selectedReport} creatorName={getCreatorName(selectedReport.creatorId)} onClose={() => setSelectedReportId(null)} showMetrics={false} onNavigate={navigateReport} hasPrev={currentIdx > 0} hasNext={currentIdx < filteredReports.length - 1} />}</AnimatePresence>
    </div>
  );
};

export default RelatoriosCriadosPage;
