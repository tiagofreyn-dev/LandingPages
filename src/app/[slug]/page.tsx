'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { supabase, isSupabaseConfigured, mockDatabase, LandingPageData } from '@/lib/supabase';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const [data, setData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLandingPage() {
      if (!slug) return;
      
      try {
        setLoading(true);
        let pageData: LandingPageData | null = null;

        // Tenta buscar do Supabase se estiver configurado
        if (isSupabaseConfigured) {
          const { data: dbData, error: dbError } = await supabase
            .from('landing_pages')
            .select('*')
            .eq('slug', slug.toLowerCase())
            .maybeSingle(); // Usamos maybeSingle para não estourar erro se não achar

          if (!dbError && dbData) {
            pageData = dbData as LandingPageData;
          }
        }

        // Se não encontrou no Supabase (ou não configurado), busca no MockDatabase (LocalStorage)
        if (!pageData) {
          pageData = mockDatabase.getPageBySlug(slug);
        }

        if (pageData) {
          setData(pageData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erro ao buscar landing page:', err);
        // Fallback de contingência para o Mock
        const pageData = mockDatabase.getPageBySlug(slug);
        if (pageData) {
          setData(pageData);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLandingPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-200">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-neutral-800 border-t-cyan-400 animate-spin"></div>
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 absolute" />
        </div>
        <p className="text-sm font-semibold tracking-wider text-neutral-400 mt-6 animate-pulse">
          Carregando Página...
        </p>
      </div>
    );
  }

  if (error || !data) {
    notFound();
  }

  // Bloqueio de visualização pública caso o pagamento não esteja realizado
  if (data.pago === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-zinc-950 to-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {/* Luz de Fundo */}
        <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] rounded-full blur-[120px] bg-amber-500/10 pointer-events-none z-0" />
        
        <div className="max-w-md w-full text-center relative z-10 space-y-6">
          {/* Ícone de Cadeado Animado */}
          <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative group">
            <svg className="w-12 h-12 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <div className="absolute -inset-1 rounded-3xl blur bg-amber-500/10 opacity-30"></div>
          </div>

          {/* Textos Informativos */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
              Aguardando Ativação
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto font-light">
              Esta micro-landing page profissional foi criada com sucesso, mas está aguardando a ativação do pagamento para ficar disponível publicamente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-300 text-xs font-light max-w-xs mx-auto leading-relaxed">
            Se você é o proprietário desta página, acesse o painel de administração para concluir a liberação do seu minisite.
          </div>

          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full font-bold text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition duration-300 text-neutral-300 shadow-md"
            >
              Acessar Painel de Controle
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <LandingPageTemplate data={data} />;
}
