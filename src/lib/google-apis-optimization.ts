// Optimización de carga de Google APIs
import React, { useState, useEffect } from 'react';

interface GoogleOAuthConfig {
  clientId: string;
  scope?: string;
  cookiePolicy?: string;
}

let googleOAuthLoaded = false;
let googleOAuthPromise: Promise<void> | null = null;

// Cargar Google OAuth de forma diferida
export const loadGoogleOAuth = (config: GoogleOAuthConfig): Promise<void> => {
  if (googleOAuthLoaded) {
    return Promise.resolve();
  }

  if (googleOAuthPromise) {
    return googleOAuthPromise;
  }

  googleOAuthPromise = new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.google && window.google.accounts) {
      googleOAuthLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Esperar a que la API esté disponible
      const checkGoogleAPI = () => {
        if (window.google && window.google.accounts) {
          googleOAuthLoaded = true;
          resolve();
        } else {
          setTimeout(checkGoogleAPI, 100);
        }
      };
      checkGoogleAPI();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google OAuth'));
    };

    document.head.appendChild(script);
  });

  return googleOAuthPromise;
};

// Precargar Google OAuth en idle time
export const preloadGoogleOAuth = (config: GoogleOAuthConfig) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      loadGoogleOAuth(config).catch(console.warn);
    }, { timeout: 3000 });
  } else {
    setTimeout(() => {
      loadGoogleOAuth(config).catch(console.warn);
    }, 2000);
  }
};

// Hook para usar Google OAuth con carga diferida
export const useGoogleOAuth = (config: GoogleOAuthConfig) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadGoogleOAuth(config)
      .then(() => setIsLoaded(true))
      .catch(setError);
  }, [config.clientId]);

  return { isLoaded, error };
};

// Componente wrapper optimizado para Google OAuth
export const GoogleOAuthWrapper: React.FC<{
  config: GoogleOAuthConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ config, children, fallback }) => {
  const { isLoaded, error } = useGoogleOAuth(config);

  if (error) {
    console.warn('Error cargando Google OAuth:', error);
    return <>{children}</>; // Continuar sin OAuth si falla
  }

  if (!isLoaded) {
    return fallback || <div>Cargando autenticación...</div>;
  }

  return <>{children}</>;
};

// Función para cargar solo las APIs de Google necesarias
export const loadGoogleAPIsOnDemand = {
  oauth: (config: GoogleOAuthConfig) => loadGoogleOAuth(config),
  
  analytics: () => {
    return new Promise<void>((resolve, reject) => {
      if (window.gtag) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Analytics'));
      document.head.appendChild(script);
    });
  },
  
  recaptcha: (siteKey: string) => {
    return new Promise<void>((resolve, reject) => {
      if (window.grecaptcha) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      document.head.appendChild(script);
    });
  }
};

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    google: any;
    gtag: any;
    grecaptcha: any;
  }
}