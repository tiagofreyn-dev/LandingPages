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
  Smartphone,
  Upload,
  CreditCard,
  QrCode,
  ShieldCheck,
  Trash2,
  Key,
  Edit,
  ArrowLeft
} from 'lucide-react';
import { supabase, isSupabaseConfigured, mockDatabase, LandingPageData } from '@/lib/supabase';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import confetti from 'canvas-confetti';

// CONFIGURAÇÃO DO PROPRIETÁRIO (VOCÊ)
// Substitua o link abaixo pelo seu link de pagamento real (Mercado Pago, Stripe, etc.)
const SEU_LINK_DE_PAGAMENTO = 'https://pay.cakto.com.br/w78heoa_903142';

export default function Dashboard() {
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [profissao, setProfissao] = useState('');
  const [cidade, setCidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [corTema, setCorTema] = useState('azul');
  const [fotoUrl, setFotoUrl] = useState(''); // Armazenará a foto em formato Base64 comprimida (~5KB)
  const [slug, setSlug] = useState('');
  
  // Controle de edição manual do slug
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);

  // Estados de Operação e Fluxo
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<{ link: string; editLink: string } | null>(null);
  const [paymentPending, setPaymentPending] = useState(false); // Fluxo de pagamento
  const [confirmandoPagamento, setConfirmandoPagamento] = useState(false);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [editLinkCopiado, setEditLinkCopiado] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);

  // ESTADO DE EDIÇÃO (Caso acesse via Link Secreto)
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idPaginaEdicao, setIdPaginaEdicao] = useState<string | null>(null);
  const [paginaPagaOriginal, setPaginaPagaOriginal] = useState(false);
  const [linkEdicaoGerado, setLinkEdicaoGerado] = useState<string | null>(null);

  // Referência para o input de arquivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Base URL para geração de links
  const [baseUrl, setBaseUrl] = useState('https://micropages.com.br');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  // CARREGAR PÁGINA VIA LINK SECRETO (Com base na URL: ?slug=dr-sergio&key=UUID-DO-BANCO)
  useEffect(() => {
    async function carregarPaginaParaEdicao() {
      if (typeof window === 'undefined') return;
      
      const params = new URLSearchParams(window.location.search);
      const urlSlug = params.get('slug');
      const urlKey = params.get('key'); // O key é o UUID (id) da página no banco

      if (urlSlug && urlKey) {
        try {
          setSalvando(true);
          let pageData: LandingPageData | null = null;

          if (isSupabaseConfigured) {
            // Busca no Supabase validando slug E UUID (id) para segurança
            const { data: dbData, error: dbError } = await supabase
              .from('landing_pages')
              .select('*')
              .eq('slug', urlSlug.toLowerCase())
              .eq('id', urlKey)
              .maybeSingle();

            if (!dbError && dbData) {
              pageData = dbData as LandingPageData;
            }
          } else {
            // Busca no Mock Database (LocalStorage)
            const dbData = mockDatabase.getPageBySlug(urlSlug);
            if (dbData && dbData.id === urlKey) {
              pageData = dbData;
            }
          }

          if (pageData) {
            // Verifica se veio redirecionado do checkout com pagamento aprovado
            const veioDeCheckoutComSucesso = params.get('success') === 'true';
            
            if (veioDeCheckoutComSucesso && !pageData.pago) {
              try {
                if (isSupabaseConfigured) {
                  await supabase
                    .from('landing_pages')
                    .update({ pago: true })
                    .eq('id', pageData.id);
                } else {
                  const mockPage = mockDatabase.getPageBySlug(pageData.slug);
                  if (mockPage) {
                    mockPage.pago = true;
                    await mockDatabase.savePage(mockPage);
                  }
                }
                pageData.pago = true;
                
                // Dispara confete festivo automático
                setTimeout(() => {
                  confetti({
                    particleCount: 180,
                    spread: 100,
                    origin: { y: 0.6 }
                  });
                }, 500);
              } catch (err) {
                console.error('Erro na ativação automática pós-pagamento:', err);
              }
            }

            // Modo Edição Confirmado!
            setModoEdicao(true);
            setIdPaginaEdicao(pageData.id || null);
            setPaginaPagaOriginal(!!pageData.pago);
            
            // Preenche o formulário com os dados carregados
            setNome(pageData.nome);
            setProfissao(pageData.profissao);
            setCidade(pageData.cidade);
            
            // Aplica máscara no WhatsApp
            let cel = pageData.whatsapp.replace(/\D/g, '');
            if (cel.length === 11) {
              cel = `(${cel.slice(0, 2)}) ${cel.slice(2, 7)}-${cel.slice(7)}`;
            } else if (cel.length === 10) {
              cel = `(${cel.slice(0, 2)}) ${cel.slice(2, 6)}-${cel.slice(6)}`;
            }
            setWhatsapp(cel);
            
            setBio(pageData.bio);
            setCorTema(pageData.cor_tema);
            setFotoUrl(pageData.foto_url || '');
            setSlug(pageData.slug);
            setSlugEditadoManualmente(true);

            // Gera o link de edição para segurança adicional
            const editUrl = `${baseUrl}/dashboard?slug=${pageData.slug}&key=${pageData.id}`;
            setLinkEdicaoGerado(editUrl);

            // Se a página já está paga, exibe direto a tela de sucesso com o link e o botão de editar!
            if (pageData.pago) {
              setMensagemSucesso({
                link: `${baseUrl}/${pageData.slug}`,
                editLink: editUrl
              });
            }
          } else {
            alert('O link de edição utilizado é inválido ou a página não existe.');
            // Limpa parâmetros da URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('Erro ao carregar dados de edição:', err);
        } finally {
          setSalvando(false);
        }
      }
    }

    carregarPaginaParaEdicao();
  }, [baseUrl]);

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
    if (!slugEditadoManualmente && !modoEdicao) {
      setSlug(formataSlug(valor));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (modoEdicao) return; // Não permite alterar o endereço slug após criado para evitar quebras de links
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

  // UPLOAD E COMPRESSÃO DE FOTO (CLIENT-SIDE CANVAS COMPRESSION)
  // Reduz a foto para exatamente 150x150 e exporta como JPEG de 0.6 de qualidade
  // O arquivo gerado terá em média 5KB a 8KB e será salvo como texto puro na coluna foto_url do Supabase!
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('A imagem original é muito grande. Escolha uma foto com menos de 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 150;
        
        canvas.width = targetSize;
        canvas.height = targetSize;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx.drawImage(
          img,
          sourceX, sourceY, sourceSize, sourceSize,
          0, 0, targetSize, targetSize
        );

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setFotoUrl(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removerFoto = () => {
    setFotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ação de Salvar / Solicitar Ativação por Pagamento
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm(null);
    setMensagemSucesso(null);
    setPaymentPending(false);

    // Validações básicas
    if (!nome.trim()) return setErroForm('Por favor, informe o seu Nome.');
    if (!profissao.trim()) return setErroForm('Por favor, informe o que você é.');
    if (!cidade.trim()) return setErroForm('Por favor, informe a sua Cidade de atendimento.');
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      return setErroForm('Por favor, informe um WhatsApp válido com DDD.');
    }
    if (!bio.trim()) return setErroForm('Por favor, escreva uma breve biografia.');
    if (!slug.trim()) return setErroForm('Por favor, defina o endereço da página (slug).');

    setSalvando(true);

    const payload: LandingPageData = {
      id: idPaginaEdicao || undefined,
      slug: slug.toLowerCase(),
      nome: nome.trim(),
      profissao: profissao.trim(),
      cidade: cidade.trim(),
      whatsapp: whatsapp.replace(/\D/g, ''),
      bio: bio.trim(),
      cor_tema: corTema,
      foto_url: fotoUrl.trim() || undefined,
      pago: modoEdicao ? paginaPagaOriginal : false // Mantém pago se já estava pago
    };

    try {
      let savedRecord: LandingPageData | null = null;

      if (isSupabaseConfigured) {
        // Fluxo com Banco Supabase Ativo
        if (!modoEdicao) {
          // Verifica duplicidade apenas se for criação nova
          const { data: existente } = await supabase
            .from('landing_pages')
            .select('id')
            .eq('slug', payload.slug)
            .maybeSingle();

          if (existente) {
            throw new Error('Este endereço de link (slug) já está em uso. Por favor, escolha outro.');
          }
        }

        // Faz o upsert no Supabase
        const { data: dbData, error: saveError } = await supabase
          .from('landing_pages')
          .upsert(payload, { onConflict: 'slug' })
          .select('*')
          .single();

        if (saveError) throw saveError;
        savedRecord = dbData as LandingPageData;
      } else {
        // Fluxo Local Mock (LocalStorage)
        savedRecord = await mockDatabase.savePage(payload);
      }

      if (!savedRecord || !savedRecord.id) {
        throw new Error('Falha ao salvar o registro e obter o identificador único.');
      }

      // Gera o Link Secreto de Edição baseado no UUID da página recém-salva!
      const editUrl = `${baseUrl}/dashboard?slug=${savedRecord.slug}&key=${savedRecord.id}`;
      setLinkEdicaoGerado(editUrl);
      setIdPaginaEdicao(savedRecord.id);

      if (modoEdicao && paginaPagaOriginal) {
        // Se for uma edição de página já paga, salva e avança direto para o sucesso!
        setMensagemSucesso({
          link: `${baseUrl}/${savedRecord.slug}`,
          editLink: editUrl
        });
        
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.6 }
        });
      } else {
        // Abre a tela de pendência de pagamento
        setPaymentPending(true);
      }

    } catch (err: any) {
      console.error(err);
      setErroForm(`${err.message || 'Erro desconhecido ao salvar os dados.'}`);
    } finally {
      setSalvando(false);
    }
  };

  // Simula ou Confirma a aprovação de pagamento liberando o minisite no Supabase
  const handleConfirmarPagamento = async () => {
    if (!idPaginaEdicao) return;
    
    setConfirmandoPagamento(true);
    setErroForm(null);

    try {
      if (isSupabaseConfigured) {
        const { error: patchError } = await supabase
          .from('landing_pages')
          .update({ pago: true })
          .eq('id', idPaginaEdicao);

        if (patchError) throw patchError;
      } else {
        // No local storage, atualiza o mock
        const mockPage = mockDatabase.getPageBySlug(slug);
        if (mockPage) {
          mockPage.pago = true;
          await mockDatabase.savePage(mockPage);
        }
      }

      setPaginaPagaOriginal(true);
      
      // Sucesso Total - Libera o link público e exibe o Link de Edição!
      setMensagemSucesso({
        link: `${baseUrl}/${slug}`,
        editLink: linkEdicaoGerado || ''
      });
      setPaymentPending(false);

      // Dispara confetes premium
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: corTema === 'azul' ? ['#22d3ee', '#06b6d4', '#3b82f6'] : corTema === 'verde' ? ['#34d399', '#10b981', '#14b8a6'] : ['#f59e0b', '#fbbf24', '#d97706']
      });

    } catch (err: any) {
      console.error(err);
      setErroForm(`Erro ao ativar minisite: ${err.message || 'Erro desconhecido.'}`);
    } finally {
      setConfirmandoPagamento(false);
    }
  };

  const copiarLink = () => {
    if (!mensagemSucesso) return;
    navigator.clipboard.writeText(mensagemSucesso.link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const copiarEditLink = () => {
    if (!linkEdicaoGerado && !mensagemSucesso?.editLink) return;
    navigator.clipboard.writeText(mensagemSucesso?.editLink || linkEdicaoGerado || '');
    setEditLinkCopiado(true);
    setTimeout(() => setEditLinkCopiado(false), 2000);
  };

  const copiarPix = () => {
    const pixFalso = '00020126580014br.gov.bcb.pix0136e4f3a7d2-7c6d-4c38-bd91-032a4e9b9087520400005303986540519.905802BR5910MicroPages6009Sao Paulo62070503***6304E2D5';
    navigator.clipboard.writeText(pixFalso);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2000);
  };

  // Reseta o painel para permitir que o usuário crie um novo minisite do zero
  const handleCriarNovo = () => {
    // Limpa parâmetros da URL de forma segura no navegador
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Reseta todos os estados
    setModoEdicao(false);
    setIdPaginaEdicao(null);
    setPaginaPagaOriginal(false);
    setLinkEdicaoGerado(null);
    setMensagemSucesso(null);
    setPaymentPending(false);
    
    setNome('');
    setProfissao('');
    setCidade('');
    setWhatsapp('');
    setBio('');
    setCorTema('azul');
    setFotoUrl('');
    setSlug('');
    setSlugEditadoManualmente(false);
    setErroForm(null);
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
    foto_url: fotoUrl || undefined,
    pago: true // No preview do dashboard sempre exibimos com visualização ativa!
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
              MicroPages <span className="text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-900/20 border border-cyan-500/10 ml-1">Premium</span>
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
                  {modoEdicao ? (
                    <>
                      <Edit className="w-5 h-5 text-cyan-400" />
                      Editar Minhas Informações
                    </>
                  ) : (
                    'Informações da Página'
                  )}
                </h2>
                {modoEdicao && (
                  <button
                    onClick={handleCriarNovo}
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white flex items-center gap-1 transition duration-200 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" /> Criar Outro
                  </button>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-light">
                {modoEdicao 
                  ? 'Você está em modo de edição segura. Altere seus dados e salve sem precisar pagar novamente.'
                  : 'Insira seus dados abaixo para gerar sua página profissional instantaneamente.'
                }
              </p>
            </div>

            {/* FLUXO 1: FORMULÁRIO DE ENTRADA (Exibido se não estiver pendente de pagamento ou concluído) */}
            {!paymentPending && !mensagemSucesso && (
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
                    <Briefcase className="w-3.5 h-3.5 text-neutral-500" /> O que você é? (Profissão / Especialidade)
                  </label>
                  <input
                    type="text"
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                    placeholder="Ex: Advogado Trabalhista, Psicólogo Clínico, Contador..."
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
                    <FileText className="w-3.5 h-3.5 text-neutral-500" /> Biografia / Apresentação
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Escreva uma breve apresentação detalhando sua experiência e como você ajuda seus clientes..."
                    className="w-full h-28 bg-neutral-900 border border-neutral-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition duration-200 resize-none"
                    required
                  />
                </div>

                {/* UPLOAD DE FOTO ULTRACOMPRIMIDA (BASE64) */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-500" /> Foto de Perfil
                  </label>
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-4">
                    {/* Visualizador de Foto */}
                    <div className="shrink-0">
                      {fotoUrl ? (
                        <div className="relative">
                          <img
                            src={fotoUrl}
                            alt="Preview"
                            className="w-14 h-14 rounded-full object-cover border border-neutral-700"
                          />
                          <button
                            type="button"
                            onClick={removerFoto}
                            className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full hover:bg-red-500 text-white shadow-md transition duration-200 cursor-pointer"
                            title="Remover Foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-neutral-800 border border-dashed border-neutral-700 flex items-center justify-center text-neutral-500">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    {/* Input de Upload */}
                    <div className="space-y-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 py-2 px-4 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 rounded-lg text-xs font-bold transition duration-200 cursor-pointer border border-neutral-700"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Selecionar Foto</span>
                      </button>
                      <p className="text-[10px] text-neutral-500 font-light">
                        A foto será reduzida de forma ultra-comprimida, ocupando menos de 8KB no banco.
                      </p>
                    </div>
                  </div>
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
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 cursor-pointer ${corTema === 'azul' ? 'bg-blue-950/20 border-blue-500 ring-2 ring-blue-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
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
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 cursor-pointer ${corTema === 'verde' ? 'bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
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
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition duration-200 cursor-pointer ${corTema === 'premium' ? 'bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
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
                    <Globe className="w-3.5 h-3.5 text-neutral-500" /> Endereço de Link (Slug desejado)
                  </label>
                  <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition duration-200">
                    <span className="bg-neutral-950 text-neutral-500 text-xs px-3 flex items-center border-r border-neutral-800 select-none font-medium">
                      {baseUrl.replace(/^https?:\/\//, '') + '/'}
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={handleSlugChange}
                      disabled={modoEdicao}
                      placeholder="ex-dr-fabio-advogado"
                      className="w-full bg-transparent border-0 rounded-r-xl px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-750 focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  {modoEdicao && (
                    <p className="text-[10px] text-neutral-500 font-light">
                      O slug de endereço não pode ser alterado após criado para manter o link ativo funcionando.
                    </p>
                  )}
                </div>

                {/* Erros Gerais do Form */}
                {erroForm && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed animate-fade-in">
                    {erroForm}
                  </div>
                )}

                {/* Botão Salvar e Publicar */}
                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-98 transition-all duration-300 disabled:opacity-50 select-none mt-6 cursor-pointer"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Salvando Alterações...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-950 font-bold" />
                      <span>{modoEdicao ? 'SALVAR ALTERAÇÕES' : 'SALVAR E PUBLICAR AGORA'}</span>
                    </>
                  )}
                </button>

              </form>
            )}

            {/* FLUXO 2: TELA DE PENDÊNCIA DE PAGAMENTO (Exibido após o salvamento inicial) */}
            {paymentPending && !mensagemSucesso && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Link de Edição Temporário para não perder acesso */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                    <Key className="w-3.5 h-3.5" />
                    <span>Link Secreto de Edição Gerado!</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
                    Guarde o link de edição abaixo. Você precisará dele para acessar o painel e gerenciar seu site no futuro sem precisar pagar de novo!
                  </p>
                  <div className="flex items-center gap-2 bg-neutral-950/80 rounded-lg p-2 overflow-hidden justify-between border border-neutral-850">
                    <span className="text-[10px] font-mono text-neutral-400 truncate pr-2 max-w-[200px]">
                      {linkEdicaoGerado}
                    </span>
                    <button
                      onClick={copiarEditLink}
                      className="p-1.5 rounded bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200 shrink-0"
                      title="Copiar Link de Edição"
                    >
                      {editLinkCopiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="font-bold text-sm">Página Criada! Ative sua Assinatura</h3>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Sua micro-landing page está salva com sucesso. Para ativá-la e liberar o link de acesso público aos seus clientes, inicie sua assinatura mensal.
                  </p>
                </div>

                {/* Detalhes do Pagamento */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400 font-light">Serviço:</span>
                    <span className="text-xs text-neutral-200 font-bold">Assinatura Mensal de Minisite</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400 font-light">Assinatura:</span>
                    <span className="text-lg font-black text-cyan-400">R$ 8,99 / mês</span>
                  </div>
                </div>

                {/* Botões de Ação Seguro */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`${SEU_LINK_DE_PAGAMENTO}?custom_slug=${slug}&custom_key=${idPaginaEdicao}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm tracking-wide bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] active:scale-98 transition-all duration-300 cursor-pointer select-none text-center"
                  >
                    <CreditCard className="w-4 h-4 text-slate-950 font-bold" />
                    <span>PAGAR ASSINATURA NA CAKTO</span>
                  </a>

                  {/* Informativo de Liberação Automática */}
                  <div className="p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-neutral-450 leading-relaxed font-light">
                      Ao clicar no botão de pagamento, você iniciará sua assinatura no ambiente 100% seguro da <strong>Cakto</strong>. 
                    </p>
                    <p className="text-[11px] text-cyan-400 font-medium leading-relaxed">
                      Assim que o pagamento for concluído, você será redirecionado de volta para este painel e seu site será ativado automaticamente!
                    </p>
                  </div>

                  {/* Simulação restrita a localhost (evita fraudes em produção por pessoas reais) */}
                  {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                    <button
                      onClick={handleConfirmarPagamento}
                      className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-600 hover:text-neutral-300 rounded-xl text-[10px] font-bold border border-dashed border-neutral-850 transition duration-200 cursor-pointer mt-4"
                    >
                      🧪 [DESENVOLVEDOR] Simular Confirmação de Pagamento (Localhost)
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPending(false);
                      setMensagemSucesso(null);
                    }}
                    className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 py-2 transition duration-200 cursor-pointer"
                  >
                    Voltar e Editar Dados
                  </button>
                </div>
              </div>
            )}

            {/* FLUXO 3: TELA DE SUCESSO (Exibida após o pagamento ser confirmado e liberado OU edição de pago salva) */}
            {mensagemSucesso && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.1)] space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-cyan-300">
                      {modoEdicao ? 'Alterações Salvas com Sucesso!' : 'Minisite Ativado com Sucesso!'}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {modoEdicao
                      ? 'As modificações do seu minisite já estão ativas e publicadas na internet de forma instantânea para todos os seus clientes.'
                      : 'Parabéns! O pagamento foi confirmado e a sua micro-landing page profissional está oficialmente **PUBLICADA** e **ATIVA** na internet para receber contatos dos seus clientes.'
                    }
                  </p>
                  
                  {/* Link Público Ativo */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Endereço público do seu site:</span>
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-3 overflow-hidden justify-between">
                      <span className="text-xs font-mono text-cyan-300 truncate select-all pr-2 max-w-[240px]">
                        {mensagemSucesso.link}
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={copiarLink}
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200"
                          title="Copiar Link Público"
                        >
                          {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={mensagemSucesso.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200"
                          title="Abrir em Nova Aba"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Link Secreto de Edição Permanente */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Key className="w-3.5 h-3.5" />
                      <span>Link Secreto de Edição Permanente</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
                      **GUARDE ESTE LINK SECRETO EM LOCAL SEGURO!** Você precisará dele para editar suas informações, biografia ou alterar sua foto no futuro sem ter que pagar novamente.
                    </p>
                    <div className="flex items-center gap-2 bg-neutral-905 border border-neutral-800 rounded-xl p-3 overflow-hidden justify-between">
                      <span className="text-xs font-mono text-amber-300 truncate select-all pr-2 max-w-[240px]">
                        {mensagemSucesso.editLink}
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={copiarEditLink}
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition duration-200"
                          title="Copiar Link de Edição"
                        >
                          {editLinkCopiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCriarNovo}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition duration-300 text-neutral-300 select-none cursor-pointer"
                  >
                    Criar Novo Minisite do Zero
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer do Painel */}
          <div className="text-[10px] text-neutral-600 text-center py-4 border-t border-neutral-900/60 mt-8 select-none">
            MicroPages • Otimizado para Deploy na Vercel
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
