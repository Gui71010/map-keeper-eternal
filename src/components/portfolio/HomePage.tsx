import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github, Linkedin, Database, Workflow, BarChart3, Terminal, Check, GitBranch } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import ProjectCatalog from './ProjectCatalog';
import TechArchitecture from './TechArchitecture';

export default function HomePage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { isAdmin, content, updateContent } = useAdmin();
  const reduce = useReducedMotion();
  const stats = content.homeStats;
  return <div>
    <section className="overview-hero relative border-b border-border pb-10 pt-8 md:pb-12 md:pt-12">
      <div className="mb-9 flex items-center justify-between gap-4 font-mono text-[10px] text-muted-foreground md:text-xs"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-accent" />PORTFOLIO / DATA & AUTOMATION</span><span className="hidden sm:block">PRECISION IN DATA. IMPACT IN BUSINESS.</span></div>
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] xl:gap-20">
        <motion.div initial={reduce ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-7 flex items-center gap-3"><img src={content.profilePhoto || '/Guilherme.png'} alt={content.profileName} className="size-12 rounded-md border border-border object-cover" /><div><div className="text-base font-semibold">{isAdmin ? <input aria-label="Nome profissional" className="admin-inline" value={content.profileName} onChange={e => updateContent({ profileName: e.target.value })} /> : content.profileName}</div><p className="mt-1 font-mono text-[10px] text-muted-foreground">{isAdmin ? <input className="admin-inline" value={content.profileRole} onChange={e => updateContent({ profileRole: e.target.value })} /> : content.profileRole}</p></div></div>
          <h1 className="hero-heading font-semibold">Data Engineering,<br />Advanced Analytics<span className="block text-muted-foreground">& Process Automation<span className="text-primary">.</span></span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">Arquitetando pipelines de dados em T-SQL, automações robustas em Python e ecossistemas analíticos em Power BI para otimização de decisões estratégicas.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3"><Button onClick={() => onNavigate('projetos')} className="h-11 px-5">Explorar projetos <ArrowUpRight /></Button><Button variant="outline" onClick={() => onNavigate('contato')} className="h-11 px-5">Vamos conversar <ArrowRight /></Button><div className="ml-1 flex items-center gap-1"><Button asChild variant="ghost" size="icon" aria-label="LinkedIn"><a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin /></a></Button><Button asChild variant="ghost" size="icon" aria-label="GitHub"><a href={content.githubUrl} target="_blank" rel="noopener noreferrer"><Github /></a></Button></div></div>
          {isAdmin && <div className="mt-4 space-y-2"><input className="admin-inline text-xs" aria-label="Foto profissional" value={content.profilePhoto} onChange={e => updateContent({ profilePhoto: e.target.value })} /><textarea className="admin-inline text-xs" aria-label="Bio curta" value={content.profileShortBio} onChange={e => updateContent({ profileShortBio: e.target.value })} /></div>}
        </motion.div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="architecture-console relative">
          <div className="console-bar"><span className="flex items-center gap-2"><Terminal className="size-3.5" />pipeline.overview</span><span className="flex items-center gap-1.5 text-accent"><span className="size-1.5 rounded-full bg-accent" />END-TO-END</span></div>
          <div className="console-grid px-5 py-6 md:px-7 md:py-8"><div className="mb-5 flex items-center justify-between font-mono text-[10px] text-muted-foreground"><span>DATA ARCHITECTURE</span><GitBranch className="size-4" /></div>
            {[
              { icon: Database, title: 'Ingest & Model', subtitle: 'T-SQL · ETL · Stored Procedures', tone: 'text-primary', n: '01' },
              { icon: Workflow, title: 'Process & Automate', subtitle: 'Python · Pandas · Playwright', tone: 'text-accent', n: '02' },
              { icon: BarChart3, title: 'Analyze & Deliver', subtitle: 'Power BI · DAX · HTML/CSS', tone: 'text-signal', n: '03' },
            ].map((node, i) => <div key={node.n}><div className="pipeline-node flex items-center gap-4 rounded-md border border-border bg-background/90 p-4"><div className={`flex size-10 shrink-0 items-center justify-center rounded border border-border bg-secondary ${node.tone}`}><node.icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{node.title}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{node.subtitle}</p></div><span className="font-mono text-[10px] text-muted-foreground">{node.n}</span><Check className="size-3.5 text-accent" /></div>{i < 2 && <div className="flow-connector ml-9 h-7 w-px bg-border" />}</div>)}
            <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] leading-6"><span className="text-muted-foreground">$ </span><span className="text-code">build solutions --with-impact</span><span className="terminal-cursor ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" /></div>
          </div>
          <div className="console-bar border-t border-border"><span>SQL / PYTHON / BI</span><span className="flex items-center gap-1.5"><Check className="size-3 text-accent" />Designed for scale</span></div>
        </motion.div>
      </div>
    </section>
    <section aria-label="Indicadores profissionais" className="mb-12 grid grid-cols-2 border-b border-border md:mb-16 lg:grid-cols-4">{stats.map((stat, i) => <div className={`stat-cell px-4 py-7 md:px-7 ${i ? 'border-l border-border' : ''}`} key={stat.id}><span className="font-mono text-[10px] text-muted-foreground">0{i + 1} / EXPERIENCE & DELIVERY</span>{isAdmin ? <><input className="admin-inline mt-3 text-3xl font-semibold" value={stat.value} onChange={e => updateContent({ homeStats: stats.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s) })} /><input className="admin-inline mt-2 text-xs" value={stat.label} onChange={e => updateContent({ homeStats: stats.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s) })} /></> : <><p className="mt-3 font-mono text-3xl font-medium md:text-4xl">{stat.value}<span className="ml-2 text-sm text-primary">↗</span></p><p className="mt-2 text-xs text-muted-foreground">{stat.label}</p></>}</div>)}</section>
    <ProjectCatalog compact onViewAll={() => onNavigate('projetos')} />
    <div className="mt-12"><TechArchitecture /></div>
    <section className="grid gap-8 border-t border-border py-12 md:py-16 lg:grid-cols-[0.75fr_1.5fr]"><div><span className="eyebrow">03 / BEHIND THE WORK</span><h2 className="mt-3 text-2xl font-semibold">{isAdmin ? <input className="admin-inline" value={content.aboutMeTitle} onChange={e => updateContent({ aboutMeTitle: e.target.value })} /> : content.aboutMeTitle}</h2><p className="mt-4 font-mono text-xs text-primary">Dados. Código. Decisões.</p></div><div className="space-y-4 text-sm leading-8 text-muted-foreground">{isAdmin ? <textarea className="admin-inline min-h-40" value={content.aboutMeText} onChange={e => updateContent({ aboutMeText: e.target.value })} /> : content.aboutMeText.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}<details className="border-t border-border pt-4"><summary className="cursor-pointer text-xs font-medium text-foreground">Perfil profissional completo</summary>{isAdmin ? <textarea className="admin-inline mt-4 min-h-40" value={content.profileBio} onChange={e => updateContent({ profileBio: e.target.value })} /> : <p className="mt-4">{content.profileBio}</p>}</details></div></section>
    <section className="flex flex-wrap items-center justify-between gap-6 border-t border-border py-10"><div><span className="eyebrow">LET’S BUILD SOMETHING THAT MATTERS</span><h2 className="mt-3 text-xl font-semibold md:text-2xl">Seu próximo desafio de dados começa aqui.</h2></div><Button variant="outline" onClick={() => onNavigate('contato')}>Entrar em contato <ArrowUpRight /></Button></section>
  </div>;
}
