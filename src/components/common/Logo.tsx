import React from 'react';

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
  const logoAvif = variant === 'black' ? '/Logo en negro.avif' : '/Logo en blamco.avif';
  
  // Generate responsive srcSet for different screen sizes
  const avifSrcSet = `${logoAvif} 128w, ${logoAvif} 192w, ${logoAvif} 256w, ${logoAvif} 320w`;
  const webpSrcSet = `${logoWebp} 128w, ${logoWebp} 192w, ${logoWebp} 256w, ${logoWebp} 320w`;
  const pngSrcSet = `${logoSrc} 128w, ${logoSrc} 192w, ${logoSrc} 256w, ${logoSrc} 320w`;
  
  return (
    <picture onClick={onClick} className={`cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}>
      <source srcSet={avifSrcSet} type="image/avif" sizes={sizes} />
      <source srcSet={webpSrcSet} type="image/webp" sizes={sizes} />
      <img
        src={logoSrc}
        srcSet={pngSrcSet}
        alt="Grema Store"
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        width={256}
        height={96}
        sizes={sizes}
        decoding="async"
      />
    </picture>
  );
};

// Specialized component for LCP optimization
export const LCPLogo: React.FC<Omit<LogoProps, 'priority'>> = (props) => {
  return <Logo {...props} priority={true} />;
};
