import { motion } from 'framer-motion';
import { Bot, Zap, Code2, Sparkles } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import GalaxyParticles from '@/components/GalaxyParticles';
import pythonHero from '@/assets/python-automation-hero.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const AutomacoesPage = () => {
  const { isAdmin, content, updateContent } = useAdmin();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-border/40">
        <img src={pythonHero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        <GalaxyParticles />
        <div className="relative z-10 px-8 md:px-16 py-14 md:py-20">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold tracking-widest uppercase mb-5">
            <Bot className="w-3.5 h-3.5" />
            {isAdmin ? (
              <input className="bg-transparent outline-none border-b border-accent/40 text-accent text-xs font-semibold uppercase" value={content.pythonTag} onChange={(e) => updateContent({ pythonTag: e.target.value })} />
            ) : content.pythonTag}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-bold text-4xl md:text-5xl text-foreground">
            {isAdmin ? (
              <input className="w-full bg-transparent outline-none border-b border-border/50 focus:border-accent font-display font-bold text-4xl md:text-5xl text-foreground" value={content.pythonTitle} onChange={(e) => updateContent({ pythonTitle: e.target.value })} />
            ) : (
              <>{content.pythonTitle.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{content.pythonTitle.split(' ').slice(-1)}</span></>
            )}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 text-muted-foreground text-lg max-w-3xl leading-relaxed">
            {isAdmin ? (
              <textarea className="w-full min-h-[100px] bg-transparent border border-border/50 rounded-xl p-3 text-muted-foreground text-base outline-none focus:border-accent resize-y" value={content.pythonDescription} onChange={(e) => updateContent({ pythonDescription: e.target.value })} />
            ) : content.pythonDescription}
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.pythonCards.map((card, i) => (
          <motion.div key={card.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card rounded-2xl p-7 border border-border/40 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="inline-block px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold mb-4">
              {isAdmin ? (
                <input className="bg-transparent outline-none text-accent text-xs font-semibold w-20" value={card.tag} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(c => c.id === card.id ? { ...c, tag: e.target.value } : c) })} />
              ) : card.tag}
            </span>
            <h3 className="font-display font-bold text-xl text-foreground">
              {isAdmin ? (
                <input className="w-full bg-transparent outline-none border-b border-border/40 focus:border-accent font-display font-bold text-xl text-foreground" value={card.title} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(c => c.id === card.id ? { ...c, title: e.target.value } : c) })} />
              ) : card.title}
            </h3>
            <p className="text-sm text-accent/80 font-medium mt-0.5">
              {isAdmin ? (
                <input className="w-full bg-transparent outline-none border-b border-border/40 focus:border-accent text-sm text-accent/80" value={card.subtitle} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(c => c.id === card.id ? { ...c, subtitle: e.target.value } : c) })} />
              ) : card.subtitle}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {isAdmin ? (
                <textarea className="w-full min-h-[80px] bg-transparent border border-border/40 rounded-lg p-2 text-sm text-muted-foreground outline-none focus:border-accent resize-y" value={card.desc} onChange={(e) => updateContent({ pythonCards: content.pythonCards.map(c => c.id === card.id ? { ...c, desc: e.target.value } : c) })} />
              ) : card.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Code block + Impact */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div {...fadeUp} className="rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
          <div className="flex items-center gap-2 px-5 py-3 bg-card/90 border-b border-border/40">
            <span className="w-3 h-3 rounded-full bg-destructive/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-accent/70" />
            <span className="ml-3 text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              {isAdmin ? (
                <input className="bg-transparent outline-none border-b border-border/40 focus:border-accent text-xs font-mono text-muted-foreground" value={content.pythonCodeFilename} onChange={(e) => updateContent({ pythonCodeFilename: e.target.value })} />
              ) : content.pythonCodeFilename}
            </span>
          </div>
          {isAdmin ? (
            <textarea
              className="w-full min-h-[320px] bg-[hsl(222,47%,6%)] p-6 font-mono text-sm text-teal-light outline-none resize-y"
              value={content.pythonCode}
              onChange={(e) => updateContent({ pythonCode: e.target.value })}
            />
          ) : (
            <pre className="bg-[hsl(222,47%,6%)] p-6 font-mono text-sm text-teal-light overflow-x-auto leading-relaxed min-h-[320px]">
              <code>{content.pythonCode}</code>
            </pre>
          )}
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="glass-card rounded-2xl p-8 border border-border/40">
          <h3 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            {isAdmin ? (
              <input className="bg-transparent outline-none border-b border-border/40 focus:border-accent font-display font-bold text-2xl text-foreground" value={content.pythonImpactTitle} onChange={(e) => updateContent({ pythonImpactTitle: e.target.value })} />
            ) : content.pythonImpactTitle}
          </h3>
          <div className="space-y-5">
            {content.pythonImpactItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-xl gradient-accent flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  {isAdmin ? (
                    <>
                      <input className="w-full bg-transparent outline-none border-b border-border/40 focus:border-accent font-semibold text-foreground" value={item.t} onChange={(e) => updateContent({ pythonImpactItems: content.pythonImpactItems.map(x => x.id === item.id ? { ...x, t: e.target.value } : x) })} />
                      <input className="w-full bg-transparent outline-none border-b border-border/40 focus:border-accent text-sm text-muted-foreground mt-1" value={item.d} onChange={(e) => updateContent({ pythonImpactItems: content.pythonImpactItems.map(x => x.id === item.id ? { ...x, d: e.target.value } : x) })} />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-foreground">{item.t}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.d}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AutomacoesPage;
