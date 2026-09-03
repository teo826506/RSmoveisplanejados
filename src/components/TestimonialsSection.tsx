import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Dra. Camila & Dr. Marcelo',
    location: 'Jardins, São Paulo',
    project: 'Cozinha Noir Gold & Suíte Casal',
    text: 'A RS Móveis superou todas as nossas expectativas. O acabamento em MDF grafite com iluminação embutida transformou nosso apartamento. A equipe foi impecável na montagem e entregou antes do prazo.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    date: 'Julho de 2026'
  },
  {
    name: 'Eng. Ricardo Nogueira',
    location: 'Alphaville, Barueri',
    project: 'Closet Walk-In & Home Office Executivo',
    text: 'Sou muito exigente com ferragens e alinhamento de portas. O sistema de amortecimento e os perfis de alumínio com vidro reflecta ficaram no nível das marcenarias mais caras da Europa, com excelente custo-benefício.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    date: 'Agosto de 2026'
  },
  {
    name: 'Juliana Guimarães',
    location: 'Campinas, SP',
    project: 'Apartamento Completo 160m²',
    text: 'Desde a apresentação do projeto 3D até o último ajuste, fomos tratados com muito carinho e profissionalismo. Ficou um luxo! Todos os meus convidados elogiam o painel de mármore e madeira da sala.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    date: 'Agosto de 2026'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#080808] relative overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              EXPERIÊNCIAS REAIS
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            A Satisfação de Quem Já Vive em um{' '}
            <span className="text-gold-gradient font-serif-luxury">Espaço RS</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Mais de 500 ambientes entregues com nota máxima de avaliação e clientes fidelizados.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#121212] border border-neutral-800 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-[#D4AF37] mb-6">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-light italic">
                  "{item.text}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-6 border-t border-neutral-800/80 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {item.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-medium">{item.project}</p>
                  <p className="text-[10px] text-neutral-500">{item.location} • {item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
