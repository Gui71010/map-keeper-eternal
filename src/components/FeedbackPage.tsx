import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Lightbulb, Send, ArrowLeft, FileText, Globe, CheckCircle } from 'lucide-react';
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

  const reset = () => {
    setTarget(null);
    setTipo(null);
    setMatricula('');
    setNomeRelatorio('');
    setComentario('');
    setSent(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!matricula.trim() || !comentario.trim() || !tipo) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (target === 'relatorio' && !nomeRelatorio) {
      setError('Selecione um relatório.');
      return;
    }

    setSending(true);
    setError('');

    try {
      if (target === 'relatorio') {
        const { error: dbError } = await supabase.from('feedback_relatorios').insert({
          matricula: matricula.trim(),
          nome_relatorio: nomeRelatorio,
          tipo: tipo,
          comentario: comentario.trim(),
        });
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('feedback_site').insert({
          matricula: matricula.trim(),
          tipo: tipo,
          comentario: comentario.trim(),
        });
        if (dbError) throw dbError;
      }
      setSent(true);
    } catch (err: any) {
      setError('Erro ao enviar feedback. Tente novamente.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

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
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Sugestões e Elogios</h2>
          <p className="text-accent text-lg font-medium mb-2">Sua opinião é muito importante para nós!</p>
          <p className="text-primary-foreground/80 leading-relaxed text-lg">
            Compartilhe sua experiência com nosso site ou relatórios. Seja um elogio ou uma sugestão de melhoria, queremos ouvir você.
          </p>
        </div>
      </motion.section>

      {/* Feedback Form */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-3xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent blur-[100px]" />
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="text-center py-12 space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                    <CheckCircle className="w-20 h-20 text-accent mx-auto" />
                  </motion.div>
                  <h3 className="text-3xl font-display font-bold text-foreground">Obrigado pelo seu feedback!</h3>
                  <p className="text-muted-foreground text-lg">Sua mensagem foi enviada com sucesso. Agradecemos sua contribuição!</p>
                  <button onClick={reset} className="px-8 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 transition-all shadow-lg">
                    Enviar outro feedback
                  </button>
                </motion.div>
              ) : !target ? (
                <motion.div key="target" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">Gostaria de falar sobre o Site ou nossos Relatórios?</h3>
                    <p className="text-muted-foreground">Selecione uma opção abaixo para continuar</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      onClick={() => setTarget('site')}
                      className="group relative glass-card rounded-2xl p-8 border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.08), transparent 70%)' }} />
                      <div className="relative space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto shadow-lg">
                          <Globe className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground">Site</h4>
                        <p className="text-muted-foreground text-sm">Falar sobre a experiência geral do site</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTarget('relatorio')}
                      className="group relative glass-card rounded-2xl p-8 border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.08), transparent 70%)' }} />
                      <div className="relative space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto shadow-lg">
                          <FileText className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground">Relatórios</h4>
                        <p className="text-muted-foreground text-sm">Falar sobre um relatório específico</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : !tipo ? (
                <motion.div key="tipo" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <button onClick={() => setTarget(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  <div className="text-center">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                      {target === 'site' ? 'Feedback sobre o Site' : 'Feedback sobre Relatórios'}
                    </h3>
                    <p className="text-muted-foreground">É um elogio ou uma sugestão?</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      onClick={() => setTipo('elogio')}
                      className="group relative glass-card rounded-2xl p-8 border border-border hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto">
                          <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground">Elogio</h4>
                        <p className="text-muted-foreground text-sm">Quero elogiar algo que gostei</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTipo('sugestao')}
                      className="group relative glass-card rounded-2xl p-8 border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                          <Lightbulb className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-display font-bold text-foreground">Sugestão</h4>
                        <p className="text-muted-foreground text-sm">Tenho uma sugestão de melhoria</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <button onClick={() => setTipo(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tipo === 'elogio' ? 'bg-yellow-500/20' : 'bg-primary/20'}`}>
                      {tipo === 'elogio' ? <Star className="w-5 h-5 text-yellow-500" /> : <Lightbulb className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {tipo === 'elogio' ? 'Elogio' : 'Sugestão'} — {target === 'site' ? 'Site' : 'Relatório'}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Matrícula</label>
                      <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Digite sua matrícula"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                      />
                    </div>

                    {target === 'relatorio' && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Relatório</label>
                        <select
                          value={nomeRelatorio}
                          onChange={(e) => setNomeRelatorio(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                        >
                          <option value="">Selecione um relatório</option>
                          {reports.map((r) => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Comentário</label>
                      <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder={tipo === 'elogio' ? 'Conte-nos o que você gostou...' : 'Compartilhe sua sugestão de melhoria...'}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="w-full py-4 rounded-xl gradient-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
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
