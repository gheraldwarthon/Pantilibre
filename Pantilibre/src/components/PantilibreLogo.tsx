import React from 'react';

interface PantilibreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  subtitleClassName?: string;
}

export const PantilibreLogo: React.FC<PantilibreLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
  subtitleClassName = 'text-[#D4AF37]'
}) => {
  const sizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11 md:h-12',
    lg: 'h-14 sm:h-16 md:h-18',
    xl: 'h-18 sm:h-22 md:h-26 max-w-full'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-start select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className="relative flex items-center">
        {/* Targeted element: 3D semi-gloss golden letters PANTILIBRE */}
        <span className="relative flex items-center px-1 py-0.5 rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_8px_24px_rgba(234,179,8,0.45)]">
          <img
            src="/logo-pantilibre.svg"
            alt="PANTILIBRE"
            className={`${sizeClasses[size]} w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] filter brightness-[1.04] contrast-[1.05] transition-all`}
            loading="eager"
          />
        </span>
      </div>

      {showSubtitle && (
        <span className={`text-[10px] sm:text-xs font-extrabold tracking-[0.26em] uppercase mt-1 pl-1 drop-shadow-sm ${subtitleClassName}`}>
          Club Privado & Lujo Fetichista
        </span>
      )}
    </div>
  );
};
