import React, { useState } from 'react';
import { Play, Youtube, Sparkles, PlusCircle, Film, ExternalLink, X, Clock, Eye } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoShowcaseProps {
  videos: VideoItem[];
  onOpenConfig: () => void;
  onOpenBudget: () => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videos,
  onOpenConfig,
  onOpenBudget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const categories = ['Todas', 'Cozinhas', 'Closets', 'Processo Fabril', 'Depoimentos'];

  const filteredVideos = videos.filter((v) => {
    if (!v.ativo) return false;
    if (selectedCategory === 'Todas') return true;
    return v.categoria.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getEmbedUrl = (video: VideoItem) => {
    if (video.tipo === 'YOUTUBE' || video.youtubeId) {
      const id = video.youtubeId || (video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) || [])[1];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return video.url;
  };

  return (
    <section id="videos" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#D4AF37]/20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="text-[11px] sm:text-xs tracking-[0.28em] font-bold text-[#D4AF37] uppercase font-display-rs flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> EXPERIÊNCIA AUDIOVISUAL & TOURS 3D
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase font-display-rs tracking-tight">
              PROJETOS EM <span className="text-gold-gradient">VÍDEO & YOUTUBE</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 font-light">
              Assista a tours completos, detalhes de ferragens especiais e a transformação real de ambientes executados pela RS Móveis Planejados.
            </p>
          </div>

          {/* Action to Config / CMS */}
          <div className="flex items-center gap-3">
            <button
              id="showcase-add-video-btn"
              onClick={onOpenConfig}
              className="px-4 py-2.5 rounded-lg border border-[#D4AF37]/60 bg-[#161208] text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/20 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Gerenciar Vídeos & Fotos</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-neutral-900/80 text-neutral-300 border border-neutral-800 hover:border-[#D4AF37]/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group relative rounded-2xl bg-[#111111] border border-neutral-800/80 hover:border-[#D4AF37]/60 overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.2)] flex flex-col"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video w-full overflow-hidden cursor-pointer bg-black"
                onClick={() => setActiveVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Big Golden Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 border-2 border-[#D4AF37] backdrop-blur-sm flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                    {video.categoria}
                  </span>
                  {video.destaque && (
                    <span className="px-2 py-1 rounded-md bg-[#D4AF37] text-black text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" /> DESTAQUE
                    </span>
                  )}
                </div>

                {/* Duration / YouTube badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {video.tipo === 'YOUTUBE' && (
                    <span className="px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-bold flex items-center gap-1">
                      <Youtube className="w-3 h-3" /> YouTube
                    </span>
                  )}
                  {video.duracao && (
                    <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" /> {video.duracao}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Block */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFE57F] transition-colors line-clamp-2 cursor-pointer font-display-rs leading-snug"
                  >
                    {video.titulo}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 mt-2 font-light leading-relaxed">
                    {video.descricao}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFF] flex items-center gap-1.5 transition-colors uppercase tracking-wider font-display-rs"
                  >
                    <Eye className="w-3.5 h-3.5" /> Assistir Vídeo
                  </button>

                  <button
                    onClick={onOpenBudget}
                    className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    Pedir Projeto Similar →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with YouTube CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#181307] via-[#101010] to-[#181307] border border-[#D4AF37]/35 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white uppercase font-display-rs">
                Acompanhe Nosso Canal Oficial no YouTube
              </h4>
              <p className="text-xs text-neutral-400">
                Novos vídeos semanais de instalações reais, dicas de materiais em MDF e projetos 3D.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-red-900/30"
            >
              <Youtube className="w-4 h-4" />
              <span>Inscrever-se no Canal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          id="video-player-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#111111] rounded-2xl border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase block">
                  {activeVideo.categoria} • RS MÓVEIS PLANEJADOS
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display-rs">
                  {activeVideo.titulo}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe / Player */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.tipo === 'YOUTUBE' || activeVideo.youtubeId ? (
                <iframe
                  src={getEmbedUrl(activeVideo)}
                  title={activeVideo.titulo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 sm:p-5 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-400 font-light max-w-lg">
                {activeVideo.descricao}
              </p>
              <button
                onClick={() => {
                  setActiveVideo(null);
                  onOpenBudget();
                }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-md shrink-0"
              >
                Solicitar Orçamento Deste Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
