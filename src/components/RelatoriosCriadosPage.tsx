import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Search, FileText, BarChart3, TrendingUp } from 'lucide-react';
import dataFlowImg from '@/assets/data-flow.jpg';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, updateAnalyst, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const filteredReports = content.reports
    .filter((r) => !selectedAnalystId || r.creatorId === selectedAnalystId)
    .filter((r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';
  const selectedReport = content.reports.find((r) => r.id === selectedReportId);
  const navigateReport = (direction: 'prev' | 'next') => { const idx = filteredReports.findIndex((r) => r.id === selectedReportId); if (idx === -1) return; const newIdx = direction === 'next' ? idx + 1 : idx - 1; if (newIdx >= 0 && newIdx < filteredReports.length) setSelectedReportId(filteredReports[newIdx].id); };
  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16">
        <GalaxyParticles />
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
        const reportsForSelected = selectedAnalystId ? content.reports.filter(r => r.creatorId === selectedAnalystId).length : content.reports.length;
        const stats = [
          {
            icon: FileText,
            value: reportsForSelected,
            label: selectedAnalyst ? 'Relatórios deste analista' : 'Relatórios criados',
            color: 'text-accent',
            bg: 'bg-accent/15',
          },
          {
            icon: User,
            value: selectedAnalyst ? selectedAnalyst.name : biAnalysts.length,
            label: selectedAnalyst ? 'Analista selecionado' : 'Analistas',
            color: 'text-primary',
            bg: 'bg-primary/15',
            isText: !!selectedAnalyst,
            avatar: selectedAnalyst?.photo,
          },
          {
            icon: BarChart3,
            value: selectedAnalyst ? selectedAnalyst.area : new Set(content.reports.flatMap(r => r.eligibleAreas || [])).size,
            label: selectedAnalyst ? 'Área de atuação' : 'Áreas atendidas',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/15',
            isText: !!selectedAnalyst,
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
                className="glass-card rounded-2xl p-6 border border-border/30 flex items-center gap-4 hover:border-accent/30 transition-all duration-400"
                style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px hsl(var(--accent) / 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {stat.avatar ? (
                  <div className="rounded-xl overflow-hidden shrink-0 ring-2 ring-primary/30" style={{ width: '3.25rem', height: '3.25rem' }}>
                    <img src={stat.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`rounded-xl ${stat.bg} flex items-center justify-center shrink-0`} style={{ width: '3.25rem', height: '3.25rem' }}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className={`font-display font-bold ${stat.color} ${stat.isText ? 'text-xl leading-tight truncate' : 'text-3xl'}`}>{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
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
            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-semibold transition-all duration-300 border ${
              !selectedAnalystId
                ? 'gradient-accent text-accent-foreground shadow-lg shadow-accent/25 border-transparent'
                : 'bg-card/50 text-foreground border-border/30 hover:border-accent/40 hover:shadow-lg'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><User className="w-5 h-5" /></div>
            Todos
          </button>
          {biAnalysts.map((a) => (
            <div key={a.id} className="relative group">
              <button onClick={() => setSelectedAnalystId(selectedAnalystId === a.id ? null : a.id)}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 border ${
                  selectedAnalystId === a.id
                    ? 'gradient-accent text-accent-foreground shadow-lg shadow-accent/25 border-transparent'
                    : 'bg-card/50 text-foreground border-border/30 hover:border-accent/40 hover:shadow-lg'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-accent/20 ring-1 ring-accent/10">
                  {a.photo ? <img src={a.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="text-left min-w-0">
                  <span className="block font-display font-semibold text-base leading-tight truncate">{a.name}</span>
                  <span className={`text-xs block leading-tight mt-0.5 ${selectedAnalystId === a.id ? 'text-accent-foreground/75' : 'text-muted-foreground'}`}>{a.area}</span>
                </div>
              </button>
              {isAdmin && <div className="absolute top-full left-0 mt-1 z-20 hidden group-hover:block"><div className="glass-card rounded-lg p-3 shadow-xl w-64 space-y-2"><label className="text-xs text-muted-foreground">URL da Foto</label><input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs" value={a.photo} onChange={(e) => updateAnalyst(a.id, { photo: e.target.value })} onClick={(e) => e.stopPropagation()} /></div></div>}
            </div>
          ))}
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
