import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings?: SiteSettings;
}

const VIDEO_W = 200;
const VIDEO_H = 120;

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPosition({
      x: Math.max(8, window.innerWidth - VIDEO_W - 12),
      y: Math.max(8, window.innerHeight - VIDEO_H - 12),
    });
  }, []);

  const whatsappNumero = (settings?.whatsappNumero || '5511999998888').replace(/\D/g, '');
  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de tirar dúvidas e solicitar um orçamento de móveis planejados em MDF com a RS Móveis.'
    );
    window.open(`https://wa.me/${whatsappNumero}?text=${text}`, '_blank');
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!position) return;
    e.preventDefault();
    dragRef.current = { offsetX: e.clientX - position.x, offsetY: e.clientY - position.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const maxX = Math.max(8, window.innerWidth - VIDEO_W - 8);
    const maxY = Math.max(8, window.innerHeight - VIDEO_H - 8);
    const x = Math.min(Math.max(8, e.clientX - dragRef.current.offsetX), maxX);
    const y = Math.min(Math.max(8, e.clientY - dragRef.current.offsetY), maxY);
    setPosition({ x, y });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <>
      {/* WhatsApp shortcut on the left side */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        <button
          onClick={handleOpenWhatsApp}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(16,185,129,0.45)] hover:scale-110 transition-all duration-300 group"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Draggable floating site logo video (always playing) */}
      {position && (
        <div
          className="fixed z-40 cursor-grab active:cursor-grabbing select-none touch-none"
          style={{ left: position.x, top: position.y }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <video
            ref={videoRef}
            src="/uploads/logo-rs.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-40 sm:w-48 aspect-video object-contain rounded-2xl border border-[#D4AF37]/50 bg-black/40 backdrop-blur-sm shadow-[0_0_35px_rgba(212,175,55,0.35)] pointer-events-none"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          />
        </div>
      )}
    </>
  );
};