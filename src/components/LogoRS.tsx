import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LogoRSProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  withGlow?: boolean;
  withShimmer?: boolean;
  className?: string;
  onClick?: () => void;
  logoUrl?: string;
}

export const LogoRS: React.FC<LogoRSProps> = ({
  size = 'md',
  showSubtitle = true,
  withGlow = true,
  withShimmer = true,
  className = '',
  onClick,
  logoUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimensions scaling
  const dimensions = {
    sm: { svgW: 70, svgH: 48, titleSize: 'text-[9px]', subSize: 'text-[7px]', lineW: 'w-2.5', gap: 'gap-0.5' },
    md: { svgW: 95, svgH: 62, titleSize: 'text-[11px]', subSize: 'text-[8.5px]', lineW: 'w-4', gap: 'gap-1' },
    lg: { svgW: 130, svgH: 82, titleSize: 'text-[13px]', subSize: 'text-[10px]', lineW: 'w-6', gap: 'gap-1.5' },
    xl: { svgW: 160, svgH: 100, titleSize: 'text-base', subSize: 'text-xs', lineW: 'w-8', gap: 'gap-2' },
    hero: { svgW: 210, svgH: 135, titleSize: 'text-xl', subSize: 'text-sm', lineW: 'w-12', gap: 'gap-2.5' },
  }[size];

  const hasCustomLogo = Boolean(logoUrl && logoUrl.trim() !== '' && !imageError);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Dynamic Gold Glow Aurora Behind Logo */}
      {withGlow && (
        <div
          className={`absolute -inset-2 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.45)_0%,rgba(247,231,169,0.2)_40%,transparent_70%)] blur-xl pointer-events-none transition-all duration-700 ${
            size === 'hero' || size === 'xl' ? 'opacity-80 scale-125' : 'opacity-65 group-hover:opacity-100 group-hover:scale-110'
          }`}
        />
      )}

      {/* Custom Image Logo or SVG Monogram RS */}
      <div className="relative z-10 flex items-center justify-center">
        {hasCustomLogo ? (
          <img
            src={logoUrl}
            alt="Logo RS Móveis Planejados"
            onError={() => setImageError(true)}
            style={{ maxHeight: `${dimensions.svgH * 1.15}px`, maxWidth: `${dimensions.svgW * 1.8}px` }}
            className="object-contain drop-shadow-[0_4px_18px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_6px_28px_rgba(255,235,140,0.85)] transition-all duration-500 transform group-hover:scale-[1.03]"
          />
        ) : (
          <svg
            style={{ width: `${dimensions.svgW}px`, height: `${dimensions.svgH}px` }}
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_18px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_6px_28px_rgba(255,235,140,0.85)] transition-all duration-500 transform group-hover:scale-[1.03]"
          >
            <defs>
              {/* Ultra Polished 24k Gold Metallic Linear Gradient */}
              <linearGradient id="gold24kGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFB" />
                <stop offset="18%" stopColor="#FFF2B2" />
                <stop offset="42%" stopColor="#E5C158" />
                <stop offset="68%" stopColor="#D4AF37" />
                <stop offset="85%" stopColor="#AA7C11" />
                <stop offset="100%" stopColor="#6E4D05" />
              </linearGradient>

              {/* Specular Edge Highlight Gradient */}
              <linearGradient id="goldBevelHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8A600B" stopOpacity="0.5" />
              </linearGradient>

              {/* Inner Shadow & Depth Filter */}
              <filter id="goldDepth3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.9" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Background subtle gold shield contour */}
            <path
              d="M60 4 L108 14 C108 46 86 68 60 76 C34 68 12 46 12 14 Z"
              fill="rgba(10,10,10,0.4)"
              stroke="url(#gold24kGloss)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.45"
            />

            <g filter="url(#goldDepth3D)">
              {/* Letter 'R' with beveled contours */}
              <path
                d="M18 12 H48 C60 12 68 19 68 30 C68 39 61 46 49 47 L64 70 H48 L35 48 H29 V70 H18 V12 Z M29 22 V38 H47 C52 38 56 35 56 30 C56 25 52 22 47 22 H29 Z"
                fill="url(#gold24kGloss)"
                stroke="url(#goldBevelHighlight)"
                strokeWidth="0.75"
              />

              {/* Letter 'S' overlapping with dimensional flow */}
              <path
                d="M102 24 C97 15 85 11 71 11 C52 11 44 20 44 32 C44 51 77 43 77 56 C77 63 68 66 59 66 C47 66 38 59 34 50 L24 59 C31 71 45 77 59 77 C80 77 91 66 91 54 C91 34 58 42 58 29 C58 23 66 20 71 20 C80 20 87 24 90 31 L102 24 Z"
                fill="url(#gold24kGloss)"
                stroke="url(#goldBevelHighlight)"
                strokeWidth="0.75"
              />
            </g>

            {/* Sparkle Glint at top intersection */}
            {withShimmer && (
              <circle cx="48" cy="12" r="2.5" fill="#FFFFFF" className="animate-ping opacity-75" />
            )}
          </svg>
        )}
      </div>

      {/* Typography Brand Block Below Logo */}
      {showSubtitle && (
        <div className={`relative z-10 flex flex-col items-center text-center mt-1 ${dimensions.gap}`}>
          <span
            className={`font-extrabold tracking-[0.26em] uppercase text-white font-display-rs ${dimensions.titleSize} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}
          >
            RS MÓVEIS PLANEJADOS
          </span>

          <div className="flex items-center justify-center gap-2 w-full">
            <div className={`h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFF6D5] ${dimensions.lineW}`} />
            <span
              className={`font-bold tracking-[0.32em] uppercase font-display-rs text-gold-gradient ${dimensions.subSize}`}
            >
              EM MDF DE ALTO PADRÃO
            </span>
            <div className={`h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFF6D5] ${dimensions.lineW}`} />
          </div>
        </div>
      )}
    </div>
  );
};
