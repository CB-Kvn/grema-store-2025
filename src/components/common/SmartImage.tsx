import React from 'react';
import { ResponsiveImage } from './ResponsiveImage';
import { CloudinaryImage } from './CloudinaryImage';
import { OptimizedImage } from './OptimizedImage';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Para imágenes de productos
  width?: number;
  height?: number;
  // Para imágenes responsivas
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const SmartImage: React.FC<SmartImageProps> = (props) => {
  const { src, ...restProps } = props;
  
  // Detectar el tipo de imagen basado en la URL
  if (src.includes('imagekit.io')) {
    return <ResponsiveImage src={src} {...restProps} />;
  }
  
  if (src.includes('cloudinary.com')) {
    return <CloudinaryImage src={src} {...restProps} />;
  }
  
  // Para imágenes locales o de otros CDNs, usar OptimizedImage
  return <OptimizedImage src={src} {...restProps} />;
};

// Hook para generar los tamaños optimizados automáticamente
export const useResponsiveBreakpoints = (baseSize: number = 400) => {
  return {
    sm: Math.round(baseSize * 0.7),  // 70% del tamaño base
    md: baseSize,                    // Tamaño base
    lg: Math.round(baseSize * 1.2),  // 120% del tamaño base
    xl: Math.round(baseSize * 1.4)   // 140% del tamaño base
  };
};

// Hook para generar sizes automáticamente
export const useResponsiveSizes = (breakpoints: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) => {
  const { sm = 280, md = 350, lg = 400, xl = 450 } = breakpoints;
  
  return `(max-width: 640px) ${sm}px, (max-width: 768px) ${md}px, (max-width: 1024px) ${lg}px, ${xl}px`;
};
