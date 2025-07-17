interface EnvironmentConfig {
  APP_ENV: 'development' | 'staging' | 'production';
  API_URL: string;
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  DEBUG_MODE: boolean;
  ENABLE_LOGS: boolean;
  ENABLE_REDUX_DEVTOOLS: boolean;
  PAYMENT_GATEWAY_URL: string;
  ANALYTICS_ENABLED: boolean;
  SENTRY_ENABLED: boolean;
  SENTRY_DSN?: string;
  IMAGE_OPTIMIZATION: boolean;
  CDN_URL: string;
  CACHE_TTL: number;
  GOOGLE_ANALYTICS_ID?: string;
  FACEBOOK_PIXEL_ID?: string;
}

// Función para convertir string a boolean
const stringToBoolean = (value: string | undefined): boolean => {
  return value === 'true';
};

// Función para obtener número desde string
const stringToNumber = (value: string | undefined, defaultValue: number): number => {
  const parsed = parseInt(value || '', 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Configuración del ambiente actual
export const config: EnvironmentConfig = {
  APP_ENV: (import.meta.env.VITE_APP_ENV as EnvironmentConfig['APP_ENV']) || 'development',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  DEBUG_MODE: stringToBoolean(import.meta.env.VITE_DEBUG_MODE),
  ENABLE_LOGS: stringToBoolean(import.meta.env.VITE_ENABLE_LOGS),
  ENABLE_REDUX_DEVTOOLS: stringToBoolean(import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS),
  PAYMENT_GATEWAY_URL: import.meta.env.VITE_PAYMENT_GATEWAY_URL || '',
  ANALYTICS_ENABLED: stringToBoolean(import.meta.env.VITE_ANALYTICS_ENABLED),
  SENTRY_ENABLED: stringToBoolean(import.meta.env.VITE_SENTRY_ENABLED),
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  IMAGE_OPTIMIZATION: stringToBoolean(import.meta.env.VITE_IMAGE_OPTIMIZATION),
  CDN_URL: import.meta.env.VITE_CDN_URL || 'http://localhost:3000',
  CACHE_TTL: stringToNumber(import.meta.env.VITE_CACHE_TTL, 300),
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  FACEBOOK_PIXEL_ID: import.meta.env.VITE_FACEBOOK_PIXEL_ID,
};

// Funciones de utilidad para verificar el ambiente
export const isDevelopment = () => config.APP_ENV === 'development';
export const isStaging = () => config.APP_ENV === 'staging';
export const isProduction = () => config.APP_ENV === 'production';

// Logger condicional
export const logger = {
  log: (...args: any[]) => {
    if (config.ENABLE_LOGS) {
      console.log('[GREMA STORE]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (config.ENABLE_LOGS) {
      console.error('[GREMA STORE ERROR]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.ENABLE_LOGS) {
      console.warn('[GREMA STORE WARNING]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (config.DEBUG_MODE) {
      console.debug('[GREMA STORE DEBUG]', ...args);
    }
  },
};

// Imprimir información del ambiente actual al cargar la configuración
console.log(
  `%c🚀 GREMA STORE - Ambiente: ${config.APP_ENV.toUpperCase()}`,
  `color: ${config.APP_ENV === 'production' ? '#22c55e' : config.APP_ENV === 'staging' ? '#f59e0b' : '#3b82f6'}; font-weight: bold; font-size: 14px;`
);

console.log('📋 Configuración actual:', {
  Ambiente: config.APP_ENV,
  'API URL': config.API_URL,
  'Base URL': config.BASE_URL,
  'Debug Mode': config.DEBUG_MODE,
  'Logs Habilitados': config.ENABLE_LOGS,
  'Redux DevTools': config.ENABLE_REDUX_DEVTOOLS,
  'Analytics': config.ANALYTICS_ENABLED,
  'Sentry': config.SENTRY_ENABLED,
  'Optimización de Imágenes': config.IMAGE_OPTIMIZATION,
});

export default config;
