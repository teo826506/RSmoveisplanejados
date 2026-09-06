import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, Lock } from 'lucide-react';
import { LogoRS } from './LogoRS';
import { SiteSettings } from '../types';

interface FooterProps {
  onOpenAdmin: (initialTab?: string) => void;
  logoUrl?: string;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  logoUrl,
  settings,
}) => {
  const instagram = settings?.instagram || 'https://instagram.com';
  const facebook = settings?.facebook || 'https://facebook.com';
  const youtube = settings?.youtube || 'https://youtube.com';
  return (
    <footer className="bg-[#050505] text-neutral-400 text-xs border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Subtle gold radiance behind footer logo */}
      <div className="absolute left-10 bottom-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          {/* Brand Info with High-End Gold Logo */}
          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <LogoRS size="lg" showSubtitle={true} withGlow={true} withShimmer={true} logoUrl={logoUrl} />
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed max-w-sm font-light mx-auto">
              Especialistas em projetos sob medida, marcenaria de luxo em 100% MDF de alta densidade, ferragens alemãs com amortecimento e soluções arquitetônicas para quem valoriza sofisticação, precisão e durabilidade.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Canal do YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© 2026 Desenvolvedor Kaliton Goncalves Leite</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% MDF Garantido
            </span>
            <span>•</span>
            <button
              onClick={() => onOpenAdmin('dashboard')}
              className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 text-[11px]"
              title="Acesso Restrito - Administrador"
            >
              <Lock className="w-3 h-3" /> Área Restrita (ADM)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

