import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ShieldCheck, ChevronRight, Video, Lock } from 'lucide-react';
import { LogoRS } from './LogoRS';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBudget: () => void;
  onOpenAdmin: (initialTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBudget,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#050505] text-neutral-400 text-xs border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Subtle gold radiance behind footer logo */}
      <div className="absolute left-10 bottom-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand Info with High-End Gold Logo */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-start">
              <LogoRS size="lg" showSubtitle={true} withGlow={true} withShimmer={true} />
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed max-w-sm font-light">
              Especialistas em projetos sob medida, marcenaria de luxo em 100% MDF de alta densidade, ferragens alemãs com amortecimento e soluções arquitetônicas para quem valoriza sofisticação, precisão e durabilidade.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Canal do YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-display-rs">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Início', id: 'inicio' },
                { label: 'Sobre Nós', id: 'sobre' },
                { label: 'Projetos Realizados', id: 'projetos' },
                { label: 'Vídeos & Tours Virtuais', id: 'videos' },
                { label: 'Nossos Serviços', id: 'servicos' },
                { label: 'Materiais & MDF', id: 'materiais' },
                { label: 'Fale Conosco', id: 'contato' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#D4AF37]/60 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ambientes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-display-rs">
              Ambientes
            </h4>
            <ul className="space-y-2.5">
              {[
                'Cozinhas Planejadas',
                'Quartos & Suítes',
                'Closets Sob Medida',
                'Salas & Home Theaters',
                'Home Office Executivo',
                'Banheiros & Lavabos',
                'Espaços Gourmet',
                'Móveis Corporativos',
              ].map((amb, i) => (
                <li key={i} className="text-neutral-400 hover:text-white transition-colors">
                  {amb}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contato & CTA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-display-rs">
              Atendimento
            </h4>
            <p className="flex items-center gap-2 text-white font-medium">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>(11) 99999-8888</span>
            </p>
            <p className="flex items-center gap-2 text-neutral-400">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>contato@rsplanejados.com.br</span>
            </p>
            <p className="flex items-start gap-2 text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>São Paulo, Grande SP e Interior</span>
            </p>

            <div className="pt-3">
              <button
                onClick={onOpenBudget}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-[11px] tracking-wider uppercase hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
              >
                <span>SOLICITAR ORÇAMENTO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© 2026 RS Móveis Planejados em MDF. Todos os direitos reservados.</p>
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

