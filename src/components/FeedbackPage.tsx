import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Lightbulb, Send, ArrowLeft, FileText, Globe, CheckCircle, Sparkles, Heart } from 'lucide-react';
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Sugestões e Elogios</h2>
          </div>
          <p className="text-accent text-xl font-medium mb-2">Sua opinião é muito importante para nós!</p>
          <p className="text-primary-foreground/80 leading-relaxed text-lg">
            Compartilhe sua experiência com nosso site ou relatórios. Seja um elogio ou uma sugestão de melhoria, queremos ouvir você.
          </p>
        </div>
      </motion.section>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, label: 'Valorizamos cada opinião', color: 'from-rose-500 to-pink-500' },
          { icon: Sparkles, label: 'Melhorias contínuas', color: 'from-accent to-primary' },
          { icon: Send, label: 'Resposta em até 48h', color: 'from-blue-500 to-cyan-500' },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-border/50 flex items-center gap-4 hover:border-accent/30 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shrink-0`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-foreground font-medium text-base">{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Feedback Form */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-14 border-2 border-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary blur-[100px]" />
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="text-center py-16 space-y-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                    <CheckCircle className="w-24 h-24 text-accent mx-auto" />
                  </motion.div>
                  <h3 className="text-4xl font-display font-bold text-foreground">Obrigado pelo seu feedback!</h3>
                  <p className="text-muted-foreground text-xl max-w-md mx-auto">Sua mensagem foi enviada com sucesso. Agradecemos sua contribuição!</p>
                  <button onClick={reset} className="px-10 py-4 rounded-xl gradient-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-all shadow-lg">
                    Enviar outro feedback
                  </button>
                </motion.div>
              ) : !target ? (
                <motion.div key="target" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-accent mx-auto mb-5" />
                    <h3 className="text-3xl font-display font-bold text-foreground mb-3">Sobre o que gostaria de falar?</h3>
                    <p className="text-muted-foreground text-lg">Selecione uma opção abaixo para continuar</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <button
                      onClick={() => setTarget('site')}
                      className="group relative glass-card rounded-2xl p-10 border-2 border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.1), transparent 70%)' }} />
                      <div className="relative space-y-5 text-center">
                        <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto shadow-xl">
                          <Globe className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-foreground">Site</h4>
                        <p className="text-muted-foreground text-base">Falar sobre a experiência geral do site</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTarget('relatorio')}
                      className="group relative glass-card rounded-2xl p-10 border-2 border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.1), transparent 70%)' }} />
                      <div className="relative space-y-5 text-center">
                        <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto shadow-xl">
                          <FileText className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-foreground">Relatórios</h4>
                        <p className="text-muted-foreground text-base">Falar sobre um relatório específico</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : !tipo ? (
                <motion.div key="tipo" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10">
                  <button onClick={() => setTarget(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-base">
                    <ArrowLeft className="w-5 h-5" /> Voltar
                  </button>
                  <div className="text-center">
                    <h3 className="text-3xl font-display font-bold text-foreground mb-3">
                      {target === 'site' ? 'Feedback sobre o Site' : 'Feedback sobre Relatórios'}
                    </h3>
                    <p className="text-muted-foreground text-lg">É um elogio ou uma sugestão?</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <button
                      onClick={() => setTipo('elogio')}
                      className="group relative glass-card rounded-2xl p-10 border-2 border-border hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="relative space-y-5 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto shadow-lg">
                          <Star className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-foreground">Elogio</h4>
                        <p className="text-muted-foreground text-base">Quero elogiar algo que gostei</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTipo('sugestao')}
                      className="group relative glass-card rounded-2xl p-10 border-2 border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="relative space-y-5 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto shadow-lg">
                          <Lightbulb className="w-10 h-10 text-primary" />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-foreground">Sugestão</h4>
                        <p className="text-muted-foreground text-base">Tenho uma sugestão de melhoria</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <button onClick={() => setTipo(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-base">
                    <ArrowLeft className="w-5 h-5" /> Voltar
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tipo === 'elogio' ? 'bg-yellow-500/20' : 'bg-primary/20'}`}>
                      {tipo === 'elogio' ? <Star className="w-7 h-7 text-yellow-500" /> : <Lightbulb className="w-7 h-7 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground">
                        {tipo === 'elogio' ? 'Elogio' : 'Sugestão'} — {target === 'site' ? 'Site' : 'Relatório'}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-0.5">Preencha os campos abaixo</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-base font-medium text-foreground mb-2 block">Matrícula</label>
                      <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Digite sua matrícula"
                        className="w-full px-5 py-4 rounded-xl border-2 border-border bg-background text-foreground text-lg placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                      />
                    </div>

                    {target === 'relatorio' && (
                      <div>
                        <label className="text-base font-medium text-foreground mb-2 block">Relatório</label>
                        <select
                          value={nomeRelatorio}
                          onChange={(e) => setNomeRelatorio(e.target.value)}
                          className="w-full px-5 py-4 rounded-xl border-2 border-border bg-background text-foreground text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                        >
                          <option value="">Selecione um relatório</option>
                          {reports.map((r) => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-base font-medium text-foreground mb-2 block">Comentário</label>
                      <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder={tipo === 'elogio' ? 'Conte-nos o que você gostou...' : 'Compartilhe sua sugestão de melhoria...'}
                        rows={6}
                        className="w-full px-5 py-4 rounded-xl border-2 border-border bg-background text-foreground text-lg placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {error && <p className="text-destructive text-base font-medium">{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="w-full py-5 rounded-xl gradient-accent text-accent-foreground font-bold text-xl hover:opacity-90 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {sending ? 'Enviando...' : <><Send className="w-6 h-6" /> Enviar Feedback</>}
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
