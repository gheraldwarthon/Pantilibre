import React from 'react';

interface PantilibreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  subtitleClassName?: string;
}

const sizeClasses = {
  sm: 'h-8 sm:h-9',
  md: 'h-10 sm:h-12 md:h-14',
  lg: 'h-16 sm:h-20 md:h-24',
  xl: 'h-20 sm:h-28 md:h-36 max-w-full'
};

export const PantilibreLogo: React.FC<PantilibreLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
  subtitleClassName = 'text-[#D4AF37]'
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-start select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <img
        src="/assets/images/LOGO_PANTILIBRE_1.png"
        alt="PANTILIBRE"
        className={`${sizeClasses[size]} w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_8px_24px_rgba(234,179,8,0.45)]`}
        loading="eager"
      />

      {showSubtitle && (
        <span className={`text-[10px] sm:text-xs font-extrabold tracking-[0.26em] uppercase mt-1 pl-1 drop-shadow-sm ${subtitleClassName}`}>
          Club Privado & Lujo Fetichista
        </span>
      )}
    </div>
  );
};
