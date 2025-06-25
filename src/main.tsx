import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { motion } from 'framer-motion';

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

createRoot(document.getElementById('root')!).render(

    <GoogleOAuthProvider clientId="298483544989-79j1970tm0q2i8jjrn1rq4r7mrkptpgg.apps.googleusercontent.com" >
      <Provider store={store}>
        <TooltipProvider>

          <ConfettiBackground />

          <App />
        </TooltipProvider>

      </Provider>
    </GoogleOAuthProvider>

);
