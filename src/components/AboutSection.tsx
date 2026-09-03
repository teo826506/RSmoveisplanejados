import React from 'react';
import { Award, Compass, Cpu, CheckCircle2, Hammer, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-b border-[#D4AF37]/15">
      {/* Decorative Gold Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase (Images + Gold Trim) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl shadow-black/90 group">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                  alt="Marcenaria de Luxo RS Móveis Planejados"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                    FABRICAÇÃO PRÓPRIA & TECNOLOGIA
                  </span>
                  <p className="text-white text-lg font-serif-luxury font-medium mt-1">
                    Precisão milimétrica em usinagem CNC e acabamento artesanal.
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#141414] border border-[#D4AF37] rounded-xl p-5 shadow-2xl shadow-black/80 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white font-display-rs block leading-none">100%</span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">MDF PRIMEIRA LINHA</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Sem misturas de aglomerados ou materiais inferiores.
                </p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
                SOBRE A RS MÓVEIS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white leading-tight mb-6">
              A união perfeita entre{' '}
              <span className="text-gold-gradient font-serif-luxury">design sofisticado</span> e alta marcenaria.
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-6 font-light">
              Na <strong className="text-white font-semibold">RS Móveis Planejados em MDF</strong>, não criamos apenas móveis: projetamos experiências que elevam o padrão de vida, conforto e estética da sua casa ou empresa.
            </p>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
              Cada ambiente é concebido sob medida através de consultoria técnica especializada, seleção rigorosa de painéis em 100% MDF com selo anti-umidade, ferragens europeias com amortecimento suave e acabamentos nobres que resistem ao tempo com elegância incomparável.
            </p>

            {/* Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Projetos 3D Realistas</h4>
                  <p className="text-xs text-neutral-400">Visualize cores e iluminação antes de fabricar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Ferragens Premium</h4>
                  <p className="text-xs text-neutral-400">Sistemas com amortecimento suave e silencioso.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Montagem Especializada</h4>
                  <p className="text-xs text-neutral-400">Instalação limpa, pontual e sem improvisos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">5 Anos de Garantia</h4>
                  <p className="text-xs text-neutral-400">Compromisso e segurança para o seu investimento.</p>
                </div>
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-[#D4AF37]/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">Atendimento Consultivo</p>
                  <p className="text-[11px] text-neutral-400">Agende uma visita técnica no seu imóvel ou envie sua planta.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
