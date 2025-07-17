import React, { useState, useRef, useEffect } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Configuraciones específicas de Cloudinary
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==',
  onLoad,
  onError,
  quality = 80,
  format = 'auto',
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

  // Optimizar URLs de Cloudinary
  const optimizeCloudinaryUrl = (url: string, width: number) => {
    if (!url.includes('cloudinary.com')) return url;
    
    // Si ya tiene transformaciones, las reemplazamos
    if (url.includes('/upload/')) {
      return url.replace(
        '/upload/',
        `/upload/w_${width},q_${quality},f_${format}/`
      );
    }
    
    return url;
  };

  // Generar srcSet optimizado para Cloudinary
  const generateSrcSet = (baseUrl: string) => {
    if (!baseUrl || !baseUrl.includes('cloudinary.com')) {
      return baseUrl;
    }

    const sizes = [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl].filter(Boolean) as number[];
    return sizes
      .map(size => `${optimizeCloudinaryUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  };

  // Obtener la imagen optimizada para el tamaño base
  const getOptimizedSrc = (url: string) => {
    if (!url.includes('cloudinary.com')) return url;
    return optimizeCloudinaryUrl(url, breakpoints.md || 350);
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

// Hook para optimizar imágenes específicamente para Cloudinary
export const useCloudinaryOptimization = () => {
  const optimizeUrl = (url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
    crop?: string;
  } = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    const { width = 400, height, quality = 80, format = 'auto', crop } = options;
    
    const transformations = [
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      crop ? `c_${crop}` : null,
      `q_${quality}`,
      `f_${format}`
    ].filter(Boolean).join(',');
    
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformations}/`);
    }
    
    return url;
  };
  
  return { optimizeUrl };
};
