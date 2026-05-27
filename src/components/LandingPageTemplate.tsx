'use client';

import React from 'react';
import { 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  ThumbsUp, 
  Briefcase, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { LandingPageData } from '@/lib/supabase';

interface LandingPageTemplateProps {
  data: LandingPageData;
  isPreview?: boolean;
}

export default function LandingPageTemplate({ data, isPreview = false }: LandingPageTemplateProps) {
  const { nome, profissao, cidade, whatsapp, bio, cor_tema, foto_url } = data;

  // Sanitiza número de telefone
  const cleanPhone = whatsapp.replace(/\D/g, '');
  // Formata o link do WhatsApp com mensagem personalizada baseada no profissional
  const welcomeMessage = encodeURIComponent(
    `Olá, ${nome}! Vi o seu perfil e gostaria de agendar um atendimento para saber mais sobre seus serviços de ${profissao}.`
  );
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${welcomeMessage}`;

  // Função para pegar as iniciais do nome
  const getInitials = (fullName: string) => {
    if (!fullName) return 'PL';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Cores e Estilos dos Temas
  const themes = {
    azul: {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-slate-100',
      glow: 'bg-cyan-500/10 shadow-[0_0_50px_rgba(6,182,212,0.15)]',
      card: 'bg-white/5 border border-white/10 backdrop-blur-md',
      cardHover: 'hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300',
      badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950',
      accentGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]',
      avatarBorder: 'border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      iconContainer: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      divider: 'border-cyan-500/10',
      avatarBg: 'from-blue-600 to-cyan-500 text-cyan-100'
    },
    verde: {
      bg: 'bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950 text-stone-100',
      glow: 'bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.15)]',
      card: 'bg-white/5 border border-white/10 backdrop-blur-lg',
      cardHover: 'hover:border-emerald-500/30 hover:bg-white/8 transition-all duration-300',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500 hover:bg-emerald-600 text-stone-950',
      accentGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]',
      avatarBorder: 'border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      iconContainer: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      divider: 'border-emerald-500/10',
      avatarBg: 'from-emerald-600 to-teal-500 text-emerald-100'
    },
    premium: {
      bg: 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-950 text-neutral-100',
      glow: 'bg-amber-500/5 shadow-[0_0_60px_rgba(245,158,11,0.08)]',
      card: 'bg-neutral-900/40 border border-amber-500/10 backdrop-blur-xl',
      cardHover: 'hover:border-amber-500/30 hover:bg-neutral-900/60 transition-all duration-300',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      accentText: 'text-amber-400',
      accentBg: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold',
      accentGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]',
      avatarBorder: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      iconContainer: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      divider: 'border-amber-500/10',
      avatarBg: 'from-amber-600 to-yellow-600 text-amber-100'
    }
  };

  // Seleciona o tema ativo com fallback para azul
  const theme = themes[cor_tema as keyof typeof themes] || themes.azul;

  // Renderizador do avatar profissional
  const renderAvatar = () => {
    if (foto_url && (foto_url.trim().startsWith('http') || foto_url.trim().startsWith('data:image'))) {
      return (
        <div className="relative group">
          <div className={`absolute -inset-0.5 rounded-full blur bg-gradient-to-tr opacity-50 transition duration-300 group-hover:opacity-70 ${cor_tema === 'azul' ? 'from-cyan-500 to-blue-500' : cor_tema === 'verde' ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-yellow-500'}`}></div>
          <img
            src={foto_url}
            alt={nome}
            className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 ${theme.avatarBorder} select-none`}
          />
        </div>
      );
    }

    const initials = getInitials(nome);
    return (
      <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center bg-gradient-to-br ${theme.avatarBg} ${theme.avatarBorder} text-4xl font-bold font-sans tracking-wider select-none relative group`}>
        {initials}
        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center" title="Online agora">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
        </span>
      </div>
    );
  };

  // Seções baseadas na profissão para criar autoridade adicional
  const getProfessionalHighlights = () => {
    const isLawyer = profissao.toLowerCase().includes('advogad') || profissao.toLowerCase().includes('juridic') || profissao.toLowerCase().includes('direito');
    const isPsychologist = profissao.toLowerCase().includes('psicol') || profissao.toLowerCase().includes('terapeuta') || profissao.toLowerCase().includes('psiq');
    
    if (isLawyer) {
      return [
        { icon: ShieldCheck, title: 'Defesa Rigorosa', desc: 'Atuação focada no seu direito com acompanhamento integral.' },
        { icon: Award, title: 'Ética e Sigilo', desc: 'Compromisso absoluto com a confidencialidade e segurança jurídica.' },
        { icon: Clock, title: 'Agilidade e Clareza', desc: 'Respostas rápidas e linguagem de fácil compreensão.' }
      ];
    } else if (isPsychologist) {
      return [
        { icon: ThumbsUp, title: 'Espaço de Escuta', desc: 'Atendimento acolhedor baseado em empatia e sem julgamentos.' },
        { icon: ShieldCheck, title: 'Ética Profissional', desc: 'Sigilo absoluto respaldado pelas diretrizes do conselho.' },
        { icon: Sparkles, title: 'Evolução Pessoal', desc: 'Metodologias focadas em seu desenvolvimento emocional saudável.' }
      ];
    } else {
      return [
        { icon: Award, title: 'Excelência Técnica', desc: 'Resultados precisos e soluções personalizadas para o seu caso.' },
        { icon: Briefcase, title: 'Foco no Cliente', desc: 'Parceria focada no crescimento e na resolução de demandas.' },
        { icon: ShieldCheck, title: 'Segurança e Praticidade', desc: 'Organização inteligente para garantir sua tranquilidade total.' }
      ];
    }
  };

  const highlights = getProfessionalHighlights();

  return (
    <div className={`min-h-screen ${theme.bg} font-sans relative overflow-x-hidden pb-32`}>
      {/* Círculo luminoso de fundo para o efeito premium */}
      <div className={`absolute top-[-10%] left-[50%] -translate-x-[50%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] ${theme.glow} pointer-events-none z-0`} />

      {/* Container Principal */}
      <div className="max-w-md mx-auto px-6 pt-12 md:pt-16 relative z-10">
        
        {/* Header - Foto e Apresentação Principal */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6 animate-fade-in">
            {renderAvatar()}
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3.5 select-none animate-pulse-subtle bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
            Disponível para Atendimento
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 font-sans bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
            {nome}
          </h1>
          
          <p className={`text-lg font-medium ${theme.accentText} tracking-wide mb-3`}>
            {profissao}
          </p>

          <div className="flex items-center gap-1 text-sm text-neutral-400 font-medium bg-white/5 border border-white/5 rounded-full px-3.5 py-1 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cidade}</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className={`p-6 rounded-2xl ${theme.card} mb-8 shadow-2xl relative overflow-hidden group`}>
          {/* Brilho sutil no hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/2 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h2 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-1.5 select-none">
            <Sparkles className={`w-3.5 h-3.5 ${theme.accentText}`} /> Apresentação
          </h2>
          <p className="text-neutral-200 leading-relaxed text-sm md:text-base font-light font-sans whitespace-pre-line">
            {bio}
          </p>
        </div>

        {/* Seção de Autoridade e Destaques */}
        <div className="space-y-4 mb-10">
          <h2 className="text-xs uppercase tracking-wider text-neutral-400 font-bold px-2 select-none">
            Por que escolher meu atendimento?
          </h2>
          
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl ${theme.card} ${theme.cardHover} flex gap-4 items-start shadow-md`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${theme.iconContainer}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-neutral-100 mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Garantia / Chamada de Ação Rápida */}
        <div className={`p-5 rounded-2xl ${theme.card} text-center mb-8 border-dashed border-neutral-700/60`}>
          <Calendar className={`w-6 h-6 mx-auto mb-2.5 ${theme.accentText}`} />
          <h3 className="text-sm font-semibold text-neutral-200 mb-1">
            Agende seu horário com praticidade
          </h3>
          <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
            O atendimento inicial é feito digitalmente pelo WhatsApp de forma descomplicada.
          </p>
        </div>

        {/* Footer da Página */}
        <div className="text-center text-xs text-neutral-500 py-4 select-none">
          <p className="mb-1">© {new Date().getFullYear()} {nome}. Todos os direitos reservados.</p>
          {!isPreview && (
            <p className="hover:text-neutral-400 transition-colors">
              Criado com <span className="font-semibold text-cyan-400">MicroPages</span>
            </p>
          )}
        </div>

      </div>

      {/* CTA PRINCIPAL FLUTUANTE (FIXO NO BOTTOM DA TELA) - ALTA CONVERSÃO */}
      <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/85 to-transparent backdrop-blur-xs z-40 flex justify-center`}>
        <a
          href={isPreview ? '#' : whatsappUrl}
          target={isPreview ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (isPreview) {
              e.preventDefault();
              alert('O link do WhatsApp não funciona no modo de preview do painel.');
            }
          }}
          className={`w-full max-w-sm flex items-center justify-center gap-3 py-4 px-6 rounded-full font-bold text-sm md:text-base tracking-wide transition-all duration-300 transform active:scale-95 ${theme.accentBg} ${theme.accentGlow} select-none group`}
        >
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-30"></span>
            <MessageSquare className="w-3 h-3 text-slate-950 font-black relative inline-flex rounded-full" />
          </span>
          <span className="uppercase tracking-wider">Falar no WhatsApp Agora</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
