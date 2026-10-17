import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Database, Code2, ExternalLink, Search, Plus, Settings2 } from 'lucide-react';
import { useAdmin, type Report } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import ReportDetailModal from '@/components/ReportDetailModal';
import CodeBlock from './CodeBlock';
import { filterProjects, projectCategories, projectStack, type ProjectCategory } from './project-utils';

export function CaseStudy({ report, onClose }: { report: Report | undefined; onClose: () => void }) {
  const { content } = useAdmin();
  const stack = report ? projectStack(report) : [];
  const python = stack.some(t => /python|rpa/i.test(t));
  const sqlCode = `-- Exemplo de modelagem analítica\nWITH indicadores AS (\n    SELECT\n        data_referencia,\n        unidade,\n        COUNT(*) AS total\n    FROM staging.operacoes\n    GROUP BY data_referencia, unidade\n)\nSELECT *\nFROM indicadores\nORDER BY data_referencia DESC;`;
  return <Sheet open={Boolean(report)} onOpenChange={open => { if (!open) onClose(); }}><SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl">
    {report && <><SheetHeader className="border-b border-border p-7 pr-12 text-left"><span className="eyebrow">PROJECT / {report.id.padStart(3, '0')}</span><SheetTitle className="text-2xl leading-snug">{report.name}</SheetTitle><SheetDescription>Estudo de projeto · {content.profileName}</SheetDescription></SheetHeader>
    <div className="space-y-8 p-7">
      {report.images[0] && <img src={report.images[0]} alt={`Painel ${report.name}`} className="w-full rounded-md border border-border object-contain" />}
      <section><h3 className="case-heading"><span>01</span> Contexto de negócio</h3><p className="mt-4 text-sm leading-7 text-muted-foreground whitespace-pre-line">{report.description || 'Descrição ainda não cadastrada.'}</p></section>
      <section><h3 className="case-heading"><span>02</span> Stack & solução técnica</h3><div className="mt-4 flex flex-wrap gap-2">{stack.map(tool => <span className="tech-badge" key={tool}>{tool}</span>)}</div><div className="my-5 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground"><span>Fonte de dados</span><ArrowRight className="size-4 text-primary" /><span>{python ? 'Processamento Python' : 'Modelagem analítica'}</span><ArrowRight className="size-4 text-primary" /><span>Visualização</span></div><p className="mb-3 font-mono text-xs text-muted-foreground">Referência técnica ilustrativa · não é o código deste projeto</p><CodeBlock code={python ? content.pythonCode : sqlCode} filename={python ? content.pythonCodeFilename : 'analytics_model.sql'} /></section>
      <section><h3 className="case-heading"><span>03</span> Indicadores & resultados</h3>{report.metrics.length ? <ul className="mt-4 divide-y divide-border">{report.metrics.map((metric, i) => <li key={i} className="flex items-start gap-3 py-3 text-sm text-foreground"><BarChart3 className="mt-0.5 size-4 shrink-0 text-accent" />{metric}</li>)}</ul> : <p className="mt-4 text-sm text-muted-foreground">Resultados quantitativos ainda não cadastrados.</p>}</section>
      {report.link && <Button asChild className="w-full"><a href={report.link} target="_blank" rel="noopener noreferrer">Abrir demonstração <ExternalLink /></a></Button>}
    </div></>}
  </SheetContent></Sheet>;
}

export default function ProjectCatalog({ compact = false, onViewAll }: { compact?: boolean; onViewAll?: () => void }) {
  const { content, isAdmin, addReport, updateContent } = useAdmin();
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<ProjectCategory>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [limit, setLimit] = useState(9);
  const filtered = filterProjects(content.reports, category, search);
  const visible = filtered.slice(0, compact ? 3 : limit);
  const report = content.reports.find(r => r.id === selected);
  return <section id="projects" className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">{compact ? '01 / SELECTED WORK' : 'PROJECT EXPLORER'}</span><h2 className="mt-3 text-2xl font-semibold md:text-3xl">{compact ? 'Soluções em destaque' : 'Projetos & estudos de caso'}<span className="ml-3 align-middle font-mono text-sm text-muted-foreground">/{content.reports.length.toString().padStart(2, '0')}</span></h2></div>{compact ? <Button variant="ghost" onClick={onViewAll} className="text-muted-foreground">Explorar todos <ArrowUpRight /></Button> : <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Buscar projetos" placeholder="Buscar projeto ou tecnologia" value={search} onChange={e => { setSearch(e.target.value); setLimit(9); }} className="pl-10" /></div>}</div>
    <div className="flex gap-1 overflow-x-auto border-b border-border pb-0" role="tablist" aria-label="Categorias de projetos">{projectCategories.map(cat => <Button role="tab" aria-selected={category === cat.id} key={cat.id} variant="ghost" onClick={() => { setCategory(cat.id); setLimit(9); }} className={`category-tab rounded-none px-4 pb-4 pt-3 text-xs ${category === cat.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>{cat.label}</Button>)}</div>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((item, i) => {
      const tools = projectStack(item); const Icon = tools.some(t => /python/i.test(t)) ? Code2 : tools.some(t => /sql/i.test(t)) ? Database : BarChart3;
      return <motion.article layout={!reduce} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.035 }} className="project-card group" key={item.id}>
        <div className="flex items-center justify-between px-5 pt-5"><span className="flex items-center gap-2 font-mono text-xs text-muted-foreground"><Icon className="size-4 text-primary" />{tools[0]}</span><span className="flex items-center gap-1.5 font-mono text-[10px] text-accent"><span className="size-1.5 rounded-full bg-accent" />{item.link ? 'DEMO DISPONÍVEL' : 'CASE STUDY'}</span></div>
        <Button variant="ghost" aria-label={`Ver estudo de caso: ${item.name}`} onClick={() => { setSelected(item.id); setEditing(false); }} className="project-preview relative mx-5 mt-5 flex h-auto w-[calc(100%-2.5rem)] overflow-hidden rounded border border-border p-0 hover:bg-secondary">
          {item.images[0] ? <img src={item.images[0]} alt={item.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]" /> : <div className="flex h-full w-full items-center justify-center gap-5 bg-secondary/50"><Database className="size-9 text-primary/60" /><ArrowRight className="size-5 text-muted-foreground" /><BarChart3 className="size-9 text-accent/60" /></div>}
          <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded bg-background/90 text-foreground transition-transform group-hover:-translate-y-1"><ArrowUpRight /></span>
        </Button>
        <div className="flex flex-1 flex-col p-5"><h3 className="text-lg font-semibold leading-7">{item.name}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">{item.description}</p><div className="mt-4 flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-muted-foreground">DATA</span><ArrowRight className="size-3 text-muted-foreground" />{tools.slice(0, 3).map(tool => <Button key={tool} size="sm" variant="ghost" onClick={() => { setSearch(tool); setCategory('all'); onViewAll?.(); }} className="tech-badge h-6 px-2 text-[10px]">{tool}</Button>)}</div>
        {item.metrics[0] && <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-accent"><BarChart3 className="mt-0.5 size-3.5 shrink-0" />{item.metrics[0]}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-5"><Button variant="ghost" className="h-8 px-0 text-xs hover:bg-transparent hover:text-primary" onClick={() => { setSelected(item.id); setEditing(false); }}>Ver estudo de caso <ArrowRight /></Button>{item.link && <Button asChild size="icon" variant="ghost" aria-label={`Abrir demonstração: ${item.name}`}><a href={item.link} target="_blank" rel="noopener noreferrer"><ExternalLink /></a></Button>}{isAdmin && <Button variant="ghost" size="icon" aria-label={`Editar ${item.name}`} onClick={() => { setSelected(item.id); setEditing(true); }}><Settings2 /></Button>}</div>
        {isAdmin && <div className="mt-3 flex flex-wrap gap-1 border-t border-border pt-3">{content.toolsOptions.map(tool => <Button key={tool} size="sm" variant="ghost" className={`h-6 px-2 text-[10px] ${item.tools?.includes(tool) ? 'bg-primary/15 text-primary' : 'text-muted-foreground'}`} onClick={() => updateContent({ reports: content.reports.map(r => r.id === item.id ? { ...r, tools: r.tools?.includes(tool) ? r.tools.filter(t => t !== tool) : [...(r.tools || []), tool] } : r) })}>{tool}</Button>)}</div>}
        </div>
      </motion.article>;
    })}</div>
    {!filtered.length && <div className="py-14 text-center"><Search className="mx-auto mb-4 size-7 text-muted-foreground" /><p className="text-muted-foreground">Nenhum projeto encontrado.</p><Button variant="link" onClick={() => { setSearch(''); setCategory('all'); }}>Limpar filtros</Button></div>}
    {!compact && filtered.length > limit && <div className="text-center"><Button variant="outline" onClick={() => setLimit(n => n + 9)}>Carregar mais projetos <ArrowDown /></Button></div>}
    {!compact && isAdmin && <Button variant="outline" onClick={() => addReport({ id: Date.now().toString(), name: 'Novo Projeto', creatorId: '3', description: '', images: [], metrics: [], tools: [] })}><Plus />Adicionar projeto</Button>}
    {editing && report ? <ReportDetailModal report={report} creatorName={content.profileName} onClose={() => setSelected(null)} showMetrics /> : <CaseStudy report={report} onClose={() => setSelected(null)} />}
  </section>;
}
