import React from 'react';
import { MessageSquare, Ruler, Box, Cog, Wrench, CheckCircle } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const STEPS = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Conversa & Briefing',
      subtitle: 'Alinhamento Inicial',
      description: 'Conversamos sobre seus desejos, necessidades da família, referências estéticas e orçamento disponível.'
    },
    {
      number: '02',
      icon: Ruler,
      title: 'Medição Técnica',
      subtitle: 'Precisão Milimétrica',
      description: 'Nossa equipe visita seu imóvel para checagem minuciosa de paredes, prumos, pontos elétricos e hidráulicos.'
    },
    {
      number: '03',
      icon: Box,
      title: 'Projeto 3D Realista',
      subtitle: 'Visualização Completa',
      description: 'Apresentamos imagens 3D fotorrealistas para que você visualize cada detalhe, textura de MDF e iluminação antes de aprovar.'
    },
    {
      number: '04',
      icon: Cog,
      title: 'Fabricação Própria',
      subtitle: '100% MDF de Alto Padrão',
      description: 'Produção executada em maquinário industrial de corte CNC, bordas coladas a quente e controle rigoroso de qualidade.'
    },
    {
      number: '05',
      icon: Wrench,
      title: 'Instalação & Entrega',
      subtitle: 'Pontualidade & Limpeza',
      description: 'Montadores próprios uniformizados e experientes entregam seu ambiente montado, limpo e pronto para uso com 5 anos de garantia.'
    }
  ];

  return (
    <section className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              METODOLOGIA RS
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            Do Projeto à Instalação com{' '}
            <span className="text-gold-gradient font-serif-luxury">Tranquilidade Absoluta</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Um processo transparente e organizado em 5 etapas para que seu sonho seja executado exatamente como planejado.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl bg-[#131313] border border-neutral-800 hover:border-[#D4AF37]/60 p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  {/* Top Step Number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold font-display-rs text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider block mb-1">
                    {step.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-[#D4AF37]/80">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Etapa certificada</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
