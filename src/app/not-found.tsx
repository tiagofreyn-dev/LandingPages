'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, PlusCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-zinc-950 to-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Luz de Fundo */}
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] rounded-full blur-[120px] bg-cyan-500/10 pointer-events-none z-0" />
      
      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        {/* Ícone Animado */}
        <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative group">
          <Compass className="w-16 h-16 text-cyan-400 animate-spin-slow" />
          <div className="absolute -inset-1 rounded-3xl blur bg-cyan-500/20 opacity-30 group-hover:opacity-50 transition duration-300"></div>
        </div>

        {/* Textos */}
        <div className="space-y-3">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tighter">
            404
          </h1>
          <h2 className="text-xl font-bold text-neutral-200">
            Página Não Encontrada
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto font-light">
            O endereço informado não existe ou a Landing Page foi removida. Que tal criar a sua própria agora mesmo?
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition duration-300 text-neutral-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-sm bg-cyan-500 hover:bg-cyan-600 text-slate-950 transition duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Criar Minha Página</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
