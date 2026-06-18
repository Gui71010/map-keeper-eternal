import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Lightbulb, Send, ArrowLeft, FileText, Globe, CheckCircle, Sparkles, Heart, Quote, Search, ChevronDown, Check, ShieldCheck, HelpCircle, TrendingUp, MousePointerClick } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import GalaxyParticles from '@/components/GalaxyParticles';
import feedbackHeroImg from '@/assets/data-pipeline.jpg';

type FeedbackTarget = null | 'relatorio' | 'site';
type FeedbackType = null | 'elogio' | 'sugestao';

interface ReportComboboxProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

const ReportCombobox = ({ value, onChange, options }: ReportComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-muted/20 text-left text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all text-base flex items-center justify-between gap-2 hover:border-accent/40"
      >
        <span className={value ? 'text-foreground truncate' : 'text-muted-foreground/50'}>
          {value || 'Selecione um relatório'}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-xl border border-accent/30 shadow-2xl shadow-accent/10 overflow-hidden backdrop-blur-xl"
            style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 12%), hsl(215, 35%, 9%))' }}
          >
            <div className="p-2 border-b border-border/30">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar relatório..."
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground/60">Nenhum relatório encontrado</div>
              ) : (
                filtered.map((opt) => {
                  const selected = opt === value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { onChange(opt); setOpen(false); setQuery(''); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${
                        selected
                          ? 'bg-accent/15 text-accent'
                          : 'text-foreground/85 hover:bg-accent/10 hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      {selected && <Check className="w-4 h-4 text-accent shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated count-up number
const CountUp = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 900;
    const startTime = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display}</>;
};

// Confetti burst on success
const ConfettiBurst = () => {
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 600,
    y: -200 - Math.random() * 200,
    rot: Math.random() * 720 - 360,
    delay: Math.random() * 0.2,
    color: ['hsl(var(--accent))', 'hsl(45, 93%, 60%)', 'hsl(var(--primary))', 'hsl(174, 70%, 55%)', 'hsl(330, 80%, 65%)'][i % 5],
    size: 6 + Math.random() * 8,
  })), []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.size, height: p.size, background: p.color }}
        />
      ))}
    </div>
  );
};

const MIN_COMMENT = 10;

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
  const [pickerMode, setPickerMode] = useState<'lista' | 'galeria'>('lista');
  const reports = content.reports || [];

  // Live counters (real) + fictitious praise mural
  const [elogiosCount, setElogiosCount] = useState(0);
  const [sugestoesCount, setSugestoesCount] = useState(0);

  const fictionalPraise = useMemo(() => ([
    { id: 1, comentario: 'O time entrega análises incríveis com muita agilidade. Nota 10!' },
    { id: 2, comentario: 'A clareza das visualizações facilita muito a apresentação para a liderança.' },
    { id: 3, comentario: 'Parabéns pelo suporte! Sempre respondem rápido e com qualidade.' },
    { id: 4, comentario: 'O novo layout dos painéis ficou muito profissional e moderno.' },
    { id: 5, comentario: 'Dados confiáveis e bem organizados. Virou referência na área!' },
    { id: 6, comentario: 'Adoro a intuitividade dos dashboards, tudo muito fácil de encontrar.' },
    { id: 7, comentario: 'Excelente trabalho da equipe! Os indicadores mudaram nossa rotina.' },
    { id: 8, comentario: 'A experiência do site está linda e muito fluida. Continuem assim!' },
  ]), []);
  const recentPraise = fictionalPraise;

  const loadStats = async () => {
    const [{ data: rel }, { data: site }] = await Promise.all([
      supabase.from('feedback_relatorios').select('id, tipo').order('created_at', { ascending: false }),
      supabase.from('feedback_site').select('id, tipo').order('created_at', { ascending: false }),
    ]);
    const all = [...(rel || []), ...(site || [])];
    setElogiosCount(all.filter((f: any) => f.tipo === 'elogio').length);
    setSugestoesCount(all.filter((f: any) => f.tipo === 'sugestao').length);
  };

  useEffect(() => { loadStats(); }, []);

  const reset = () => { setTarget(null); setTipo(null); setMatricula(''); setNomeRelatorio(''); setComentario(''); setSent(false); setError(''); };

  const handleSubmit = async () => {
    if (!matricula.trim() || !comentario.trim() || !tipo) { setError('Preencha todos os campos obrigatórios.'); return; }
    if (comentario.trim().length < MIN_COMMENT) { setError(`O comentário precisa ter pelo menos ${MIN_COMMENT} caracteres.`); return; }
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
      loadStats();
    } catch { setError('Erro ao enviar feedback. Tente novamente.'); } finally { setSending(false); }
  };

  const stepVariants = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };

  const currentStep = sent ? 4 : tipo ? 3 : target ? 2 : 1;
  const stepLabels = ['Categoria', 'Tipo', 'Enviar', 'Pronto'];
  const progressPct = ((currentStep - 1) / (stepLabels.length - 1)) * 100;

  const commentLen = comentario.trim().length;
  const commentValid = commentLen >= MIN_COMMENT;

  return (
    <div className="space-y-12">
      {/* Hero with animated icons + dense particles */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16">
        <GalaxyParticles />
        <img src={feedbackHeroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        {/* Floating decorative icons */}
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-8 right-12 opacity-20">
          <Star className="w-10 h-10 text-accent" />
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-10 right-32 opacity-20">
          <Lightbulb className="w-12 h-12 text-accent" />
        </motion.div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="absolute top-16 left-20 opacity-15">
          <Heart className="w-8 h-8 text-accent" />
        </motion.div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Sugestões e Elogios</h2>
          </div>
          <p className="text-accent text-xl font-medium mb-2">Sua opinião é muito importante para nós!</p>
          <p className="text-primary-foreground/80 leading-relaxed text-lg">Compartilhe sua experiência com nosso site ou relatórios.</p>
        </div>
      </motion.section>

      {/* Live counters */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Star, label: 'Elogios recebidos', value: elogiosCount, color: 'from-amber-500 to-yellow-500' },
          { icon: Lightbulb, label: 'Sugestões enviadas', value: sugestoesCount, color: 'from-accent to-primary' },
          { icon: TrendingUp, label: 'Total de feedbacks', value: elogiosCount + sugestoesCount, color: 'from-emerald-500 to-teal-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring' }}
            className="glass-card rounded-2xl p-6 border border-border/30 hover:border-accent/40 transition-all duration-400 group flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
              <s.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-foreground"><CountUp value={s.value} /></div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Praise mural - marquee */}
      {recentPraise.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
              <Quote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">Mural de elogios recentes</h3>
              <p className="text-xs text-muted-foreground">Alguns exemplos de elogios da equipe</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border/30 py-5" style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 10%), hsl(215, 35%, 7%))' }}>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              {[...recentPraise, ...recentPraise].map((f, i) => (
                <div key={`${f.id}-${i}`} className="shrink-0 w-80 rounded-xl p-5 border border-accent/15 bg-muted/10">
                  <Star className="w-4 h-4 text-amber-400 mb-2" />
                  <p className="text-foreground/85 text-sm leading-relaxed italic line-clamp-3">"{f.comentario}"</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Main grid: form + FAQ sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-6xl mx-auto w-full">
        {/* Feedback Form */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
          {/* Animated progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepLabels.map((step, i) => (
                <span key={i} className={`text-xs font-medium transition-colors ${i + 1 <= currentStep ? 'text-accent' : 'text-muted-foreground/50'}`}>
                  {i + 1}. {step}
                </span>
              ))}
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)))', backgroundSize: '200% 100%' }}
                animate={{ width: `${progressPct}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ width: { duration: 0.6, ease: 'easeInOut' }, backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' } }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border/30 p-8 md:p-12 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 10%), hsl(215, 35%, 7%))' }}>
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary blur-[100px]" />
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="text-center py-16 space-y-8 relative">
                    <ConfettiBurst />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                      <CheckCircle className="w-20 h-20 text-accent mx-auto" />
                    </motion.div>
                    <h3 className="text-3xl font-display font-bold text-foreground">Obrigado pelo feedback!</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">Sua mensagem foi enviada com sucesso e já está com a equipe.</p>
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
                        { key: 'site' as const, icon: Globe, title: 'Site', desc: 'Experiência geral do site', colorFrom: 'hsl(199, 89%, 48%)', colorTo: 'hsl(217, 91%, 60%)' },
                        { key: 'relatorio' as const, icon: FileText, title: 'Relatórios', desc: 'Sobre um relatório específico', colorFrom: 'hsl(280, 75%, 60%)', colorTo: 'hsl(330, 80%, 58%)' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setTarget(opt.key)}
                          className="group relative rounded-2xl p-8 border border-border/30 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden"
                          style={{ background: 'hsl(215, 25%, 12% / 0.5)' }}
                        >
                          <div className="flex items-center gap-5">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0"
                              style={{ background: `linear-gradient(135deg, ${opt.colorFrom}, ${opt.colorTo})` }}
                            >
                              <opt.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xl font-display font-bold text-foreground leading-tight">{opt.title}</h4>
                              <p className="text-muted-foreground text-sm mt-1">{opt.desc}</p>
                            </div>
                            <MousePointerClick className="w-5 h-5 text-accent/70 shrink-0 animate-bounce" style={{ animationDuration: '1.6s' }} />
                          </div>
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
                          style={{ background: 'hsl(215, 25%, 12% / 0.5)' }}
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
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-foreground">Relatório</label>
                            <div className="inline-flex rounded-lg border border-border/50 bg-muted/20 p-0.5 text-xs">
                              <button type="button" onClick={() => setPickerMode('lista')} className={`px-3 py-1 rounded-md font-medium transition ${pickerMode === 'lista' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Lista</button>
                              <button type="button" onClick={() => setPickerMode('galeria')} className={`px-3 py-1 rounded-md font-medium transition ${pickerMode === 'galeria' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Galeria</button>
                            </div>
                          </div>
                          {pickerMode === 'lista' ? (
                            <ReportCombobox value={nomeRelatorio} onChange={setNomeRelatorio} options={reports.map((r) => r.name)} />
                          ) : (
                            <>
                              {!nomeRelatorio && (
                                <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 17h.01"/></svg>
                                  <p className="text-xs text-amber-200/90 leading-snug"><b className="text-amber-300">Selecione um relatório</b> clicando em uma das opções abaixo para continuar.</p>
                                </div>
                              )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1 rounded-xl border border-border/30 bg-muted/10">
                              {reports.map((r) => {
                                const selected = nomeRelatorio === r.name;
                                const thumb = r.images?.[0];
                                return (
                                  <button key={r.id} type="button" onClick={() => setNomeRelatorio(r.name)}
                                    className={`group relative rounded-xl overflow-hidden border transition-all text-left ${selected ? 'border-accent ring-2 ring-accent/40 shadow-lg shadow-accent/20' : 'border-border/30 hover:border-accent/40'}`}
                                    style={{ background: 'linear-gradient(160deg, hsl(222, 40%, 12%), hsl(215, 35%, 9%))' }}>
                                    <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                                      {thumb ? (
                                        <img src={thumb} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                      ) : (
                                        <FileText className="w-8 h-8 text-accent/50" />
                                      )}
                                    </div>
                                    <div className="p-2.5">
                                      <p className={`text-xs font-semibold leading-tight line-clamp-2 ${selected ? 'text-accent' : 'text-foreground/90'}`}>{r.name}</p>
                                    </div>
                                    {selected && (
                                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                                        <Check className="w-3.5 h-3.5 text-accent-foreground" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                              {reports.length === 0 && (
                                <p className="col-span-full text-center text-xs text-muted-foreground/60 py-6">Nenhum relatório cadastrado.</p>
                              )}
                            </div>
                            </>
                          )}
                          {nomeRelatorio && pickerMode === 'galeria' && (
                            <p className="mt-2 text-xs text-accent">Selecionado: <b>{nomeRelatorio}</b></p>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-foreground">Comentário</label>
                          <span className={`text-xs font-medium ${commentValid ? 'text-accent' : commentLen > 0 ? 'text-amber-400' : 'text-muted-foreground/60'}`}>
                            {commentLen}{commentLen < MIN_COMMENT ? ` / mín. ${MIN_COMMENT}` : ''} caracteres
                          </span>
                        </div>
                        <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
                          placeholder={tipo === 'elogio' ? 'Conte-nos o que você gostou...' : 'Compartilhe sua sugestão de melhoria...'} rows={5}
                          className={`w-full px-4 py-3.5 rounded-xl border bg-muted/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 transition-all resize-none text-base ${
                            commentLen > 0 && !commentValid ? 'border-amber-500/50 focus:border-amber-400 focus:ring-amber-400/30' : 'border-border/50 focus:border-accent focus:ring-accent/30'
                          }`} />
                        <div className="mt-2 h-1 rounded-full bg-muted/20 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${commentValid ? 'bg-accent' : 'bg-amber-400'}`}
                            animate={{ width: `${Math.min((commentLen / MIN_COMMENT) * 100, 100)}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
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

        {/* FAQ Sidebar */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="space-y-4">
          <div className="rounded-2xl p-6 border border-accent/20 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(174, 50%, 12% / 0.6), hsl(220, 40%, 10% / 0.8))' }}>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-display font-bold text-foreground">Como funciona?</h4>
              </div>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2"><span className="text-accent mt-0.5">•</span><span><b>Confidencial:</b> sua matrícula é usada apenas para acompanhamento interno.</span></li>
                <li className="flex gap-2"><span className="text-accent mt-0.5">•</span><span><b>Resposta rápida:</b> a equipe analisa em até 5 dias úteis.</span></li>
                <li className="flex gap-2"><span className="text-accent mt-0.5">•</span><span><b>Tudo conta:</b> elogios fortalecem o time e sugestões viram melhorias reais.</span></li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl p-6 border border-border/30" style={{ background: 'hsl(215, 25%, 10% / 0.6)' }}>
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-accent" />
              <h4 className="font-display font-bold text-foreground text-sm">Dúvidas frequentes</h4>
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">Posso enviar mais de um?</p>
                <p>Sim! Pode enviar quantos quiser, sempre que precisar.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">Receberei retorno?</p>
                <p>Sim, sempre que o feedback exigir resposta direta.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">É para reportar bug?</p>
                <p>Use o tipo <b>Sugestão</b> e descreva o problema com detalhes.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-accent/15 text-center" style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))' }}>
            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-foreground/80 leading-relaxed">Cada feedback recebido é lido pela equipe e ajuda a evoluir a nossa entrega.</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default FeedbackPage;
