import React from 'react';
import {
  Diamond,
  Ruler,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Armchair,
  Smile,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  onOpenBudget: () => void;
  onExploreProjects: () => void;
  settings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBudget, onExploreProjects, settings }) => {
  const tagline = settings?.heroTagline || 'SOFISTICAÇÃO QUE TRANSFORMA';
  const linha1 = settings?.heroTituloLinha1 || 'MÓVEIS';
  const linha2 = settings?.heroTituloLinha2 || 'PLANEJADOS';
  const slogan = settings?.slogan || 'Em MDF, para espaços únicos como você.';
  const bgImg = settings?.heroImagemFundo || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90';
  const statProjetos = settings?.statProjetos || '+500';
  const statClientes = settings?.statClientes || '+98%';
  const statAnos = settings?.statAnos || '+10 ANOS';
  const statAtendimento = settings?.statAtendimento || 'PERSONALIZADO E LOCAL';

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#080808]"
    >
      {/* Background Luxury Interior with Dark Vignette & Gold Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImg}
          alt="Cozinha e Móveis Planejados em MDF de Luxo"
          className="w-full h-full object-cover object-center scale-105 transform duration-1000 ease-out"
        />
        {/* Layered overlays for dramatic atmosphere & maximum contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.15)_0%,transparent_60%)]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 sm:pt-16 md:pt-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Eyebrow / Tagline */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <div className="h-[1px] w-6 sm:w-10 bg-[#D4AF37]" />
            <span className="text-[11px] sm:text-xs tracking-[0.28em] font-semibold text-[#D4AF37] uppercase font-display-rs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {tagline}
            </span>
          </div>

          {/* Grand 3D Gold Typography matching the reference image */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold tracking-tight leading-[1.05] uppercase mb-4 sm:mb-6 drop-shadow-2xl">
            <span className="block text-gold-gradient font-display-rs drop-shadow-[0_4px_25px_rgba(212,175,55,0.35)]">
              {linha1}
            </span>
            <span className="block text-gold-gradient font-display-rs drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
              {linha2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#D0D0D0] font-light max-w-xl mb-8 sm:mb-10 leading-relaxed">
            {slogan}
          </p>

          {/* 4 Key Pillars / Diferenciais (Replicating exact image structure) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl">
            {/* Pillar 1 */}
            <div className="flex flex-col items-start p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[#D4AF37]/25 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-black/60">
              <div className="w-8 h-8 rounded flex items-center justify-center mb-2 text-[#D4AF37]">
                <Diamond className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase leading-tight">
                ACABAMENTO
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase leading-tight">
                PREMIUM
              </span>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-start p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[#D4AF37]/25 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-black/60">
              <div className="w-8 h-8 rounded flex items-center justify-center mb-2 text-[#D4AF37]">
                <Ruler className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase leading-tight">
                PROJETOS
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase leading-tight">
                PERSONALIZADOS
              </span>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-start p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[#D4AF37]/25 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-black/60">
              <div className="w-8 h-8 rounded flex items-center justify-center mb-2 text-[#D4AF37]">
                <Leaf className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase leading-tight">
                MATERIAIS DE
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase leading-tight">
                ALTA QUALIDADE
              </span>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-start p-2.5 sm:p-3 rounded-lg bg-black/40 border border-[#D4AF37]/25 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-black/60">
              <div className="w-8 h-8 rounded flex items-center justify-center mb-2 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase leading-tight">
                GARANTIA E
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase leading-tight">
                DURABILIDADE
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-solicitar-orcamento-btn"
              onClick={onOpenBudget}
              className="relative group px-8 py-4 rounded-lg border-2 border-[#D4AF37] bg-black/50 text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]"
            >
              <span>SOLICITE UM ORÇAMENTO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              id="hero-ver-projetos-btn"
              onClick={onExploreProjects}
              className="px-6 py-4 rounded-lg border border-neutral-700 hover:border-[#D4AF37]/50 text-neutral-300 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-colors duration-200 bg-neutral-900/40 backdrop-blur-sm"
            >
              Conhecer Nossos Projetos
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Stats Bar (Exact replica from the reference image) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 sm:mt-14">
        <div
          id="hero-stats-bar"
          className="w-full rounded-2xl bg-[#0c0c0c]/85 border border-[#D4AF37]/35 backdrop-blur-md px-6 py-5 sm:py-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/20">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 sm:gap-4 pt-2 md:pt-0">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Armchair className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display-rs tracking-tight">
                  {statProjetos}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#A0A0A0] uppercase">
                  PROJETOS REALIZADOS
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 sm:gap-4 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Smile className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display-rs tracking-tight">
                  {statClientes}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#A0A0A0] uppercase">
                  CLIENTES SATISFEITOS
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 sm:gap-4 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display-rs tracking-tight">
                  {statAnos}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#A0A0A0] uppercase">
                  DE EXPERIÊNCIA NO MERCADO
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 sm:gap-4 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <MapPin className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-[#D4AF37] tracking-wider uppercase font-display-rs">
                  ATENDIMENTO
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#A0A0A0] uppercase">
                  {statAtendimento}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

