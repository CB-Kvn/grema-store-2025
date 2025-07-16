import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTQxYTlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FyZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') return;

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
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageProps = {
    ref: imgRef,
    alt,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    width,
    height,
    loading,
    onLoad: handleLoad,
    onError: handleError,
  };

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder mientras carga */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={`${className} absolute inset-0 w-full h-full object-cover`}
          width={width}
          height={height}
        />
      )}

      {/* Imagen principal */}
      {isInView && !hasError && (
        <img
          {...imageProps}
          src={src}
        />
      )}

      {/* Imagen de error */}
      {hasError && (
        <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-400 text-sm`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Hook para optimizar imágenes
export const useImageOptimization = () => {
  const optimizeImageUrl = (url: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }) => {
    if (!url) return url;
    
    // Si usas un CDN como Cloudinary, puedes optimizar aquí
    // Por ejemplo: cloudinary.com/image/fetch/w_400,h_300,q_auto,f_auto/your-image.jpg
    
    const params = new URLSearchParams();
    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    if (options?.quality) params.append('q', options.quality.toString());
    if (options?.format) params.append('f', options.format);
    
    // Por ahora devolvemos la URL original
    // En producción, implementarías la optimización con tu CDN
    return url;
  };

  const generateSrcSet = (baseUrl: string, sizes: number[]) => {
    return sizes
      .map(size => `${optimizeImageUrl(baseUrl, { width: size })} ${size}w`)
      .join(', ');
  };

  return {
    optimizeImageUrl,
    generateSrcSet,
  };
};
