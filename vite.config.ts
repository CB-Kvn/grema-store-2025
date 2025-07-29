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
      // Configuración de build según el ambiente
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          // Configurar nombres de archivos según ambiente
          chunkFileNames: mode === 'production' 
            ? 'assets/[name].[hash].js' 
            : 'assets/[name].js',
          assetFileNames: mode === 'production'
            ? 'assets/[name].[hash].[ext]'
            : 'assets/[name].[ext]',
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
