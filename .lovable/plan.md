# Transformar o site em Portfólio — Guilherme Santiago

## Objetivo
Converter o site atual (People Analytics/BI da AeC) em um **portfólio pessoal profissional do Guilherme Santiago**, mantendo o tema galaxy (navy + teal/cyan), as animações e o sistema de admin/edição já existentes.

## Estrutura das novas abas

1. **Início (Home)**
   - Hero com foto do Guilherme, nome, título "Analista de Dados & Automação" e a bio curta (T-SQL • Power BI • Python • RPA)
   - Seção "Sobre Mim" com o texto completo fornecido
   - Big numbers: anos de experiência (~5), relatórios criados, automações, ferramentas dominadas
   - Stack de ferramentas com logos/ícones: T-SQL, Power BI, Python (Pandas, Selenium, Playwright, Streamlit), DAX, HTML/CSS

2. **Projetos & Relatórios**
   - Reaproveita o showcase holográfico atual de "Principais Projetos" como vitrine dos relatórios/dashboards do Guilherme
   - Cards de relatórios com filtros por ferramenta (Power BI, Python, SQL...) em vez de filtro por analista
   - Modal de detalhe mantido

3. **Automações em Python**
   - Seção dedicada (reaproveita a seção de automações atual) com cards de RPA, web scraping, pipelines
   - Bloco de código estilizado

4. **Contato**
   - Substitui a aba de sugestões: formulário de contato + links (LinkedIn, GitHub, e-mail, WhatsApp)
   - Reaproveita o wizard visual e o confete

## O que será removido/substituído
- Organograma, mapa do Brasil, chamados GestaoX, áreas elegíveis, RQ, FAQ de relatórios, "Nossa Área" institucional
- Header: "AeC - People Analytics" → "Guilherme Santiago — Data & Automation"
- Footer mantém créditos de desenvolvimento

## O que será mantido
- Tema galaxy, partículas, animações, fontes
- AdminContext com edição inline + auto-save no backend
- Textos fornecidos pelo usuário (perfil, sobre mim, bio curta) como conteúdo padrão editável

## Execução
- Fase 1: novo conteúdo padrão no AdminContext (perfil, sobre, bio, skills)
- Fase 2: nova Home (hero + sobre + stack + números)
- Fase 3: adaptar aba de projetos/relatórios e automações
- Fase 4: aba Contato + limpeza de seções removidas
- Verificação de build ao final
