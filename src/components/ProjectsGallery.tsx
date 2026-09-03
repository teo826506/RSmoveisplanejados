import React, { useState } from 'react';
import { Sparkles, Eye, ArrowUpRight, Search, Layers, Filter } from 'lucide-react';
import { Projeto, CategoriaProjeto } from '../types';

interface ProjectsGalleryProps {
  projects: Projeto[];
  onSelectProject: (project: Projeto) => void;
  onOpenBudget: (ambientePreSelecionado?: string) => void;
}

const CATEGORIES: CategoriaProjeto[] = [
  'Todas',
  'Cozinhas',
  'Quartos',
  'Closets',
  'Salas',
  'Home Office',
  'Banheiros',
  'Espaço Gourmet',
  'Corporativo',
];

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({
  projects,
  onSelectProject,
  onOpenBudget,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoriaProjeto>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === 'Todas' ||
      p.categoria.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projetos" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs">
              PORTFÓLIO EXCLUSIVO
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            Modelos de Móveis por{' '}
            <span className="text-gold-gradient font-serif-luxury">Ambiente & Categoria</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Conheça nossos modelos de móveis planejados sob medida em 100% MDF de alto padrão. Exemplos reais para você se inspirar e personalizar cada espaço.
          </p>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              const count =
                cat === 'Todas'
                  ? projects.length
                  : projects.filter((p) => p.categoria.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              id="projects-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ambiente..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/90 border border-neutral-800 focus:border-[#D4AF37] rounded-full text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
            <Layers className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Nenhum projeto encontrado</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Não encontramos projetos para a categoria ou busca selecionada.
            </p>
            <button
              onClick={() => {
                setActiveCategory('Todas');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              Ver todos os projetos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="group relative rounded-2xl bg-[#121212] border border-neutral-800/80 hover:border-[#D4AF37]/60 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10 flex flex-col justify-between"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  <img
                    src={project.imagemPrincipal}
                    alt={project.titulo}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
                      {project.categoria}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {project.destaque && (
                    <div className="absolute top-4 right-4">
                      <span className="p-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center backdrop-blur-md" title="Projeto em Destaque">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}

                  {/* Quick View Button Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      id={`view-details-${project.id}`}
                      onClick={() => onSelectProject(project)}
                      className="px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs tracking-wider uppercase flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#e6c24d]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {project.titulo}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {project.descricao}
                    </p>

                    {/* Key materials badges */}
                    {project.materiais && project.materiais.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.materiais.slice(0, 2).map((m, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                          >
                            {m}
                          </span>
                        ))}
                        {project.materiais.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400">
                            +{project.materiais.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-semibold text-neutral-300 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                    >
                      <span>Galeria completa</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenBudget(project.categoria)}
                      className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
                    >
                      Pedir Orçamento
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-neutral-900 via-[#151515] to-neutral-900 border border-[#D4AF37]/30 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-3">
              Tem um projeto personalizado em mente?
            </h3>
            <p className="text-sm text-neutral-300 mb-6 font-light">
              Envie sua planta ou medidas para recebermos uma proposta técnica exclusiva em 100% MDF sob medida.
            </p>
            <button
              id="gallery-bottom-budget-btn"
              onClick={() => onOpenBudget()}
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              SOLICITAR ORÇAMENTO AGORA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
