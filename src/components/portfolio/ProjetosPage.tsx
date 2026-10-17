import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Check, Wrench } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';
import bgReports from '@/assets/data-pipeline.jpg';

const ProjetosPage = () => {
  const { isAdmin, content, updateContent, addReport } = useAdmin();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const tools = content.toolsOptions || [];
  const filteredReports = content.reports.filter((r) => {
    const matchTool = !selectedTool || (r.tools || []).includes(selectedTool);
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchTool && matchSearch;
  });

  const selectedReport = content.reports.find((r) => r.id === selectedReportId);
  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);
  const navigateReport = (direction: 'prev' | 'next') => {
    const idx = filteredReports.findIndex((r) => r.id === selectedReportId);
    if (idx === -1) return;
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < filteredReports.length) setSelectedReportId(filteredReports[newIdx].id);
  };

  const toggleReportTool = (reportId: string, tool: string) => {
    const report = content.reports.find(r => r.id === reportId);
    if (!report) return;
    const current = report.tools || [];
    const next = current.includes(tool) ? current.filter(t => t !== tool) : [...current, tool];
    updateContent({ reports: content.reports.map(r => r.id === reportId ? { ...r, tools: next } : r) });
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-border/40">
        <img src={bgReports} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        <GalaxyParticles />
        <div className="relative z-10 px-8 md:px-16 py-14 md:py-20 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-4xl md:text-5xl text-foreground">
            Projetos & <span className="text-gradient">Relatórios</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Dashboards, pipelines e soluções de dados que desenvolvi. Filtre por ferramenta ou busque pelo nome.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar projeto ou relatório..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card/70 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent backdrop-blur-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Tool filters */}
      <section>
        <h2 className="font-display font-semibold text-xl text-foreground mb-5 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" /> Filtrar por Ferramenta
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTool(null)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 ${!selectedTool ? 'gradient-accent text-primary-foreground border-transparent shadow-lg scale-105' : 'glass-card border-border/40 text-foreground hover:border-accent/40 hover:-translate-y-0.5'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Todas</span>
            {!selectedTool && <Check className="w-4 h-4" />}
          </button>
          {tools.map((tool) => {
            const active = selectedTool === tool;
            return (
              <button
                key={tool}
                onClick={() => setSelectedTool(active ? null : tool)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 ${active ? 'gradient-accent text-primary-foreground border-transparent shadow-lg scale-105' : 'glass-card border-border/40 text-foreground hover:border-accent/40 hover:-translate-y-0.5'}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-primary-foreground' : 'bg-accent'}`} />
                <span className="text-sm font-semibold">{tool}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Reports grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredReports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ReportCard report={report} creatorName={content.profileName} index={i} onClick={() => setSelectedReportId(report.id)} />
            </motion.div>
          ))}
          {isAdmin && (
            <button
              onClick={() => addReport({ id: Date.now().toString(), name: 'Novo Projeto', creatorId: '3', description: 'Descreva o projeto...', images: [], metrics: [], link: '', tools: [] })}
              className="min-h-[200px] rounded-2xl border-2 border-dashed border-border/50 hover:border-accent/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Adicionar projeto</span>
            </button>
          )}
        </div>
        {filteredReports.length === 0 && !isAdmin && (
          <p className="text-center text-muted-foreground py-12">Nenhum projeto encontrado com esses filtros.</p>
        )}
      </section>

      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            creatorName={content.profileName}
            onClose={() => setSelectedReportId(null)}
            showMetrics={true}
            onNavigate={navigateReport}
            hasPrev={currentIdx > 0}
            hasNext={currentIdx < filteredReports.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjetosPage;
