import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/tour.css';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/ContextAuth.tsx';
import { HelmetProvider } from 'react-helmet-async';

// Componente de fondo confeti animado (líneas más gruesas)
function ConfettiBackground() {
  // Genera 40 líneas con posiciones y animaciones aleatorias
  const lines = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const rotate = Math.random() * 360;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2;
    const color = [
      "bg-primary-200",
      "bg-primary-300",
      "bg-primary-400",
      "bg-primary-100",
      "bg-primary-50",
      "bg-pink-200",
    ][Math.floor(Math.random() * 9)];

    return (
      <motion.div
        key={i}
        className={`absolute ${color} rounded-full`}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: "5px",
          height: `${16 + Math.random() * 24}px`,
          rotate,
          opacity: 0.7,
        }}
        initial={{ y: 0, opacity: 0.7 }}
        animate={{ y: [0, 20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{
          repeat: Infinity,
          duration,
          delay,
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-10]"
      aria-hidden="true"
      style={{ background: "#fff" }}
    >
      {lines}
    </div>
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/workers/signAlive.js')
      .then(registration => {
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
      });
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
    <GoogleOAuthProvider clientId="298483544989-79j1970tm0q2i8jjrn1rq4r7mrkptpgg.apps.googleusercontent.com" >
      <AuthProvider>
      <Provider store={store}>
        <TooltipProvider>
          <ConfettiBackground />
          <App />
        </TooltipProvider>
      </Provider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);
