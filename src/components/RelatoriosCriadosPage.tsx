import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, updateAnalyst, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const biAnalysts = content.analysts.filter((a) => a.type === 'bi');
  const filteredReports = selectedAnalystId 
    ? content.reports.filter((r) => r.creatorId === selectedAnalystId) 
    : content.reports;

  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';
  const selectedReport = content.reports.find((r) => r.id === selectedReportId);

  const navigateReport = (direction: 'prev' | 'next') => { 
    const idx = filteredReports.findIndex((r) => r.id === selectedReportId); 
    if (idx === -1) return; 
    const newIdx = direction === 'next' ? idx + 1 : idx - 1; 
    if (newIdx >= 0 && newIdx < filteredReports.length) setSelectedReportId(filteredReports[newIdx].id); 
  };
  
  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);

  return (
    <div className="max-w-7xl mx-auto space-y-16 px-4 pb-20">
      
      {/* 1. SEÇÃO DE HEADER (GALAXY) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden rounded-3xl gradient-navy p-10 md:p-20 shadow-2xl"
      >
        <GalaxyParticles />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? (
            <input 
              className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 bg-transparent border-b border-white/20 w-full outline-none focus:border-accent" 
              value={content.portfolioTitle} 
              onChange={(e) => updateContent({ portfolioTitle: e.target.value })} 
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              {content.portfolioTitle}
            </h2>
          )}
          
          <div className="space-y-4">
            <p className="text-accent text-lg font-medium tracking-widest uppercase">{content.portfolioSubtitle}</p>
            {isAdmin ? (
              <textarea 
                className="text-primary-foreground/80 leading-relaxed text-xl bg-transparent border border-white/10 rounded-xl p-4 w-full min-h-[100px] outline-none focus:border-accent" 
                value={content.portfolioDescription} 
                onChange={(e) => updateContent({ portfolioDescription: e.target.value })} 
              />
            ) : (
              <p className="text-primary-foreground/80 leading-relaxed text-xl max-w-2xl">
                {content.portfolioDescription}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* 2. FILTRO DE ANALISTAS (CENTRALIZADO) */}
      <section className="space-y-8">
        <h3 className="text-2xl font-display font-bold text-center text-foreground">Filtrar por Especialista</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setSelectedAnalystId(null)}
            className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${!selectedAnalystId ? 'gradient-accent text-white scale-105 shadow-xl shadow-accent/20' : 'glass-card text-foreground hover:bg-white/5'}`}
          >
            Todos os Projetos
          </button>
          {biAnalysts.map((a) => (
            <button 
              key={a.id}
              onClick={() => setSelectedAnalystId(selectedAnalystId === a.id ? null : a.id)}
              className={`flex items-center gap-4 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${selectedAnalystId === a.id ? 'gradient-accent text-white scale-105 shadow-xl shadow-accent/20' : 'glass-card text-foreground hover:shadow-lg hover:-translate-y-1'}`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                {a.photo ? <img src={a.photo} className="w-full h-full object-cover" /> : <User className="w-5 h-5 m-auto" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">{a.name}</p>
                <p className="text-[10px] opacity-70 mt-1">{a.area}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. GRID DE RELATÓRIOS (CENTRALIZADO E LARGO) */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <h3 className="text-2xl font-display font-bold text-foreground">
            {filteredReports.length} <span className="text-muted-foreground font-normal">relatório{filteredReports.length !== 1 ? 's' : ''}</span>
          </h3>
          {isAdmin && (
            <button 
              onClick={() => addReport({ id: Date.now().toString(), name: 'Novo Relatório', creatorId: biAnalysts[0]?.id || '', description: 'Descrição...', images: [], metrics: [], link: '', eligibleAreas: [] })} 
              className="px-6 py-2.5 rounded-xl gradient-accent text-white text-sm font-bold hover:brightness-110 transition shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Adicionar Projeto
            </button>
          )}
        </div>

        {/* CONTÊINER PARA CENTRALIZAR O CARD E DAR LARGURA */}
        <div className="flex justify-center w-full px-2">
          <div className="w-full max-w-[850px] space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report, i) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ReportCard 
                    report={report} 
                    creatorName={getCreatorName(report.creatorId)} 
                    index={i} 
                    onClick={() => setSelectedReportId(report.id)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal 
            report={selectedReport} 
            creatorName={getCreatorName(selectedReport.creatorId)} 
            onClose={() => setSelectedReportId(null)} 
            showMetrics={false}
            onNavigate={navigateReport} 
            hasPrev={currentIdx > 0} 
            hasNext={currentIdx < filteredReports.length - 1} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelatoriosCriadosPage;
