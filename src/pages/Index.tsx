import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Terminal } from 'lucide-react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HomePage from '@/components/portfolio/HomePage';
import ProjetosPage from '@/components/portfolio/ProjetosPage';
import AutomacoesPage from '@/components/portfolio/AutomacoesPage';
import ContatoPage from '@/components/portfolio/ContatoPage';

function Portfolio() {
  const [activeTab, setActiveTab] = useState('home');
  const { content } = useAdmin();
  const reduce = useReducedMotion();
  const navigate = (tab: string) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return <div className="min-h-screen bg-background"><Header activeTab={activeTab} onTabChange={navigate} /><main className="portal-shell"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>{activeTab === 'home' ? <HomePage onNavigate={navigate} /> : activeTab === 'projetos' ? <ProjetosPage /> : activeTab === 'automacoes' ? <AutomacoesPage /> : <ContatoPage />}</motion.div></AnimatePresence></main><footer className="border-t border-border bg-card/40"><div className="portal-shell flex flex-wrap items-center justify-between gap-5 py-7"><div><p className="flex items-center gap-2 font-mono text-xs text-muted-foreground"><Terminal className="size-4 text-primary" />guilherme.santiago<span className="text-accent">/</span>portfolio</p><p className="mt-2 text-[10px] text-muted-foreground">© {new Date().getFullYear()} {content.profileName}. Todos os direitos reservados.</p></div><div className="flex items-center gap-4"><span className="font-mono text-[10px] text-muted-foreground">v2.0.0 <span className="mx-2 text-border">/</span> Built for Performance</span><Button asChild size="icon" variant="ghost" aria-label="GitHub"><a href={content.githubUrl} target="_blank" rel="noopener noreferrer"><Github /></a></Button><Button asChild size="icon" variant="ghost" aria-label="LinkedIn"><a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin /></a></Button></div></div></footer></div>;
}
export default function Index() { return <AdminProvider><Portfolio /></AdminProvider>; }
