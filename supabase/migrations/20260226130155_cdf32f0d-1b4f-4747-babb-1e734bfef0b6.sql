
-- Create feedback_relatorios table
CREATE TABLE public.feedback_relatorios (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  matricula text not null,
  nome_relatorio text not null,
  tipo text not null,
  comentario text not null
);

ALTER TABLE public.feedback_relatorios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback_relatorios"
ON public.feedback_relatorios FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read feedback_relatorios"
ON public.feedback_relatorios FOR SELECT USING (true);

-- Create feedback_site table
CREATE TABLE public.feedback_site (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  matricula text not null,
  tipo text not null,
  comentario text not null
);

ALTER TABLE public.feedback_site ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback_site"
ON public.feedback_site FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read feedback_site"
ON public.feedback_site FOR SELECT USING (true);
