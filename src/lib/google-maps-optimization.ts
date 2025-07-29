// Optimización de carga de Google Maps
import React, { useState, useEffect } from 'react';

interface GoogleMapsConfig {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
}

let googleMapsLoaded = false;
let googleMapsPromise: Promise<void> | null = null;

// Cargar Google Maps de forma diferida
export const loadGoogleMaps = (config: GoogleMapsConfig): Promise<void> => {
  if (googleMapsLoaded) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: config.apiKey,
      libraries: config.libraries?.join(',') || 'places,geometry',
      language: config.language || 'es',
      region: config.region || 'CO',
      loading: 'async',
      callback: 'initGoogleMaps'
    });

    // Callback global para cuando Google Maps se carga
    (window as any).initGoogleMaps = () => {
      googleMapsLoaded = true;
      delete (window as any).initGoogleMaps;
      resolve();
    };

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Precargar Google Maps en idle time
export const preloadGoogleMaps = (config: GoogleMapsConfig) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      loadGoogleMaps(config).catch(console.warn);
    }, { timeout: 5000 });
  } else {
    setTimeout(() => {
      loadGoogleMaps(config).catch(console.warn);
    }, 3000);
  }
};

// Hook para usar Google Maps con carga diferida
export const useGoogleMaps = (config: GoogleMapsConfig) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadGoogleMaps(config)
      .then(() => setIsLoaded(true))
      .catch(setError);
  }, [config.apiKey]);

  return { isLoaded, error };
};

// Componente wrapper para Google Maps
export const GoogleMapsWrapper: React.FC<{
  config: GoogleMapsConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ config, children, fallback }) => {
  const { isLoaded, error } = useGoogleMaps(config);

  if (error) {
    return <div>Error cargando Google Maps: {error.message}</div>;
  }

  if (!isLoaded) {
    return fallback || <div>Cargando Google Maps...</div>;
  }

  return <>{children}</>;
};

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}