import React, { useRef } from 'react';
import { SiteSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings?: SiteSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Floating site logo video */}
      <video
        ref={videoRef}
        src="/uploads/logo-rs.mp4"
        autoPlay
        muted
        loop
        playsInline
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
        className="w-40 sm:w-48 aspect-video object-contain rounded-2xl border border-[#D4AF37]/50 bg-black/40 backdrop-blur-sm shadow-[0_0_35px_rgba(212,175,55,0.35)] pointer-events-auto cursor-pointer"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      />
    </div>
  );
};