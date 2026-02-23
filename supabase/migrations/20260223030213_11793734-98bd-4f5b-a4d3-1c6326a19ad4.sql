
-- Create site_content table to store all site configuration
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read site content (public site)
CREATE POLICY "Anyone can read site content"
ON public.site_content
FOR SELECT
USING (true);

-- Allow everyone to insert site content (admin authenticated by app-level password)
CREATE POLICY "Anyone can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (true);

-- Allow everyone to update site content (admin authenticated by app-level password)
CREATE POLICY "Anyone can update site content"
ON public.site_content
FOR UPDATE
USING (true);

-- Insert default row
INSERT INTO public.site_content (id, content) VALUES ('main', '{}'::jsonb);
