import React, { useState } from 'react';
import { X, Check, ShieldCheck, Clock, Layers, Sparkles, MessageCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Projeto, SiteSettings } from '../types';

interface ProjectModalProps {
  project: Projeto | null;
  onClose: () => void;
  onSelectForBudget: (projectTitle: string, category: string) => void;
  settings?: SiteSettings;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectForBudget,
  settings,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const images = project.imagens && project.imagens.length > 0 ? project.imagens : [project.imagemPrincipal];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppInquiry = () => {
    const whatsappNumero = settings?.whatsappNumero || '5511999998888';
    const text = encodeURIComponent(
      `Olá! Estive vendo o projeto *"${project.titulo}"* no site da RS Móveis Planejados e gostaria de solicitar um orçamento semelhante para o meu espaço.`
    );
    window.open(`https://wa.me/${whatsappNumero}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl bg-[#111111] border border-[#D4AF37]/40 rounded-2xl shadow-2xl shadow-black overflow-hidden my-8">
        {/* Close Button */}
        <button
          id="close-project-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-[#D4AF37]/40 text-neutral-300 hover:text-white hover:border-[#D4AF37] flex items-center justify-center transition-all duration-200"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery View Left */}
          <div className="lg:col-span-7 bg-black flex flex-col justify-between relative min-h-[340px] sm:min-h-[440px]">
            {/* Active Display Image */}
            <div className="relative w-full h-[320px] sm:h-[440px] overflow-hidden group">
              <img
                src={images[activeImageIndex]}
                alt={project.titulo}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Slider Arrows if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 border border-[#D4AF37]/40 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 border border-[#D4AF37]/40 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="p-3 bg-[#0a0a0a] border-t border-neutral-800 flex items-center gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Right */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#111111]">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  {project.categoria}
                </span>
                {project.destaque && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold text-white bg-neutral-800 flex items-center gap-1 border border-neutral-700">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Destaque
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-4">
                {project.titulo}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-light">
                {project.descricao}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Acabamento</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    {project.detalhes?.acabamento || '100% MDF Premium'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Prazo Médio</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    {project.detalhes?.tempoExecucao || '20 dias úteis'}
                  </p>
                </div>

                <div className="col-span-2 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Garantia de Fábrica</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    {project.detalhes?.garantia || '5 anos de garantia contra defeitos de fabricação'}
                  </p>
                </div>
              </div>

              {/* Materials List */}
              {project.materiais && project.materiais.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Materiais Utilizados
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.materiais.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-neutral-200"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-800">
              <button
                id="modal-solicitar-orcamento-btn"
                onClick={() => {
                  onClose();
                  onSelectForBudget(project.titulo, project.categoria);
                }}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#e3be47] hover:to-[#ca9614] text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>SOLICITAR ORÇAMENTO DESTE PROJETO</span>
              </button>

              <button
                id="modal-whatsapp-btn"
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-[#D4AF37]/30 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Falar com Projetista no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
