import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Settings, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { LogoRS } from './LogoRS';

interface HeaderProps {
  onOpenBudget: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: (initialTab?: string) => void;
  activeSection: string;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBudget,
  onNavigate,
  onOpenAdmin,
  activeSection,
  logoUrl,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'INÍCIO', id: 'inicio' },
    { label: 'SOBRE NÓS', id: 'sobre' },
    { label: 'PROJETOS', id: 'projetos' },
    { label: 'GALERIA DE FOTOS', id: 'galeria' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/98 backdrop-blur-md py-2.5 sm:py-3 border-b border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.9)]'
          : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/75 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo with Highlighted Luxury Gold Shine */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2 text-left group focus:outline-none transition-transform duration-300 hover:scale-[1.02]"
            title="RS Móveis Planejados em MDF"
          >
            <LogoRS
              size={isScrolled ? 'md' : 'lg'}
              showSubtitle={true}
              withGlow={true}
              withShimmer={true}
              logoUrl={logoUrl}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-7" id="desktop-nav">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative text-xs tracking-[0.18em] font-semibold uppercase transition-all duration-200 py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#FFE57F] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] font-bold'
                      : 'text-[#E0E0E0] hover:text-[#D4AF37]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action & Admin Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quote Button - Principal CTA para os Clientes */}
            <button
              id="header-budget-cta"
              onClick={onOpenBudget}
              className="relative group px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-black font-extrabold text-xs tracking-widest uppercase transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] flex items-center gap-2 shadow-md shadow-[#D4AF37]/20"
            >
              <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>SOLICITAR ORÇAMENTO</span>
            </button>

            {/* Acesso Restrito do ADM com cadeado */}
            <button
              id="header-admin-lock-btn"
              onClick={() => onOpenAdmin('dashboard')}
              title="Acesso Restrito ao Administrador (Requer Senha)"
              className="p-2.5 rounded-full border border-neutral-800 hover:border-[#D4AF37]/60 bg-black/60 text-neutral-400 hover:text-[#D4AF37] transition-all duration-200"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-budget-quick"
              onClick={onOpenBudget}
              className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black text-[11px] font-extrabold tracking-wider uppercase shadow"
            >
              ORÇAMENTO
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#D4AF37] hover:text-white rounded-lg focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="xl:hidden bg-[#0a0a0a]/98 border-b border-[#D4AF37]/30 px-6 pt-4 pb-8 space-y-4 backdrop-blur-xl animate-fadeIn"
        >
          <div className="flex flex-col space-y-3 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm tracking-widest uppercase py-2.5 px-3 rounded border-b border-neutral-900 flex items-center justify-between ${
                  activeSection === item.id
                    ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10 border-[#D4AF37]/40'
                    : 'text-neutral-300 hover:text-[#D4AF37]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                id="mobile-drawer-budget-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBudget();
                }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                <Sparkles className="w-4 h-4" />
                SOLICITAR ORÇAMENTO
              </button>

              {/* Mobile Admin Lock Button */}
              <button
                id="mobile-drawer-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin('dashboard');
                }}
                className="w-full py-2.5 rounded-lg border border-neutral-800 hover:border-[#D4AF37]/50 bg-black/40 text-neutral-400 hover:text-[#D4AF37] text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Área Restrita (Acesso ADM)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

