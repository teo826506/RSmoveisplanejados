import React, { useState } from 'react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles, MessageCircle, Layers } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos: string[];
  onOpenBudget: (ambiente?: string) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onOpenBudget,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(12);

  const visiblePhotos = photos.slice(0, displayCount);
  const hasMore = displayCount < photos.length;

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : (prev as number) - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : (prev as number) + 1));
  };

  if (!photos || photos.length === 0) return null;

  return (
    <section id="galeria" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-neutral-900">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] font-display-rs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              GALERIA DE FOTOS REALIZADAS
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4">
            Fotos de Nossos <span className="text-gold-gradient font-serif-luxury">Trabalhos & Ambientes</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Confira detalhes reais dos nossos móveis instalados. Cada foto reflete a qualidade do nosso MDF 100%, acabamento de luxo e atenção aos detalhes.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{photos.length} Fotos Registradas na Galeria</span>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {visiblePhotos.map((url, index) => (
            <div
              key={index}
              onClick={() => handleOpenLightbox(index)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-[#D4AF37]/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)] hover:-translate-y-1"
            >
              <img
                src={url}
                alt={`Foto de Ambiente RS Móveis ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 shadow-md">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#D4AF37] font-mono tracking-wider font-bold uppercase">
                    Ambiente #{index + 1}
                  </span>
                  <p className="text-white text-xs font-semibold line-clamp-1">
                    Ver em alta resolução
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setDisplayCount((prev) => Math.min(prev + 12, photos.length))}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Carregar Mais Fotos ({photos.length - displayCount} restantes)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={handleCloseLightbox}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-neutral-900/80 text-white hover:text-[#D4AF37] border border-neutral-700 hover:border-[#D4AF37] transition-all z-10"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 text-white hover:text-[#D4AF37] border border-neutral-700 hover:border-[#D4AF37] transition-all z-10"
            title="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextPhoto}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 text-white hover:text-[#D4AF37] border border-neutral-700 hover:border-[#D4AF37] transition-all z-10"
            title="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Foto de Galeria ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-2">
              <div className="text-left">
                <span className="text-xs text-[#D4AF37] font-mono tracking-widest uppercase">
                  Foto {selectedPhotoIndex + 1} de {photos.length}
                </span>
                <h4 className="text-white text-sm sm:text-base font-semibold">
                  Móvel Planejado RS Móveis 100% MDF
                </h4>
              </div>
              <button
                onClick={() => {
                  handleCloseLightbox();
                  onOpenBudget();
                }}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Quero um Orçamento Deste Modelo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
