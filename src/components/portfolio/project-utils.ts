import type { Report } from '@/contexts/AdminContext';

export const projectCategories = [
  { id: 'all', label: 'Todos' },
  { id: 'sql', label: 'T-SQL & Banco de Dados' },
  { id: 'python', label: 'Python & RPA' },
  { id: 'bi', label: 'Power BI & Analytics' },
  { id: 'web', label: 'Streamlit / Web Apps' },
] as const;
export type ProjectCategory = typeof projectCategories[number]['id'];
export function matchesCategory(report: Report, category: ProjectCategory) {
  if (category === 'all') return true;
  const tools = (report.tools || []).join(' ').toLowerCase();
  if (category === 'sql') return /sql|banco|etl/.test(tools);
  if (category === 'python') return /python|rpa|pandas|selenium|playwright/.test(tools);
  if (category === 'web') return /streamlit|web|html|css/.test(tools);
  return /power bi|dax|analytics|excel/.test(tools) || !tools;
}
export function filterProjects(reports: Report[], category: ProjectCategory, search = '') {
  const query = search.trim().toLocaleLowerCase('pt-BR');
  return reports.filter(report => matchesCategory(report, category) && (!query || `${report.name} ${report.description} ${(report.tools || []).join(' ')}`.toLocaleLowerCase('pt-BR').includes(query)));
}
export function projectStack(report: Report) { return report.tools?.length ? report.tools : ['Power BI']; }
