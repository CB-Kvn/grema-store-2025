import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index.ts';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { AuthProvider } from './context/ContextAuth.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { preloadCriticalCSS } from './lib/css-optimization';

// Lazy loading de componentes principales
const App = lazy(() => import('./App.tsx'));
const GoogleOAuthProvider = lazy(() => import('@react-oauth/google').then(module => ({ default: module.GoogleOAuthProvider })));
const ConfettiBackground = lazy(() => import('./components/common/ConfettiBackground').catch(() => ({ default: () => null })));

// Fallback para motion si no está disponible inmediatamente
const motion = {
  div: 'div' as any
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-primary-600 font-medium">Cargando...</p>
    </div>
  </div>
);

// Optimización de carga: Service Worker y CSS crítico
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Cargar service worker de forma diferida
    setTimeout(() => {
      navigator.serviceWorker.register('/workers/signAlive.js')
        .then(registration => {
          console.log('SW registered: ', registration);
          // Espera a que el service worker esté listo y envía la URL
          if (registration.active) {
            registration.active.postMessage({
              type: 'SET_API_URL',
              url: import.meta.env.VITE_API_URL + '/health', // O process.env.REACT_APP_API_URL + '/health'
            });
          } else if (registration.installing) {
            registration.installing.addEventListener('statechange', (event: any) => {
              if (event.target.state === 'activated') {
                registration.active?.postMessage({
                  type: 'SET_API_URL',
                  url: import.meta.env.VITE_API_URL + '/health',
                });
              }
            });
          }
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }, 2000);
    
    // Precargar CSS crítico
    preloadCriticalCSS();
  });
}

// Obtener el elemento root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Crear root una sola vez
const root = createRoot(rootElement);

root.render(
  <HelmetProvider>
    <Suspense fallback={<LoadingFallback />}>
      <GoogleOAuthProvider clientId="298483544989-79j1970tm0q2i8jjrn1rq4r7mrkptpgg.apps.googleusercontent.com" >
        <AuthProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <TooltipProvider>
                <Suspense fallback={<div>Cargando efectos...</div>}>
                  <ConfettiBackground />
                </Suspense>
                <App />
              </TooltipProvider>
            </PersistGate>
          </Provider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Suspense>
  </HelmetProvider>
);
