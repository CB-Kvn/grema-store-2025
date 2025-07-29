import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de ambiente según el modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'axios'
      ],
      // Optimizar dependencias grandes
      esbuildOptions: {
        target: 'es2020',
        supported: {
          'top-level-await': true
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Define el alias '@'
      },
    },
    // Configuración específica por ambiente
    define: {
      // Hacer disponibles las variables de ambiente en tiempo de compilación
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      // Configuración de build según el ambiente
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode !== 'production',
      // Optimizar el tamaño del chunk
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Configurar nombres de archivos según ambiente
          chunkFileNames: mode === 'production' 
            ? 'assets/[name].[hash].js' 
            : 'assets/[name].js',
          assetFileNames: mode === 'production'
            ? 'assets/[name].[hash].[ext]'
            : 'assets/[name].[ext]',
          // Optimización de chunks para reducir JavaScript no utilizado
          manualChunks: (id) => {
            // Solo crear chunks si los módulos están realmente siendo usados
            if (id.includes('node_modules')) {
              // React core
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              
              // Router
              if (id.includes('react-router')) {
                return 'router';
              }
              
              // UI Libraries (solo si se usan)
              if (id.includes('@headlessui') || id.includes('@radix-ui')) {
                return 'ui-vendor';
              }
              
              // Animation libraries
              if (id.includes('framer-motion') || id.includes('aos')) {
                return 'animation';
              }
              
              // Charts
              if (id.includes('chart.js') || id.includes('react-chartjs')) {
                return 'charts';
              }
              
              // Utilities
              if (id.includes('axios') || id.includes('date-fns') || id.includes('clsx')) {
                return 'utils';
              }
              
              // Icons
              if (id.includes('lucide-react') || id.includes('react-icons')) {
                return 'icons';
              }
              
              // Swiper
              if (id.includes('swiper')) {
                return 'swiper';
              }
              
              // Redux
              if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('redux-persist')) {
                return 'redux';
              }
              
              // Otras librerías grandes en vendor
              return 'vendor';
            }
          },
        },
        // Optimizaciones adicionales
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        },
        external: (id) => {
          // Externalizar Google APIs para cargar desde CDN
          return id.includes('googleapis.com') || id.includes('gstatic.com');
        },
      },
    },
    server: {
      // Configuración del servidor de desarrollo
      port: parseInt(env.VITE_DEV_PORT || '5173'),
      host: env.VITE_DEV_HOST || 'localhost',
      open: mode === 'development',
    },
    preview: {
      // Configuración para preview
      port: parseInt(env.VITE_PREVIEW_PORT || '4173'),
      host: env.VITE_PREVIEW_HOST || 'localhost',
    },
  };
});
