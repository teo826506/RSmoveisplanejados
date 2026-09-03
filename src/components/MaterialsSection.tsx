import React, { useState } from 'react';
import { Layers, ShieldCheck, Sparkles, Droplets, Sun, Hammer, Check } from 'lucide-react';

export const MaterialsSection: React.FC = () => {
  const [activeMaterialTab, setActiveMaterialTab] = useState<'mdf' | 'lacas' | 'vidros' | 'ferragens'>('mdf');

  const FINISH_SAMPLES = [
    {
      name: 'MDF Louro Freijó',
      category: 'Madeirado Nobre',
      color: '#8B5A2B',
      texture: 'Textura sincronizada com veios naturais e toque suave amadeirado.',
      tag: 'Alta Procura'
    },
    {
      name: 'MDF Grafite Matt',
      category: 'Laca Acetinada',
      color: '#2B2D2F',
      texture: 'Superfície anti-digitais com acabamento fosco ultra contemporâneo.',
      tag: 'Tendência'
    },
    {
      name: 'MDF Carvalho Boreal',
      category: 'Madeirado Claro',
      color: '#C2A382',
      texture: 'Tonalidade escandinava que amplia e aquece visualmente o espaço.',
      tag: 'Minimalista'
    },
    {
      name: 'MDF Nero Marquina',
      category: 'Efeito Mármore',
      color: '#1A1A1A',
      texture: 'Efeito marmorizado preto profundo com veios brancos marcantes.',
      tag: 'Luxo Total'
    },
    {
      name: 'MDF Gianduia Acetinado',
      category: 'Neutro Quente',
      color: '#70685E',
      texture: 'Tonalidade refinada entre cinza e bege, harmônica para quartos e salas.',
      tag: 'Elegante'
    },
    {
      name: 'MDF Branco Diamante Ultra',
      category: 'MDF Naval Hidrorrepelente',
      color: '#F4F4F4',
      textColor: '#111',
      texture: 'Tratamento especial contra umidade para cozinhas, lavanderias e banheiros.',
      tag: 'Anti-Umidade'
    }
  ];

  return (
    <section id="materiais" className="py-24 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              ALTO PADRÃO CONSTRUTIVO
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            Matérias-Primas Selecionadas com{' '}
            <span className="text-gold-gradient font-serif-luxury">Rigor Absoluto</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            A longevidade e a beleza de um móvel planejado dependem diretamente do que está por dentro. Trabalhamos exclusivamente com marcas consagradas e 100% MDF.
          </p>
        </div>

        {/* 4 Feature Pillars of Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">100% MDF Premium</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Painéis maciços de alta densidade sem adição de aglomerados ou MDP frágil. Resistência a deformações e cupins.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">MDF Hidrorrepelente</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Opção de MDF Naval Ultra com miolo verde para áreas úmidas (cozinhas, pias e banheiros), resistindo à água e vapor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
              <Hammer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Ferragens Europeias</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sistemas de amortecimento pneumático (Blum / Häfele) que eliminam batidas de portas e garantem fechamento suave.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Vidros & Perfis de Luxo</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Vidros reflecta bronze, fumê e bisotados com perfis em alumínio anodizado dourado, preto fosco e champagne.
            </p>
          </div>
        </div>

        {/* Interactive Finishes / Swatches Grid */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#D4AF37]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                CATÁLOGO DE PADRÕES
              </span>
              <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white mt-1">
                Amostras de Padrões e Texturas Mais Pedidos
              </h3>
            </div>
            <span className="text-xs text-neutral-400">
              +120 opções disponíveis em nosso mostruário físico
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FINISH_SAMPLES.map((sample, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-[#D4AF37]/50 transition-all flex items-start gap-4 group"
              >
                {/* Swatch Color Box */}
                <div
                  className="w-16 h-16 rounded-lg border border-white/20 shrink-0 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: sample.color, color: sample.textColor || '#fff' }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    RS
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                      {sample.name}
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-semibold">
                      {sample.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block mb-1.5 uppercase font-medium">
                    {sample.category}
                  </span>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {sample.texture}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
