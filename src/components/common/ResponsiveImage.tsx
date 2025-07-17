import React, { useState, useRef, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Definir diferentes tamaños para diferentes breakpoints
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==',
  onLoad,
  onError,
  breakpoints = {
    sm: 280,
    md: 350, 
    lg: 400,
    xl: 450
  }
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generar srcSet optimizado para ImageKit
  const generateSrcSet = (baseUrl: string) => {
    if (!baseUrl || !baseUrl.includes('imagekit.io')) {
      return baseUrl;
    }

    const sizes = [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl].filter(Boolean) as number[];
    return sizes
      .map(size => `${optimizeImageKitUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  };

  // Optimizar URLs de ImageKit
  const optimizeImageKitUrl = (url: string, width: number) => {
    if (!url.includes('imagekit.io')) return url;
    
    // Si ya tiene transformaciones, las mantenemos y agregamos el width
    if (url.includes('/tr:')) {
      return url.replace('/tr:', `/tr:w-${width},q-80,f-webp,`);
    }
    
    // Si no tiene transformaciones, las agregamos
    const parts = url.split('/');
    const trIndex = parts.findIndex(part => part.includes('photos_products'));
    if (trIndex > 0) {
      parts.splice(trIndex, 0, `tr:w-${width},q-80,f-webp`);
      return parts.join('/');
    }
    
    return url;
  };

  // Obtener la imagen optimizada para el tamaño base
  const getOptimizedSrc = (url: string) => {
    if (!url.includes('imagekit.io')) return url;
    return optimizeImageKitUrl(url, breakpoints.md || 350);
  };

  const srcSet = generateSrcSet(src);
  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder mientras carga */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={`${className} absolute inset-0 w-full h-full object-cover opacity-50`}
          aria-hidden="true"
        />
      )}

      {/* Imagen principal */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      )}

      {/* Imagen de error */}
      {hasError && (
        <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-400 text-sm`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Hook para optimizar imágenes específicamente para ImageKit
export const useImageKitOptimization = () => {
  const optimizeUrl = (url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}) => {
    if (!url || !url.includes('imagekit.io')) return url;
    
    const { width = 400, height, quality = 80, format = 'webp' } = options;
    
    const transformations = [
      `w-${width}`,
      height ? `h-${height}` : null,
      `q-${quality}`,
      `f-${format}`
    ].filter(Boolean).join(',');
    
    if (url.includes('/tr:')) {
      return url.replace('/tr:', `/tr:${transformations},`);
    }
    
    const parts = url.split('/');
    const trIndex = parts.findIndex(part => part.includes('photos_products'));
    if (trIndex > 0) {
      parts.splice(trIndex, 0, `tr:${transformations}`);
      return parts.join('/');
    }
    
    return url;
  };
  
  return { optimizeUrl };
};
