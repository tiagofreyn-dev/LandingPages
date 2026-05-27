import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  Clock, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  Scale,
  Brain,
  Calculator,
  Laptop,
  HelpCircle,
  TrendingUp,
  Target,
  Compass,
  CheckCircle,
  Briefcase
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col relative overflow-hidden">
      
      {/* Luzes decorativas de fundo */}
      <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full blur-[120px] bg-cyan-500/10 pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] bg-amber-500/5 pointer-events-none z-0" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-neutral-900/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              MicroPages <span className="text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-900/20 border border-cyan-500/10 ml-1">Premium</span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-medium">Landing Pages Instantâneas</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs md:text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition duration-300 active:scale-95"
        >
          Acessar Painel
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Lado Esquerdo - Chamada de Marketing */}
        <section className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold select-none uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Geração de Landing Page em 30 Segundos
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-500">
              A forma mais rápida de atrair clientes pelo <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">WhatsApp</span>
            </h2>
            
            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Desenvolvido para **qualquer profissional, especialista ou prestador de serviços**. Preencha um formulário simples em uma única tela e tenha um minisite profissional, responsivo e de altíssima conversão no ar em segundos.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-full font-extrabold text-sm md:text-base tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95 transition-all duration-300 group"
            >
              <span>Criar Minha Landing Page Agora</span>
              <ArrowRight className="w-4 h-4 text-slate-950 font-bold transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dr-fabio-advogado"
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-full font-semibold text-sm md:text-base tracking-wide bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition duration-300 text-neutral-300"
            >
              <Smartphone className="w-4 h-4 text-neutral-400" />
              <span>Ver Exemplo Prático</span>
            </Link>
          </div>

          {/* Indicadores de Credibilidade */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-neutral-900/80">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Foco Mobile</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Instantâneo</p>
              <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Sem Programação</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Premium</p>
              <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Temas Universais</p>
            </div>
          </div>

        </section>

        {/* Lado Direito - Ilustração Interativa dos Temas */}
        <section className="lg:col-span-5 flex justify-center items-center relative">
          
          <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest bg-cyan-950/20 border border-cyan-500/10 px-3 py-1 rounded-full">
                Exclusivo para Qualquer Profissão
              </span>
              
              <h3 className="text-2xl font-black text-white leading-tight">
                Modelos de Alta Performance Comercial
              </h3>
              
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Estruturas visuais com designs focados nas principais categorias de profissionais do mercado.
              </p>
            </div>

            {/* Lista Visual de Especialidades */}
            <div className="space-y-3 pt-6 relative z-10">
              
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-cyan-500/20 rounded-xl transition duration-200">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Tema Azul Corporativo</h4>
                  <p className="text-[9px] text-neutral-500">Ideal para Advogados, Contadores, Engenheiros e Consultores corporativos.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-emerald-500/20 rounded-xl transition duration-200">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Tema Verde Clínico</h4>
                  <p className="text-[9px] text-neutral-500">Ideal para Médicos, Psicólogos, Nutricionistas, Fisioterapeutas e Clínicas.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-amber-500/20 rounded-xl transition duration-200">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Tema Premium Ouro</h4>
                  <p className="text-[9px] text-neutral-500">Perfeito para Arquitetos, Designers, Personal Trainers e Serviços de Luxo.</p>
                </div>
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* NOVA SEÇÃO COMPLETA: O QUE É UMA LANDING PAGE */}
      <section className="bg-neutral-950 border-t border-neutral-900 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Lado Esquerdo - Detalhamento do Conceito */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" /> Conceito Explicado
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                O que é uma <span className="text-cyan-400">Landing Page</span> e por que você precisa de uma urgente?
              </h2>
              
              <p className="text-sm text-neutral-450 leading-relaxed font-light">
                Diferente de um site tradicional repleto de botões, links externos e informações confusas que fazem seu visitante se perder e ir embora, uma **Landing Page (página de destino)** é construída com um único e exclusivo foco: **a conversão**.
              </p>
              
              <p className="text-sm text-neutral-450 leading-relaxed font-light">
                Ela é projetada de forma linear para guiar o olhar do seu cliente direto para o botão principal de ação. No nosso caso, o botão direciona diretamente para o seu **WhatsApp** com uma mensagem de abordagem personalizada pronta!
              </p>

              {/* Estatísticas de Conversão */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 flex gap-3 items-center">
                  <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200">Conversão 10x Maior</h4>
                    <p className="text-[10px] text-neutral-500 font-light">Até 10 vezes mais contatos do que posts em redes sociais comuns.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 flex gap-3 items-center">
                  <Target className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200">Foco Absoluto</h4>
                    <p className="text-[10px] text-neutral-500 font-light">Zero links de distração. Um único caminho para falar com você.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Cards Explicativos com Efeitos Especiais */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 flex gap-4">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl h-fit">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm md:text-base text-neutral-100">1. Construção de Autoridade</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed font-light">
                    Ao invés de mandar um simples link genérico ou telefone, enviar o endereço do seu site próprio (`micropages.com.br/seu-nome`) passa seriedade, confiança profissional e aumenta imediatamente a percepção de valor do seu serviço.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 flex gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm md:text-base text-neutral-100">2. Facilidade Incomparável de Atendimento</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed font-light">
                    O botão de WhatsApp fixado e pulsando no rodapé da página garante que o cliente te chame na hora. Ele não precisa salvar seu número ou digitar nada, basta um único toque para a conversa começar.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 flex gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl h-fit">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm md:text-base text-neutral-100">3. Perfeito para Anúncios (Google & Instagram)</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed font-light">
                    Quer fazer anúncios patrocinados no Google ou Instagram? Uma Landing Page focada e de carregamento instantâneo é o destino obrigatório para converter cada clique pago em faturamento real.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Grid de Recursos (Features) */}
      <section className="bg-neutral-950 border-t border-neutral-900 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Por que utilizar a MicroPages?</h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Tudo que você precisa em um único local</h2>
            <p className="text-sm text-neutral-400 font-light">Elimine custos de hospedagem e a complexidade de construtores de sites convencionais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 space-y-4 shadow-xl">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-100">Pronto em 30 segundos</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Esqueça processos complexos. Apenas insira suas informações de contato, envie sua foto e biografia e veja seu site profissional ir ao ar imediatamente.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 space-y-4 shadow-xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl w-fit">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-100">CTA Focado em Conversão</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                O botão de WhatsApp flutuante e pulsante garante que seus visitantes possam entrar em contato com você com o menor atrito possível.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-neutral-800 transition duration-300 space-y-4 shadow-xl">
              <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl w-fit">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-100">Hospedagem Otimizada Vercel</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Sua página carrega em milissegundos a partir de qualquer local do mundo, garantindo uma excelente pontuação de SEO e experiência.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-center text-xs text-neutral-500 relative z-10">
        <p className="mb-2">© {new Date().getFullYear()} MicroPages. Desenvolvido para profissionais liberais e autônomos de alta performance.</p>
        <p className="text-neutral-600 hover:text-neutral-400 transition-colors">Otimizado para deploy contínuo e infraestrutura na nuvem.</p>
      </footer>

    </div>
  );
}
