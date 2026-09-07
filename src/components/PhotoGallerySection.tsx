import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_GALLERY } from '../data/initialData';

interface PhotoGallerySectionProps {
  photos: string[];
  onOpenBudget: (ambiente?: string) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
}) => {
  const activePhotos = Array.isArray(photos) && photos.length > 0 ? photos : INITIAL_GALLERY;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(12);

  const visiblePhotos = activePhotos.slice(0, displayCount);
  const hasMore = displayCount < activePhotos.length;

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === 0 ? activePhotos.length - 1 : (prev as number) - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === activePhotos.length - 1 ? 0 : (prev as number) + 1));
  };

  if (!activePhotos || activePhotos.length === 0) return null;

  return (
    <section id="galeria" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-neutral-900">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <span className="absolute top-2 left-2 flex items-center justify-center w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold font-mono shadow-md">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setDisplayCount((prev) => Math.min(prev + 12, activePhotos.length))}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Carregar Mais Fotos ({activePhotos.length - displayCount} restantes)
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

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhotos[selectedPhotoIndex]}
              alt={`Foto de Galeria ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            />
            <span className="absolute top-2 left-2 flex items-center justify-center w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 text-sm font-bold font-mono shadow-md">
              {selectedPhotoIndex + 1}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};