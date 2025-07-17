import React from 'react';
import { OptimizedImage } from './OptimizedImage';

interface LogoProps {
  variant?: 'black' | 'white';
  className?: string;
  priority?: boolean; // For LCP optimization
  sizes?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'black',
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px',
  onClick,
}) => {
  const logoSrc = variant === 'black' ? '/Logo en negro.png' : '/Logo en blamco.png';
  const logoWebp = variant === 'black' ? '/Logo en negro.webp' : '/Logo en blamco.webp';
  
  return (
    <picture onClick={onClick} className={`cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}>
      <source srcSet={logoWebp} type="image/webp" />
      <OptimizedImage
        src={logoSrc}
        alt="Grema Store"
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        width={320}
        height={120}
      />
    </picture>
  );
};

// Specialized component for LCP optimization
export const LCPLogo: React.FC<Omit<LogoProps, 'priority'>> = (props) => {
  return <Logo {...props} priority={true} />;
};
