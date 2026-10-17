import { useState } from 'react';
import { Database, Workflow, BarChart3, GitBranch, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';

const layers = [
  { name: 'Data & Database', code: '01', icon: Database, summary: 'Da origem ao modelo. Dados preparados para responder às perguntas certas.', tools: ['T-SQL', 'CTEs', 'Window Functions', 'Stored Procedures', 'Star Schema', 'Query Optimization'], tone: 'text-primary' },
  { name: 'Automation & Scripting', code: '02', icon: Workflow, summary: 'Processos repetíveis, integrações confiáveis e menos intervenção manual.', tools: ['Python', 'Pandas', 'Selenium', 'Playwright', 'PyODBC', 'Web Scraping'], tone: 'text-accent' },
  { name: 'Analytics & Visualization', code: '03', icon: BarChart3, summary: 'Métricas bem definidas. Interfaces que tornam o dado uma decisão.', tools: ['Power BI', 'DAX', 'Power Query (M)', 'HTML/CSS', 'Data Visualization'], tone: 'text-signal' },
  { name: 'Tools & Delivery', code: '04', icon: GitBranch, summary: 'Versionamento, publicação e evolução contínua das soluções.', tools: ['Git', 'GitHub', 'Streamlit', 'Gateways', 'CI/CD básico', 'Trello / Jira'], tone: 'text-foreground' },
];
export default function TechArchitecture() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const layer = layers[active];
  return <section id="architecture" className="border-t border-border py-12 md:py-16">
    <div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">02 / ENGINEERING STACK</span><h2 className="mt-3 text-2xl font-semibold md:text-3xl">Uma visão de ponta a ponta.</h2></div><span className="font-mono text-xs text-muted-foreground">SOURCE → PROCESS → INSIGHT</span></div>
    <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{layers.map((item, i) => <Button key={item.code} variant="ghost" onClick={() => setActive(i)} aria-pressed={active === i} className={`layer-card h-auto min-h-32 flex-col items-start whitespace-normal rounded-md border p-5 text-left ${active === i ? 'border-primary/60 bg-primary/5' : 'border-border bg-card hover:bg-secondary/50'}`}><span className="flex w-full items-center justify-between"><item.icon className={`size-5 ${item.tone}`} /><span className="font-mono text-xs text-muted-foreground">{item.code}</span></span><span className="mt-4 text-sm font-semibold">{item.name}</span><span className="mt-1 font-mono text-[10px] font-normal text-muted-foreground">{item.tools.slice(0, 3).join(' / ')}</span></Button>)}</div>
      <div className="border-l border-border pl-6"><div className="flex items-center gap-2 font-mono text-xs text-accent"><Check className="size-3.5" />{layer.code} / TECHNICAL CAPABILITIES</div><motion.div key={active} initial={reduce ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}><h3 className="mb-3 mt-7 text-xl font-semibold">{layer.name}</h3><p className="max-w-md text-sm leading-7 text-muted-foreground">{layer.summary}</p><div className="mt-6 flex flex-wrap gap-2">{layer.tools.map(tool => <span className="tech-badge px-3 py-1.5" key={tool}>{tool}</span>)}</div><div className="mt-7 flex items-center gap-3 font-mono text-xs text-muted-foreground"><layer.icon className={`size-4 ${layer.tone}`} /><span>{layer.tools[0]}</span><ArrowRight className="size-4" /><span>Business value</span></div></motion.div></div>
    </div>
  </section>;
}
