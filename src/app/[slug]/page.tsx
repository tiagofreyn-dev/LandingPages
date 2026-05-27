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

  return <LandingPageTemplate data={data} />;
}
