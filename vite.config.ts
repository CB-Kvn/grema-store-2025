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
      minify: 'terser',
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            swiper: ['swiper'],
            aos: ['aos'],
            datepicker: ['react-datepicker'],
            skeleton: ['react-loading-skeleton'],
            driver: ['driver.js']
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(extType)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      cssCodeSplit: true,
      target: 'esnext',
      sourcemap: false
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
