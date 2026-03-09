import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Lightbulb, Send, ArrowLeft, FileText, Globe, CheckCircle, Sparkles, Heart, Quote } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import GalaxyParticles from '@/components/GalaxyParticles';

type FeedbackTarget = null | 'relatorio' | 'site';
type FeedbackType = null | 'elogio' | 'sugestao';

const FeedbackPage = () => {
  const { content } = useAdmin();
  const [target, setTarget] = useState<FeedbackTarget>(null);
  const [tipo, setTipo] = useState<FeedbackType>(null);
  const [matricula, setMatricula] = useState('');
  const [nomeRelatorio, setNomeRelatorio] = useState('');
  const [comentario, setComentario] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const reports = content.reports || [];

  const reset = () => { setTarget(null); setTipo(null); setMatricula(''); setNomeRelatorio(''); setComentario(''); setSent(false); setError(''); };

  const handleSubmit = async () => {
    if (!matricula.trim() || !comentario.trim() || !tipo) { setError('Preencha todos os campos obrigatórios.'); return; }
    if (target === 'relatorio' && !nomeRelatorio) { setError('Selecione um relatório.'); return; }
    setSending(true); setError('');
    try {
      if (target === 'relatorio') {
        const { error: dbError } = await supabase.from('feedback_relatorios').insert({ matricula: matricula.trim(), nome_relatorio: nomeRelatorio, tipo, comentario: comentario.trim() });
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('feedback_site').insert({ matricula: matricula.trim(), tipo, comentario: comentario.trim() });
        if (dbError) throw dbError;
      }
      setSent(true);
    } catch { setError('Erro ao enviar feedback. Tente novamente.'); } finally { setSending(false); }
  };

  const stepVariants = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };

  // Progress indicator
  const currentStep = sent ? 4 : tipo ? 3 : target ? 2 : 1;
  const steps = ['Categoria', 'Tipo', 'Enviar', 'Pronto'];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16">
        <GalaxyParticles />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Sugestões e Elogios</h2>
          </div>
          <p className="text-accent text-xl font-medium mb-2">Sua opinião é muito importante para nós!</p>
          <p className="text-primary-foreground/80 leading-relaxed text-lg">Compartilhe sua experiência com nosso site ou relatórios.</p>
        </div>
      </motion.section>

      {/* Values */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, label: 'Valorizamos cada opinião', desc: 'Cada feedback nos ajuda a evoluir', color: 'from-rose-500 to-pink-500' },
          { icon: Sparkles, label: 'Melhorias contínuas', desc: 'Implementamos sugestões recebidas', color: 'from-accent to-primary' },
          { icon: Quote, label: 'Sua voz importa', desc: 'Feedback direto para a equipe', color: 'from-blue-500 to-cyan-500' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="glass-card rounded-2xl p-6 border border-border/30 hover:border-accent/30 transition-all duration-400 group"
            style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px hsl(var(--accent) / 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-foreground font-display font-bold text-base mb-1">{item.label}</h4>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Feedback Form */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i + 1 <= currentStep ? 'gradient-accent text-accent-foreground shadow-lg' : 'bg-muted/40 text-muted-foreground border border-border/40'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i + 1 <= currentStep ? 'text-accent' : 'text-muted-foreground/50'}`}>{step}</span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px mx-1 transition-colors duration-300 ${i + 1 < currentStep ? 'bg-accent' : 'bg-border/40'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border/30 p-8 md:p-12 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 10%), hsl(215, 35%, 7%))' }}>
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary blur-[100px]" />
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="text-center py-16 space-y-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                    <CheckCircle className="w-20 h-20 text-accent mx-auto" />
                  </motion.div>
                  <h3 className="text-3xl font-display font-bold text-foreground">Obrigado pelo feedback!</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">Sua mensagem foi enviada com sucesso.</p>
                  <button onClick={reset} className="px-8 py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold text-base hover:opacity-90 transition-all shadow-lg">
                    Enviar outro feedback
                  </button>
                </motion.div>
              ) : !target ? (
                <motion.div key="target" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10">
                  <div className="text-center">
                    <MessageSquare className="w-14 h-14 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">Sobre o que gostaria de falar?</h3>
                    <p className="text-muted-foreground">Selecione uma opção para continuar</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'site' as const, icon: Globe, title: 'Site', desc: 'Experiência geral do site', color: 'from-accent to-primary' },
                      { key: 'relatorio' as const, icon: FileText, title: 'Relatórios', desc: 'Sobre um relatório específico', color: 'from-primary to-accent' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setTarget(opt.key)}
                        className="group relative rounded-2xl p-8 border border-border/30 hover:border-accent/40 transition-all duration-400 text-left"
                        style={{ background: 'hsl(215, 25%, 12% / 0.5)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px hsl(var(--accent) / 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-5 shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                          <opt.icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground mb-1">{opt.title}</h4>
                        <p className="text-muted-foreground text-sm">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : !tipo ? (
                <motion.div key="tipo" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10">
                  <button onClick={() => setTarget(null)} className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  <div className="text-center">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                      {target === 'site' ? 'Feedback sobre o Site' : 'Feedback sobre Relatórios'}
                    </h3>
                    <p className="text-muted-foreground">É um elogio ou uma sugestão?</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'elogio' as const, icon: Star, title: 'Elogio', desc: 'Quero elogiar algo que gostei', colorFrom: 'hsl(45, 93%, 47%)', colorTo: 'hsl(40, 96%, 40%)' },
                      { key: 'sugestao' as const, icon: Lightbulb, title: 'Sugestão', desc: 'Tenho uma sugestão de melhoria', colorFrom: 'hsl(var(--primary))', colorTo: 'hsl(var(--accent))' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setTipo(opt.key)}
                        className="group relative rounded-2xl p-8 border border-border/30 hover:border-accent/40 transition-all duration-400 text-left"
                        style={{ background: 'hsl(215, 25%, 12% / 0.5)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px hsl(var(--accent) / 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-105 transition-transform duration-300" style={{ background: `linear-gradient(135deg, ${opt.colorFrom}, ${opt.colorTo})` }}>
                          <opt.icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground mb-1">{opt.title}</h4>
                        <p className="text-muted-foreground text-sm">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
                  <button onClick={() => setTipo(null)} className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: tipo === 'elogio' ? 'linear-gradient(135deg, hsl(45, 93%, 47%), hsl(40, 96%, 40%))' : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
                      {tipo === 'elogio' ? <Star className="w-6 h-6 text-white" /> : <Lightbulb className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {tipo === 'elogio' ? 'Elogio' : 'Sugestão'} — {target === 'site' ? 'Site' : 'Relatório'}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-0.5">Preencha os campos abaixo</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Matrícula</label>
                      <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Digite sua matrícula"
                        className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all text-base" />
                    </div>
                    {target === 'relatorio' && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Relatório</label>
                        <select value={nomeRelatorio} onChange={(e) => setNomeRelatorio(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-muted/20 text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all text-base">
                          <option value="">Selecione um relatório</option>
                          {reports.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Comentário</label>
                      <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
                        placeholder={tipo === 'elogio' ? 'Conte-nos o que você gostou...' : 'Compartilhe sua sugestão de melhoria...'} rows={5}
                        className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none text-base" />
                    </div>
                  </div>

                  {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                  <button onClick={handleSubmit} disabled={sending}
                    className="w-full py-4 rounded-xl gradient-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                    {sending ? 'Enviando...' : <><Send className="w-5 h-5" /> Enviar Feedback</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default FeedbackPage;
