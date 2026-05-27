import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verifica se o URL é válido antes de iniciar o cliente
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const supabaseUrl = isValidUrl(rawUrl) && rawUrl !== 'SUA_SUPABASE_URL_AQUI' 
  ? rawUrl! 
  : 'https://placeholder-url.supabase.co';

const supabaseAnonKey = rawKey && rawKey !== 'SUA_SUPABASE_ANON_KEY_AQUI' 
  ? rawKey 
  : 'placeholder-anon-key';

// Verifica se as variáveis do Supabase estão configuradas corretamente pelo usuário
export const isSupabaseConfigured = !!(
  rawUrl && 
  rawKey && 
  isValidUrl(rawUrl) &&
  rawUrl !== 'SUA_SUPABASE_URL_AQUI' &&
  !rawUrl.includes('placeholder')
);

// Cliente Supabase padrão (não crasha o build em caso de chaves ausentes/inválidas)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LandingPageData {
  id?: string;
  slug: string;
  nome: string;
  profissao: string;
  cidade: string;
  whatsapp: string;
  bio: string;
  cor_tema: string;
  foto_url?: string;
  criado_em?: string;
}

// Banco de dados simulado em LocalStorage para fins de demonstração
const LOCAL_STORAGE_KEY = 'saas_landing_pages_mock';

// Seed inicial com páginas fictícias para demonstração
const defaultMockPages: LandingPageData[] = [
  {
    id: '1',
    slug: 'dr-fabio-advogado',
    nome: 'Dr. Fábio de Souza',
    profissao: 'Advogado Trabalhista Sênior',
    cidade: 'São Paulo - SP',
    whatsapp: '11999999999',
    bio: 'Especialista em Defesa dos Direitos Trabalhistas com mais de 15 anos de atuação. Dedicado a garantir justiça, transparência e agilidade na resolução de conflitos corporativos para trabalhadores e sindicatos.',
    cor_tema: 'azul',
    foto_url: '',
    criado_em: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'dra-aline-psicologa',
    nome: 'Dra. Aline Mendes',
    profissao: 'Psicóloga Clínica (TCC)',
    cidade: 'Rio de Janeiro - RJ',
    whatsapp: '21988888888',
    bio: 'Ajudo pessoas a reconectarem-se com seu bem-estar mental e superarem ansiedade, estresse e depressão através da Terapia Cognitivo-Comportamental. Um espaço seguro e sem julgamentos para sua evolução pessoal.',
    cor_tema: 'verde',
    foto_url: '',
    criado_em: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'marcos-melo-contador',
    nome: 'Marcos Melo',
    profissao: 'Contabilidade e Gestão Fiscal',
    cidade: 'Belo Horizonte - MG',
    whatsapp: '31977777777',
    bio: 'Consultoria tributária e contabilidade estratégica para startups, pequenas empresas e profissionais autônomos. Maximize seus lucros, reduza impostos legalmente e organize suas finanças com facilidade.',
    cor_tema: 'premium',
    foto_url: '',
    criado_em: new Date().toISOString()
  }
];

export const mockDatabase = {
  getPages: (): LandingPageData[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) {
        // Se estiver vazio, inicia com as páginas default
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultMockPages));
        return defaultMockPages;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Erro ao ler do localStorage', e);
      return defaultMockPages;
    }
  },
  
  getPageBySlug: (slug: string): LandingPageData | null => {
    const pages = mockDatabase.getPages();
    return pages.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  },
  
  savePage: async (page: LandingPageData): Promise<LandingPageData> => {
    if (typeof window === 'undefined') return page;
    
    const pages = mockDatabase.getPages();
    const cleanSlug = page.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    
    const pageWithMeta: LandingPageData = {
      ...page,
      slug: cleanSlug,
      id: page.id || crypto.randomUUID(),
      criado_em: page.criado_em || new Date().toISOString()
    };
    
    const index = pages.findIndex(p => p.slug.toLowerCase() === cleanSlug);
    if (index >= 0) {
      pages[index] = pageWithMeta;
    } else {
      pages.push(pageWithMeta);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pages));
    // Simula delay de rede de 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    return pageWithMeta;
  }
};
