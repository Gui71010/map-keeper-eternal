import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Analyst {
  id: string;
  name: string;
  role: string;
  area: string;
  photo: string;
  bio: string;
  type?: 'bi' | 'admin' | 'design' | 'manager';
}

export interface Report {
  id: string;
  name: string;
  creatorId: string;
  description: string;
  images: string[];
  metrics: string[];
  link?: string;
  eligibleAreas?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface AreaReportCard {
  id: string;
  area: string;
  count: number;
  icon: string;
}

export interface MapCity {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MapState {
  id: string;
  stateCode: string;
  stateName: string;
  cities: MapCity[];
}

interface SiteContent {
  areaDescription: string;
  faqDescription: string;
  portfolioDescription: string;
  directoryEmail: string;
  analysts: Analyst[];
  reports: Report[];
  aboutUsTitle: string;
  aboutUsText: string;
  analystIntroText: string;
  orgChartUrl: string;
  orgChartTitle: string;
  areaTitle: string;
  portfolioTitle: string;
  faqTitle: string;
  faqSubtitle: string;
  portfolioSubtitle: string;
  biAnalystsTitle: string;
  adminAnalystsTitle: string;
  designAnalystsTitle: string;
  managerTitle: string;
  filterByAnalystTitle: string;
  ourAnalystsTitle: string;
  mapStates: MapState[];
  projects: Project[];
  areaReportCards: AreaReportCard[];
}

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  content: SiteContent;
  updateContent: (content: Partial<SiteContent>) => void;
  addAnalyst: (analyst: Analyst) => void;
  updateAnalyst: (id: string, data: Partial<Analyst>) => void;
  removeAnalyst: (id: string) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  removeReport: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addAreaReportCard: (card: AreaReportCard) => void;
  updateAreaReportCard: (id: string, data: Partial<AreaReportCard>) => void;
  removeAreaReportCard: (id: string) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  areaDescription:
    'Nossa área de Business Intelligence atua dentro da Diretoria de Pessoas, sendo responsável por transformar dados em insights estratégicos para a tomada de decisão. A equipe é composta por analistas especializados em diferentes squads, cada um focado em uma vertical do negócio.',
  faqDescription:
    'Bem-vindo ao FAQ dos Relatórios! Aqui você pode explorar as métricas de cada relatório criado pelo nosso time de dados. Selecione um analista para filtrar os relatórios por responsável e clique em qualquer relatório para ver seus detalhes e métricas.',
  portfolioDescription:
    'Conheça todos os relatórios produzidos pela nossa equipe de Business Intelligence. Selecione um analista para filtrar ou navegue por todo o portfólio.',
  directoryEmail: 'diretoria.pessoas@aec.com.br',
  aboutUsTitle: 'O que fazemos',
  aboutUsText:
    '• Governança dos dados provenientes das áreas de Treinamento, Recrutamento, BP e DHO.\n\n• Construção, validação e garantia da assertividade dos indicadores de RH.\n\n• Gestão de todos os relatórios (Orbi) da Diretoria de Pessoas:\n  ✓ 28 relatórios ativos;\n  ✓ 3 relatórios em produção;\n  ✓ 9 relatórios a iniciar.\n\n• Análises e diagnósticos dos números de RH para fornecer informações para tomada de decisão da Diretoria.\n\n• Produção de apresentações executivas.\n\n• Produção de relatórios para as áreas.',
  analystIntroText: 'Conheça abaixo os analistas da nossa área e suas respectivas atribuições.',
  orgChartUrl: '',
  orgChartTitle: 'Organograma da Equipe',
  areaTitle: 'Nossa Área',
  portfolioTitle: 'Relatórios Criados',
  faqTitle: 'FAQ dos Relatórios',
  faqSubtitle: 'Métricas e detalhes dos nossos relatórios',
  portfolioSubtitle: 'AeC - Diretoria de Pessoas - People Analytics',
  biAnalystsTitle: 'Analistas de BI',
  adminAnalystsTitle: 'Analistas Administrativos',
  designAnalystsTitle: 'Analista de Design Gráfico',
  managerTitle: 'Gerente da Área',
  filterByAnalystTitle: 'Filtrar por Analista',
  ourAnalystsTitle: 'Nossos Analistas',
  mapStates: [
    { id: '1', stateCode: 'MG', stateName: 'Minas Gerais', cities: [{ id: '1', name: 'Belo Horizonte', imageUrl: 'https://images.unsplash.com/photo-1611605645802-0cb2e8284d49?w=400&h=300&fit=crop' }] },
    { id: '2', stateCode: 'RN', stateName: 'Rio Grande do Norte', cities: [{ id: '2', name: 'Natal', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }] },
    { id: '3', stateCode: 'PB', stateName: 'Paraíba', cities: [{ id: '3', name: 'João Pessoa', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }] },
    { id: '4', stateCode: 'SP', stateName: 'São Paulo', cities: [{ id: '4', name: 'São Paulo', imageUrl: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=400&h=300&fit=crop' }] },
    { id: '5', stateCode: 'BA', stateName: 'Bahia', cities: [{ id: '5', name: 'Salvador', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }] },
  ],
  analysts: [
    { id: '0', name: 'Rogério', role: 'Gerente', area: 'People Analytics', photo: '', bio: 'Gerente da área de People Analytics.', type: 'manager' },
    { id: '1', name: 'Allyson Nunes', role: 'Analista de BI', area: 'Treinamento', photo: '', bio: 'Responsável pelos relatórios de treinamento e desenvolvimento de pessoas.', type: 'bi' },
    { id: '2', name: 'Alessa Kettney', role: 'Analista de BI', area: 'Medicina e Business Partner', photo: '', bio: 'Responsável pelos relatórios de medicina ocupacional e atuação como Business Partner.', type: 'bi' },
    { id: '3', name: 'Guilherme Santiago', role: 'Analista de BI', area: 'Recrutamento e Seleção', photo: '', bio: 'Responsável pelos relatórios de recrutamento, seleção e funil admissional.', type: 'bi' },
    { id: '4', name: 'Matheus Wilson', role: 'Analista de BI', area: 'Corporativo', photo: '', bio: 'Responsável pelos relatórios corporativos e indicadores estratégicos.', type: 'bi' },
    { id: '5', name: 'Laura', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Analista administrativo da equipe de People Analytics.', type: 'admin' },
    { id: '6', name: 'Henrique', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Analista administrativo da equipe de People Analytics.', type: 'admin' },
    { id: '7', name: 'Junior', role: 'Analista de Design Gráfico', area: 'Design', photo: '', bio: 'Analista de design gráfico da equipe de People Analytics.', type: 'design' },
  ],
  reports: [
    { id: '1', name: 'Gestão Candidato SOU', creatorId: '3', description: 'Funil admissional completo com métricas de inscritos, aprovados e contratados.', images: [], metrics: ['Inscritos Vaga: 10.691', 'Aprovados: 10.428', 'Doc Aprovado: 4.294', 'Assinatura Contrato: 3.566'], link: '', eligibleAreas: [] },
    { id: '2', name: 'Treinamento Corporativo', creatorId: '1', description: 'Acompanhamento de horas de treinamento e eficácia dos programas.', images: [], metrics: ['Horas Totais: 5.200', 'Participantes: 1.340'], link: '', eligibleAreas: [] },
    { id: '3', name: 'Indicadores de Saúde', creatorId: '2', description: 'Relatório de medicina ocupacional com indicadores de saúde dos colaboradores.', images: [], metrics: ['Exames Realizados: 3.800', 'Atestados: 420'], link: '', eligibleAreas: [] },
    { id: '4', name: 'Headcount Corporativo', creatorId: '4', description: 'Análise de headcount e movimentações de pessoal.', images: [], metrics: ['Headcount: 8.500', 'Turnover: 2.3%'], link: '', eligibleAreas: [] },
  ],
  projects: [
    { id: '1', title: 'Dashboard de People Analytics', description: 'Painel centralizado com indicadores estratégicos de RH.', imageUrl: '' },
    { id: '2', title: 'Automação de Relatórios', description: 'Sistema automatizado de geração e distribuição de relatórios.', imageUrl: '' },
  ],
  areaReportCards: [
    { id: '1', area: 'Treinamento', count: 5, icon: '📚' },
    { id: '2', area: 'Recrutamento', count: 8, icon: '🎯' },
    { id: '3', area: 'Corporativo', count: 6, icon: '🏢' },
    { id: '4', area: 'Medicina', count: 4, icon: '🏥' },
  ],
};

const ADMIN_PASSWORD = 'Guisantos88';

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load content from database on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'main')
          .maybeSingle();

        if (error) {
          console.error('Error loading content:', error);
          setLoaded(true);
          return;
        }

        if (data && data.content && typeof data.content === 'object' && Object.keys(data.content as object).length > 0) {
          const dbContent = data.content as Record<string, unknown>;
          setContent({ ...DEFAULT_CONTENT, ...dbContent } as SiteContent);
        }
        setLoaded(true);
      } catch (err) {
        console.error('Error loading content:', err);
        setLoaded(true);
      }
    };

    loadContent();
  }, []);

  // Save content to database with debounce
  const saveToDb = useCallback(async (newContent: SiteContent) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({
            id: 'main',
            content: newContent as any,
            updated_at: new Date().toISOString(),
          } as any);

        if (error) {
          console.error('Error saving content:', error);
        } else {
          console.log('Content saved successfully');
        }
      } catch (err) {
        console.error('Error saving content:', err);
      }
    }, 500);
  }, []);

  // Save every content change to database
  useEffect(() => {
    if (loaded) {
      saveToDb(content);
    }
  }, [content, loaded, saveToDb]);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_auth');
  };

  const updateContent = (partial: Partial<SiteContent>) => setContent(prev => ({ ...prev, ...partial }));

  const addAnalyst = (analyst: Analyst) => setContent(prev => ({ ...prev, analysts: [...prev.analysts, analyst] }));
  const updateAnalyst = (id: string, data: Partial<Analyst>) =>
    setContent(prev => ({ ...prev, analysts: prev.analysts.map((a) => (a.id === id ? { ...a, ...data } : a)) }));
  const removeAnalyst = (id: string) =>
    setContent(prev => ({ ...prev, analysts: prev.analysts.filter((a) => a.id !== id) }));

  const addReport = (report: Report) => setContent(prev => ({ ...prev, reports: [...prev.reports, report] }));
  const updateReport = (id: string, data: Partial<Report>) =>
    setContent(prev => ({ ...prev, reports: prev.reports.map((r) => (r.id === id ? { ...r, ...data } : r)) }));
  const removeReport = (id: string) =>
    setContent(prev => ({ ...prev, reports: prev.reports.filter((r) => r.id !== id) }));

  const addProject = (project: Project) => setContent(prev => ({ ...prev, projects: [...prev.projects, project] }));
  const updateProject = (id: string, data: Partial<Project>) =>
    setContent(prev => ({ ...prev, projects: prev.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) }));
  const removeProject = (id: string) =>
    setContent(prev => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));

  const addAreaReportCard = (card: AreaReportCard) => setContent(prev => ({ ...prev, areaReportCards: [...(prev.areaReportCards || []), card] }));
  const updateAreaReportCard = (id: string, data: Partial<AreaReportCard>) =>
    setContent(prev => ({ ...prev, areaReportCards: (prev.areaReportCards || []).map((c) => (c.id === id ? { ...c, ...data } : c)) }));
  const removeAreaReportCard = (id: string) =>
    setContent(prev => ({ ...prev, areaReportCards: (prev.areaReportCards || []).filter((c) => c.id !== id) }));

  return (
    <AdminContext.Provider
      value={{ isAdmin, login, logout, content, updateContent, addAnalyst, updateAnalyst, removeAnalyst, addReport, updateReport, removeReport, addProject, updateProject, removeProject, addAreaReportCard, updateAreaReportCard, removeAreaReportCard }}
    >
      {children}
    </AdminContext.Provider>
  );
};
