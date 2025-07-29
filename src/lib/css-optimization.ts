// Configuración para optimización de CSS y carga diferida de estilos

// Función para cargar CSS de forma diferida
export const loadCSS = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
};

// Cargar CSS crítico de forma diferida
export const loadCriticalCSS = async () => {
  try {
    // Solo cargar Swiper CSS cuando sea necesario
    if (document.querySelector('.swiper')) {
      await Promise.all([
        loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css')
      ]);
    }
  } catch (error) {
    console.warn('Error loading critical CSS:', error);
  }
};

// Cargar CSS de componentes específicos solo cuando se necesiten
export const loadComponentCSS = {
  swiper: () => {
    if (!document.querySelector('link[href*="swiper"]')) {
      return Promise.all([
        loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css')
      ]);
    }
    return Promise.resolve();
  },
  
  tour: () => {
    if (!document.querySelector('link[href*="tour"]')) {
      return loadCSS('/src/styles/tour.css');
    }
    return Promise.resolve();
  },
  
  charts: () => {
    if (!document.querySelector('link[href*="chart"]')) {
      return loadCSS('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.min.css');
    }
    return Promise.resolve();
  }
};

// Preload de CSS crítico en idle time
export const preloadCriticalCSS = () => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      loadCriticalCSS();
    });
  } else {
    setTimeout(loadCriticalCSS, 1000);
  }
};