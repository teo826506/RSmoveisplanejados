import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de tirar dúvidas e solicitar um orçamento de móveis planejados em MDF com a RS Móveis.'
    );
    window.open(`https://wa.me/5511999998888?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Small popover tooltip */}
      {showTooltip && (
        <div className="relative bg-[#141414] border border-[#D4AF37]/50 text-white p-3 rounded-xl shadow-2xl max-w-[220px] text-xs animate-bounce hidden sm:block">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#D4AF37] uppercase text-[10px]">Projetista Online</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-snug">
            Precisa de ajuda ou quer enviar sua planta agora?
          </p>
        </div>
      )}

      {/* Pulsating button */}
      <button
        id="floating-whatsapp-trigger"
        onClick={handleOpenWhatsApp}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(16,185,129,0.45)] hover:scale-110 transition-all duration-300 group"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
