import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Check, Calculator } from 'lucide-react';

interface BudgetSimulatorSectionProps {
  onOpenModal: (ambiente?: string) => void;
}

export const BudgetSimulatorSection: React.FC<BudgetSimulatorSectionProps> = ({ onOpenModal }) => {
  const [selectedAmbiente, setSelectedAmbiente] = useState('Cozinha');
  const [selectedFinish, setSelectedFinish] = useState('MDF Madeirado Nobre');
  const [estimatedSize, setEstimatedSize] = useState('Médio (15m² a 25m²)');

  const AMBIENTE_ESTIMATES: Record<string, { baseMin: number; baseMax: number; desc: string }> = {
    'Cozinha': { baseMin: 18000, baseMax: 32000, desc: 'Inclui armários aéreos, bancada inferior, gavetões invisíveis e torre para eletros.' },
    'Quarto': { baseMin: 12000, baseMax: 22000, desc: 'Inclui guarda-roupa planejado, cabeceira ripada sob medida e mesas de apoio suspensas.' },
    'Closet': { baseMin: 15000, baseMax: 28000, desc: 'Inclui módulos de sapateira, cabideiros iluminados em LED e portas em vidro reflecta.' },
    'Sala': { baseMin: 9000, baseMax: 18000, desc: 'Inclui painel para TV até 85", rack suspenso com passagem oculta de fiação e nichos.' },
    'Home Office': { baseMin: 8000, baseMax: 15000, desc: 'Inclui mesa executiva ergonômica, estante iluminada e armários de arquivamento.' },
    'Banheiro': { baseMin: 4500, baseMax: 8500, desc: 'Inclui gabinete em 100% MDF Naval anti-umidade e espelheira com luz perimetral.' },
    'Espaço Gourmet': { baseMin: 16000, baseMax: 30000, desc: 'Inclui bancada de apoio para churrasqueira, adega personalizada e aéreos especiais.' }
  };

  const currentEstimate = AMBIENTE_ESTIMATES[selectedAmbiente] || AMBIENTE_ESTIMATES['Cozinha'];

  return (
    <section id="orcamento" className="py-24 bg-gradient-to-b from-[#080808] via-[#101010] to-[#080808] relative overflow-hidden border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text and Concept */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
                SIMULADOR & ORÇAMENTO
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white leading-tight mb-6">
              Planeje seu Investimento com{' '}
              <span className="text-gold-gradient font-serif-luxury">Transparência Total</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Personalize os detalhes do seu ambiente e receba uma consultoria sob medida com visita técnica gratuita e projeto 3D realista.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-neutral-300">
                  Valores que contemplam 100% MDF de primeira linha e montagem própria
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-neutral-300">
                  Condições facilitadas de pagamento e parcelamento direto
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-neutral-300">
                  Garantia contratual de 5 anos com nota fiscal
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Card Right */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-[#D4AF37]/40 shadow-2xl shadow-black relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-display-rs">
                    Simulador Rápido de Ambiente
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase">
                  Estimativa Técnica
                </span>
              </div>

              {/* Selector: Ambiente */}
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  1. Selecione o Ambiente
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Cozinha', 'Quarto', 'Closet', 'Sala', 'Home Office', 'Banheiro', 'Espaço Gourmet'].map((amb) => (
                    <button
                      key={amb}
                      onClick={() => setSelectedAmbiente(amb)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all text-center ${
                        selectedAmbiente === amb
                          ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                          : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {amb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector: Acabamento */}
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  2. Padrão de Acabamento Desejado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'MDF Madeirado Nobre',
                    'Laca Fosca Matt / Acetinada',
                    'Vidros Reflecta & Perfis Dourados',
                    'MDF Naval Ultra (Anti-Umidade)'
                  ].map((fin) => (
                    <button
                      key={fin}
                      onClick={() => setSelectedFinish(fin)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all ${
                        selectedFinish === fin
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                      }`}
                    >
                      {fin}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimate Box Display */}
              <div className="p-5 rounded-xl bg-black/80 border border-[#D4AF37]/30 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    Estimativa Média para {selectedAmbiente}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gold-gradient font-display-rs">
                    R$ {currentEstimate.baseMin.toLocaleString('pt-BR')} a R$ {currentEstimate.baseMax.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  {currentEstimate.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                id="simulator-open-budget-btn"
                onClick={() => onOpenModal(selectedAmbiente)}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>SOLICITAR PROJETO 3D & ORÇAMENTO EXATO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
