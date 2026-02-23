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
    <div className="space-y-16 max-w-[1400px] mx-auto px-4 pb-20">
      
      {/* 1. SEÇÃO DE HEADER (GALAXY) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden rounded-3xl gradient-navy p-12 md:p-20 shadow-2xl"
      >
        <GalaxyParticles />
        <div className="relative z-10 max-w-4xl">
          {isAdmin ? (
            <input 
              className="text-5xl md:text-6xl font-display font-bold text-primary-foreground mb-6 bg-transparent border-b border-white/10 w-full outline-none" 
              value={content.portfolioTitle} 
              onChange={(e) => updateContent({ portfolioTitle: e.target.value })} 
            />
          ) : (
            <h2 className="text-5xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              {content.portfolioTitle}
            </h2>
          )}
          <p className="text-accent text-lg font-medium mb-4 uppercase tracking-widest">{content.portfolioSubtitle}</p>
          <p className="text-primary-foreground/70 text-xl leading-relaxed max-w-2xl">{content.portfolioDescription}</p>
        </div>
      </motion.section>

      {/* 2. FILTRO DE ANALISTAS (CENTRALIZADO) */}
      <section className="space-y-8">
        <h3 className="text-2xl font-display font-bold text-center text-foreground">Filtrar por Especialista</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setSelectedAnalystId(null)}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${!selectedAnalystId ? 'gradient-accent text-white scale-105 shadow-lg' : 'glass-card hover:bg-white/5'}`}
          >
            Todos os Projetos
          </button>
          {biAnalysts.map((a) => (
            <button 
              key={a.id}
              onClick={() => setSelectedAnalystId(a.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all ${selectedAnalystId === a.id ? 'gradient-accent text-white scale-105 shadow-lg' : 'glass-card hover:bg-white/5'}`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                <img src={a.photo || '/placeholder-user.png'} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">{a.name}</p>
                <p className="text-[10px] opacity-70">{a.area}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. GRID DE RELATÓRIOS (AQUI ESTÁ O AJUSTE DE TAMANHO) */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <h3 className="text-3xl font-display font-bold">{filteredReports.length} Projetos Encontrados</h3>
          {isAdmin && (
            <button onClick={() => addReport({...})} className="gradient-accent px-6 py-2 rounded-xl font-bold flex items-center gap-2">
              <Plus size={18} /> Novo Projeto
            </button>
          )}
        </div>

        {/* CONTÊINER QUE CENTRALIZA E AUMENTA O CARD */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-12 w-full max-w-[900px]">
            <AnimatePresence mode="wait">
              {filteredReports.map((report, i) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
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
