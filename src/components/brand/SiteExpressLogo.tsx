import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  isDark?: boolean;
  className?: string;
}

export const SiteExpressLogo: React.FC<Props> = ({
  size = 'md',
  isDark = false,
  className = '',
}) => {
  const heightClass = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/image_b2520642.png"
        alt="Site Express"
        className={`${heightClass} w-auto object-contain transition-all duration-300 ${
          isDark
            ? 'filter invert brightness-110 hue-rotate-180 mix-blend-screen'
            : 'mix-blend-multiply'
        }`}
      />
    </div>
  );
};

