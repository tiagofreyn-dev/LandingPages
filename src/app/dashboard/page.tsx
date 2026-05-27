'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  User, 
  Briefcase, 
  MapPin, 
  FileText, 
  Palette, 
  Globe, 
  Image as ImageIcon,
  Loader2,
  Tv,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { supabase, isSupabaseConfigured, mockDatabase, LandingPageData } from '@/lib/supabase';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [profissao, setProfissao] = useState('');
  const [cidade, setCidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [corTema, setCorTema] = useState('azul');
  const [fotoUrl, setFotoUrl] = useState('');
  const [slug, setSlug] = useState('');
  
  // Controle de edição manual do slug
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);

  // Estados de Operação
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<{ link: string } | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Base URL para geração de links
  const [baseUrl, setBaseUrl] = useState('https://meusaas.com.br');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  // Gera slug amigável automaticamente a partir do nome
  const formataSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-'); // substitui espaços por hífens
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNome(valor);
    if (!slugEditadoManualmente) {
      setSlug(formataSlug(valor));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEditadoManualmente(true);
    setSlug(formataSlug(e.target.value));
  };

  // Máscara e sanitização para o WhatsApp
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, ''); // Apenas números
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (valor.length > 6) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }
    
    setWhatsapp(valor);
  };

  // Carregar dados de exemplo para facilitar testes rápidos
  const carregarDadosExemplo = (tipo: 'advogado' | 'psicologa' | 'contador') => {
    setSlugEditadoManualmente(true);
    if (tipo === 'advogado') {
      setNome('Dr. Fábio de Souza');
      setProfissao('Advogado Trabalhista Sênior');
      setCidade('São Paulo - SP');
      setWhatsapp('(11) 99999-9999');
      setBio('Especialista em Defesa dos Direitos Trabalhistas com mais de 15 anos de atuação.\n\nDedicado a garantir justiça, transparência e agilidade na resolução de conflitos corporativos para trabalhadores e sindicatos.');
      setCorTema('azul');
      setFotoUrl('');
      setSlug('dr-fabio-advogado');
    } else if (tipo === 'psicologa') {
      setNome('Dra. Aline Mendes');
      setProfissao('Psicóloga Clínica (TCC)');
      setCidade('Rio de Janeiro - RJ');
      setWhatsapp('(21) 98888-8888');
      setBio('Ajudo pessoas a reconectarem-se com seu bem-estar mental e superarem ansiedade, estresse e depressão através da Terapia Cognitivo-Comportamental.\n\nUm espaço seguro e sem julgamentos para sua evolução pessoal.');
      setCorTema('verde');
      setFotoUrl('');
      setSlug('dra-aline-psicologa');
    } else {
      setNome('Marcos Melo');
      setProfissao('Contabilidade e Gestão Fiscal');
      setCidade('Belo Horizonte - MG');
      setWhatsapp('(31) 97777-7777');
      setBio('Consultoria tributária e contabilidade estratégica para startups, pequenas empresas e profissionais autônomos.\n\nMaximize seus lucros, reduza impostos legalmente e organize suas finanças com facilidade.');
      setCorTema('premium');
      setFotoUrl('');
      setSlug('marcos-melo-contador');
    }
  };

  // Ação de Salvar / Publicar
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm(null);
    setMensagemSucesso(null);

    // Validações básicas
    if (!nome.trim()) return setErroForm('Por favor, informe o Nome.');
    if (!profissao.trim()) return setErroForm('Por favor, informe a Profissão.');
    if (!cidade.trim()) return setErroForm('Por favor, informe a Cidade.');
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      return setErroForm('Por favor, informe um WhatsApp válido com DDD.');
    }
    if (!bio.trim()) return setErroForm('Por favor, escreva uma breve biografia.');
    if (!slug.trim()) return setErroForm('Por favor, defina o endereço da página (slug).');

    setSalvando(true);

    const payload: LandingPageData = {
      slug: slug.toLowerCase(),
      nome: nome.trim(),
      profissao: profissao.trim(),
      cidade: cidade.trim(),
      whatsapp: whatsapp.replace(/\D/g, ''),
      bio: bio.trim(),
      cor_tema: corTema,
      foto_url: fotoUrl.trim() || undefined
    };

    try {
      if (isSupabaseConfigured) {
        // Fluxo com Banco Supabase Ativo
        // Verifica se o slug já existe e pertence a outro ID
        const { data: existente } = await supabase
          .from('landing_pages')
          .select('id, slug')
          .eq('slug', payload.slug)
          .maybeSingle();

        // Faz o upsert no Supabase
        const { error: saveError } = await supabase
          .from('landing_pages')
          .upsert(
            existente?.id ? { id: existente.id, ...payload } : payload,
            { onConflict: 'slug' }
          );

        if (saveError) throw saveError;
      } else {
        // Fluxo Local Mock (LocalStorage)
        await mockDatabase.savePage(payload);
      }

      // Sucesso total
      const linkFinal = `${baseUrl}/${payload.slug}`;
      setMensagemSucesso({ link: linkFinal });
      
      // Dispara efeito de Confete Premium
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: corTema === 'azul' ? ['#22d3ee', '#06b6d4', '#3b82f6'] : corTema === 'verde' ? ['#34d399', '#10b981', '#14b8a6'] : ['#f59e0b', '#fbbf24', '#d97706']
      });

    } catch (err: any) {
      console.error(err);
      setErroForm(`Erro ao salvar os dados: ${err.message || 'Erro desconhecido. Tente outro slug.'}`);
    } finally {
      setSalvando(false);
    }
  };

  const copiarLink = () => {
    if (!mensagemSucesso) return;
    navigator.clipboard.writeText(mensagemSucesso.link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Dados virtuais para renderizar o Preview em tempo real
  const previewData: LandingPageData = {
    slug: slug || 'preview',
    nome: nome || 'Seu Nome Profissional',
    profissao: profissao || 'Sua Profissão ou Especialidade',
    cidade: cidade || 'Sua Cidade - UF',
    whatsapp: whatsapp || '11999999999',
    bio: bio || 'Sua apresentação profissional persuasiva e detalhada aparecerá aqui em tempo real conforme você digita no formulário ao lado.',
    cor_tema: corTema,
    foto_url: fotoUrl || undefined
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      
      {/* Barra de Navegação Superior */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              MicroPages <span className="text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-900/20 border border-cyan-500/10 ml-1">SaaS</span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-medium">Painel de Criação Dinâmica</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isSupabaseConfigured && (
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium hidden sm:inline-block">
              ⚠️ Modo Demonstração (Sem Supabase)
            </span>
          )}
          <a
            href="/"
            className="text-xs font-semibold text-neutral-400 hover:text-white transition duration-200 px-3 py-1.5"
          >
            Ir para Home
          </a>
        </div>
      </header>

      {/* Grid Principal - Split Screen */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
        
        {/* Painel Esquerdo - Formulário de Criação (5/12 colunas) */}
        <section className="lg:col-span-5 p-6 md:p-8 border-r border-neutral-900 bg-neutral-950 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Cabeçalho do Formulário */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
                Informações da Página
              </h2>
              <p className="text-xs text-neutral-400 font-light">
                Insira seus dados abaixo para gerar sua página profissional instantaneamente.
              </p>
            </div>

            {/* Sugestões Rápidas */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
                Preenchimento Rápido de Teste:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => carregarDadosExemplo('advogado')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20 transition duration-200"
                >
                  💼 Advogado
                </button>
                <button
                  type="button"
                  onClick={() => carregarDadosExemplo('psicologa')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20 transition duration-200"
                >
                  🌱 Psicóloga
                </button>
                <button
                  type="button"
                  onClick={() => carregarDadosExemplo('contador')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20 transition duration-200"
                >
                  🏆 Premium
                </button>
              </div>
            </div>

            {/* Formulário Principal */}
            <form onSubmit={handleSalvar} className="space-y-4">
              
              {/* Campo Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-500" /> Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={handleNomeChange}
                  placeholder="Ex: Dr. Fábio de Souza"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                  required
                />
              </div>

              {/* Campo Profissão */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-500" /> Profissão e Especialidade
                </label>
                <input
                  type="text"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  placeholder="Ex: Advogado Trabalhista Sênior"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                  required
                />
              </div>

              {/* Grid Cidade e WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" /> Cidade de Atendimento
                  </label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: São Paulo - SP"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" /> WhatsApp com DDD
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Campo Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" /> Apresentação / Biografia
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva uma breve apresentação detalhando sua experiência e como você ajuda seus clientes..."
                  className="w-full h-28 bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200 resize-none"
                  required
                />
              </div>

              {/* Campo Foto URL (Opcional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-500" /> Link da Foto de Perfil (Opcional)
                </label>
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="Cole o link HTTPS de uma imagem (ex: do LinkedIn)"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                />
              </div>

              {/* Escolha do Tema */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-500" /> Escolha o Tema Visual
                </label>
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Tema Azul */}
                  <button
                    type="button"
                    onClick={() => setCorTema('azul')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 ${corTema === 'azul' ? 'bg-blue-950/20 border-blue-500 ring-2 ring-blue-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
                      {corTema === 'azul' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-xs font-bold text-neutral-200">Azul Corporativo</span>
                  </button>

                  {/* Tema Verde */}
                  <button
                    type="button"
                    onClick={() => setCorTema('verde')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 ${corTema === 'verde' ? 'bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                      {corTema === 'verde' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-xs font-bold text-neutral-200">Verde Menta</span>
                  </button>

                  {/* Tema Premium */}
                  <button
                    type="button"
                    onClick={() => setCorTema('premium')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 ${corTema === 'premium' ? 'bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                      {corTema === 'premium' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-xs font-bold text-neutral-200">Premium Ouro</span>
                  </button>

                </div>
              </div>

              {/* Endereço Final (Slug) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" /> Endereço de Link (Slug)
                </label>
                <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition duration-200">
                  <span className="bg-neutral-950 text-neutral-500 text-xs px-3 flex items-center border-r border-neutral-800 select-none font-medium">
                    meusaas.com.br/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="ex-dr-fabio-advogado"
                    className="w-full bg-transparent border-0 rounded-r-xl px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>

              {/* Erros Gerais do Form */}
              {erroForm && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
                  {erroForm}
                </div>
              )}

              {/* Botão Salvar e Publicar */}
              <button
                type="submit"
                disabled={salvando}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-extrabold text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-98 transition-all duration-300 disabled:opacity-50 select-none mt-6 cursor-pointer"
              >
                {salvando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Salvando Alterações...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-950 font-bold" />
                    <span>SALVAR E PUBLICAR AGORA</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Box de Sucesso Pós-Publicação */}
          {mensagemSucesso && (
            <div className="mt-8 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.08)] space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-cyan-300">Página Publicada com Sucesso!</h3>
              </div>
              <p className="text-xs text-neutral-400 font-light">
                Sua micro-landing page profissional está online e pronta para receber contatos.
              </p>
              
              <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-lg p-2 overflow-hidden justify-between">
                <span className="text-[11px] font-mono text-neutral-300 truncate select-all pr-2 max-w-[200px]">
                  {mensagemSucesso.link}
                </span>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={copiarLink}
                    className="p-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200"
                    title="Copiar Link"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={mensagemSucesso.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200"
                    title="Abrir em Nova Aba"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Footer do Painel */}
          <div className="text-[10px] text-neutral-600 text-center py-4 border-t border-neutral-900/60 mt-8 select-none">
            MicroPages SaaS • Otimizado para Deploy na Vercel
          </div>

        </section>

        {/* Lado Direito - Preview Dinâmico de Celular (7/12 colunas) */}
        <section className="lg:col-span-7 bg-neutral-900/40 p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden select-none">
          {/* Decorações do Preview */}
          <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] bg-cyan-500/5 pointer-events-none z-0" />
          <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] bg-amber-500/3 pointer-events-none z-0" />
          
          {/* Header do Preview */}
          <div className="mb-6 text-center space-y-1 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <Smartphone className="w-3 h-3 text-cyan-400" /> Preview em Tempo Real
            </span>
            <p className="text-[11px] text-neutral-500 font-light">
              Veja como seu cliente visualizará sua página no celular
            </p>
          </div>

          {/* iPhone Mockup Frame */}
          <div className="w-[320px] sm:w-[350px] h-[640px] rounded-[50px] border-[12px] border-neutral-950 bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 ring-4 ring-neutral-900/50 flex flex-col">
            
            {/* Alto-falante / Câmera superior do iPhone (Dynamic Island Mock) */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-neutral-950 z-30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 absolute right-4"></span>
            </div>

            {/* Conteúdo do Celular */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              <LandingPageTemplate data={previewData} isPreview={true} />
            </div>

            {/* Barra virtual do Home Button no iOS */}
            <div className="h-4 bg-black w-full relative z-30 flex items-center justify-center">
              <div className="w-28 h-1 rounded-full bg-neutral-800"></div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
