import { motion } from 'framer-motion';
import { Database, Code2, BarChart3, Bot, FileCode2, Globe, Linkedin, Github, Mail, MessageCircle, Download } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import GalaxyParticles from '@/components/GalaxyParticles';
import dataFlowImg from '@/assets/data-flow.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const stackItems = [
  { name: 'T-SQL', desc: 'Consultas avançadas, procedures e modelagem', icon: Database, color: 'text-cyan' },
  { name: 'Power BI', desc: 'Dashboards interativos e DAX avançado', icon: BarChart3, color: 'text-amber-400' },
  { name: 'Python', desc: 'Pandas, Selenium, Playwright, Streamlit', icon: Code2, color: 'text-teal-light' },
  { name: 'RPA', desc: 'Robôs de automação e web scraping', icon: Bot, color: 'text-fuchsia-400' },
  { name: 'HTML/CSS', desc: 'Personalização visual de painéis', icon: FileCode2, color: 'text-orange-400' },
  { name: 'Integrações', desc: 'Pipelines e integração de sistemas', icon: Globe, color: 'text-sky-400' },
];

const HomePage = () => {
  const { isAdmin, content, updateContent } = useAdmin();

  const EditableText = ({ value, field, className, multiline = false }: { value: string; field: keyof typeof content; className?: string; multiline?: boolean }) => {
    if (!isAdmin) return <span className={className}>{value}</span>;
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag
        className={`${className} bg-transparent border-b border-border/50 outline-none focus:border-accent w-full ${multiline ? 'resize-y min-h-[120px]' : ''}`}
        value={value as string}
        onChange={(e) => updateContent({ [field]: e.target.value } as any)}
      />
    );
  };

  return (
    <div className="space-y-24">
      {/* ============ HERO ============ */}
      <section className="relative rounded-3xl overflow-hidden border border-border/40">
        <img src={dataFlowImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        <GalaxyParticles />
        <div className="relative z-10 px-8 md:px-16 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12">
          {/* Photo */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative shrink-0">
            <div className="absolute -inset-3 rounded-full gradient-accent opacity-40 blur-2xl animate-pulse" />
            <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full p-1.5 gradient-accent shadow-2xl">
              <img
                src={content.profilePhoto || '/Guilherme.png'}
                alt={content.profileName}
                className="w-full h-full rounded-full object-cover border-4 border-background"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </div>
            {isAdmin && (
              <input
                className="mt-3 w-full text-xs bg-card/60 border border-border/50 rounded-lg px-2 py-1.5 text-muted-foreground outline-none focus:border-accent"
                value={content.profilePhoto}
                onChange={(e) => updateContent({ profilePhoto: e.target.value })}
                placeholder="URL da foto"
              />
            )}
          </motion.div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Portfólio Profissional
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">
              <EditableText value={content.profileName} field="profileName" className="font-display font-bold text-4xl md:text-6xl text-foreground" />
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-3 text-xl md:text-2xl font-display font-semibold text-gradient">
              <EditableText value={content.profileRole} field="profileRole" className="text-xl md:text-2xl font-display font-semibold text-gradient" />
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-5 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              <EditableText value={content.profileShortBio} field="profileShortBio" multiline className="text-muted-foreground text-base md:text-lg leading-relaxed" />
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-primary-foreground text-sm font-semibold shadow-lg hover:scale-105 transition-transform">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href={content.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card/70 border border-border/50 text-foreground text-sm font-semibold hover:border-accent/50 hover:scale-105 transition-all">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href={`mailto:${content.contactEmail}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card/70 border border-border/50 text-foreground text-sm font-semibold hover:border-accent/50 hover:scale-105 transition-all">
                <Mail className="w-4 h-4" /> E-mail
              </a>
              <a href={`https://wa.me/${content.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card/70 border border-border/50 text-foreground text-sm font-semibold hover:border-accent/50 hover:scale-105 transition-all">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ BIG NUMBERS ============ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {content.homeStats.map((stat, i) => (
          <motion.div key={stat.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card rounded-2xl p-7 text-center border border-border/40 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
            {isAdmin ? (
              <>
                <input className="w-full text-center font-display font-bold text-4xl md:text-5xl text-gradient bg-transparent outline-none border-b border-border/40 focus:border-accent" value={stat.value} onChange={(e) => updateContent({ homeStats: content.homeStats.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s) })} />
                <input className="w-full text-center mt-2 text-sm text-muted-foreground bg-transparent outline-none border-b border-border/40 focus:border-accent" value={stat.label} onChange={(e) => updateContent({ homeStats: content.homeStats.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s) })} />
              </>
            ) : (
              <>
                <p className="font-display font-bold text-4xl md:text-5xl text-gradient">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </>
            )}
          </motion.div>
        ))}
      </section>

      {/* ============ SOBRE MIM ============ */}
      <motion.section {...fadeUp} className="glass-card rounded-3xl p-8 md:p-12 border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gradient-accent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 max-w-4xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6">
            <EditableText value={content.aboutMeTitle} field="aboutMeTitle" className="font-display font-bold text-3xl md:text-4xl text-foreground" />
          </h2>
          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            {isAdmin ? (
              <textarea
                className="w-full min-h-[220px] bg-transparent border border-border/50 rounded-xl p-4 text-muted-foreground text-base leading-relaxed outline-none focus:border-accent resize-y"
                value={content.aboutMeText}
                onChange={(e) => updateContent({ aboutMeText: e.target.value })}
              />
            ) : (
              content.aboutMeText.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
            )}
          </div>
        </div>
      </motion.section>

      {/* ============ STACK ============ */}
      <section>
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Stack & <span className="text-gradient">Ferramentas</span></h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Tecnologias que uso no dia a dia para transformar dados em decisão.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stackItems.map((item, i) => (
            <motion.div key={item.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-card rounded-2xl p-6 border border-border/40 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">{item.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PERFIL COMPLETO (estilo currículo) ============ */}
      <motion.section {...fadeUp} className="relative rounded-3xl overflow-hidden border border-border/40">
        <div className="absolute inset-0 gradient-navy" />
        <GalaxyParticles />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Download className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">Perfil Profissional</h2>
          </div>
          {isAdmin ? (
            <textarea
              className="w-full min-h-[160px] bg-card/40 border border-border/50 rounded-xl p-4 text-foreground/90 text-base leading-relaxed outline-none focus:border-accent resize-y"
              value={content.profileBio}
              onChange={(e) => updateContent({ profileBio: e.target.value })}
            />
          ) : (
            <p className="text-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl">{content.profileBio}</p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
