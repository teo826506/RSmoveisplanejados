import React from 'react';
import {
  UtensilsCrossed,
  BedDouble,
  Shirt,
  Tv,
  Briefcase,
  Droplets,
  Flame,
  Building2,
  ArrowRight
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenBudget: (ambiente: string) => void;
}

const SERVICES = [
  {
    icon: UtensilsCrossed,
    title: 'Cozinhas Planejadas',
    ambiente: 'Cozinha',
    description: 'Projetos ergonômicos e funcionais com ilhas gourmet, torres quentes, gavetários organizadores e iluminação embutida sob os aéreos.',
    tags: ['Ilhas Gourmet', 'Ferragens Soft-Close', 'MDF Hidrorrepelente']
  },
  {
    icon: BedDouble,
    title: 'Dormitórios & Suítes',
    ambiente: 'Quarto',
    description: 'Ambientes acolhedores com cabeceiras ripadas sob medida, iluminação perimetral quente, nichos suspensos e gaveteiros discretos.',
    tags: ['Painéis Ripados', 'Carregadores Wireless', 'MDF Nobre']
  },
  {
    icon: Shirt,
    title: 'Closets Sob Medida',
    ambiente: 'Closet',
    description: 'Organização inteligente com portas em vidro reflecta bronze ou fumê, sapateiras inclinadas, ilhas de joias e sensores de presença.',
    tags: ['Vidro Reflecta', 'Sensores LED', 'Ilhas Centrais']
  },
  {
    icon: Tv,
    title: 'Salas & Home Theater',
    ambiente: 'Sala',
    description: 'Painéis imponentes para TVs de grandes polegadas, racks suspensos com passagem oculta de cabos e nichos decorativos com luz focal.',
    tags: ['Efeito Mármore', 'Racks Suspensos', 'Design Acústico']
  },
  {
    icon: Briefcase,
    title: 'Home Office Executivo',
    ambiente: 'Home Office',
    description: 'Espaços projetados para foco e produtividade, com mesas sob medida, canaletas embutidas de conectividade e estantes arquitetônicas.',
    tags: ['Tomadas Embutidas', 'Estantes Iluminadas', 'Ergonomia']
  },
  {
    icon: Droplets,
    title: 'Banheiros & Lavabos',
    ambiente: 'Banheiro',
    description: 'Gabinetes e espelheiras produzidos em MDF Naval resistente a vapores e umidade, garantindo longevidade e sofisticação.',
    tags: ['100% MDF Naval', 'Espelho Bisotado', 'Divisores Acrílicos']
  },
  {
    icon: Flame,
    title: 'Espaços Gourmet & Varandas',
    ambiente: 'Espaço Gourmet',
    description: 'Áreas de lazer com bancadas reforçadas para churrasqueira e chopeira, adegas personalizadas e armários com proteção UV.',
    tags: ['Adegas Sob Medida', 'Resistência UV', 'MDF Carbono']
  },
  {
    icon: Building2,
    title: 'Móveis Corporativos',
    ambiente: 'Corporativo',
    description: 'Recepções marcantes, salas de diretoria, mesas de reunião com multimídia e consultórios com identidade visual personalizada.',
    tags: ['Balcões Curvos', 'Usinagem CNC', 'Padrão Corporativo']
  }
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBudget }) => {
  return (
    <section id="servicos" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              NOSSAS SOLUÇÕES
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            Móveis Planejados Sob Medida para{' '}
            <span className="text-gold-gradient font-serif-luxury">Todos os Ambientes</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Soluções completas com marcenaria de alto padrão, combinando estética impecável, praticidade e durabilidade.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                id={`service-card-${index}`}
                className="group rounded-2xl bg-[#121212] border border-neutral-800 hover:border-[#D4AF37]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/10"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif-luxury font-bold text-white mb-2.5 group-hover:text-[#D4AF37] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed mb-5 font-light">
                    {service.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  id={`quote-service-${index}`}
                  onClick={() => onOpenBudget(service.ambiente)}
                  className="w-full pt-3 border-t border-neutral-800 text-xs font-semibold text-[#D4AF37] group-hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Orçar este ambiente</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
