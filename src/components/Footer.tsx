import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, Lock, Download } from 'lucide-react';
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

        {/* QR Codes Section */}
        <div className="pt-4 pb-12 border-t border-neutral-900">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              NOSSOS CANAIS
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-serif-luxury font-bold text-white">
              Escaneie e Fale Conosco
            </h3>
          </div>

          <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center gap-3">
              <a
                href="/"
                className="group flex flex-col items-center gap-3"
                title="Site RS Móveis"
              >
                <span className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-800 group-hover:border-[#D4AF37]/70 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] w-28 h-28 sm:w-36 sm:h-36">
                  <img
                    src="/uploads/qr-rsmoveis.png"
                    alt="QR Code RS Móveis"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </span>
                <span className="text-neutral-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Site RS Móveis</span>
              </a>
              <a
                href="/uploads/qr-rsmoveis.png"
                download="QR-RS-Moveis.png"
                title="Baixar QR Code para imprimir"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar (Imprimir)
              </a>
            </div>

            <a
              href="https://www.instagram.com/rayone_gomes31"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3"
              title="Instagram"
            >
              <span className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-800 group-hover:border-[#D4AF37]/70 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] w-28 h-28 sm:w-36 sm:h-36">
                <img
                  src="/uploads/qr-instagram.jpeg"
                  alt="QR Code Instagram"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </span>
              <span className="text-neutral-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Instagram</span>
            </a>

            <a
              href="https://wa.me/message/SCUY52VVOWT6C1?src=qr"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3"
              title="WhatsApp"
            >
              <span className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-800 group-hover:border-[#D4AF37]/70 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] w-28 h-28 sm:w-36 sm:h-36">
                <img
                  src="/uploads/qr-zap.jpeg"
                  alt="QR Code WhatsApp"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </span>
              <span className="text-neutral-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">WhatsApp</span>
            </a>
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

