-- Script SQL para criação da tabela landing_pages
-- Executar este script no Editor SQL do seu painel do Supabase.

CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  profissao TEXT NOT NULL,
  cidade TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  bio TEXT NOT NULL,
  cor_tema TEXT NOT NULL,
  foto_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- 1. Política de Leitura Pública (Qualquer pessoa pode visualizar as Landing Pages)
CREATE POLICY "Permitir leitura pública" 
  ON public.landing_pages 
  FOR SELECT 
  USING (true);

-- 2. Política de Inserção Pública (Qualquer pessoa pode criar uma nova Landing Page)
CREATE POLICY "Permitir inserção pública" 
  ON public.landing_pages 
  FOR INSERT 
  WITH CHECK (true);

-- 3. Política de Atualização Pública (Qualquer pessoa pode atualizar sua própria página via slug ou id)
CREATE POLICY "Permitir atualização pública" 
  ON public.landing_pages 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
