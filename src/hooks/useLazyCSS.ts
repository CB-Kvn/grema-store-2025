import { useEffect } from 'react';

interface LazyStylesheet {
  href: string;
  id: string;
  condition?: () => boolean;
}

export const useLazyCSS = (stylesheets: LazyStylesheet[]) => {
  useEffect(() => {
    const loadedStylesheets = new Set<string>();

    const loadStylesheet = (stylesheet: LazyStylesheet) => {
      if (loadedStylesheets.has(stylesheet.id)) return;
      
      // Check condition if provided
      if (stylesheet.condition && !stylesheet.condition()) return;

      const existingLink = document.getElementById(stylesheet.id);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylesheet.href;
      link.id = stylesheet.id;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
        loadedStylesheets.add(stylesheet.id);
      };
      
      document.head.appendChild(link);
    };

    // Load stylesheets with a small delay to prioritize critical CSS
    const timeoutId = setTimeout(() => {
      stylesheets.forEach(loadStylesheet);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [stylesheets]);
};

// Preload critical CSS for better performance
export const preloadCSS = (href: string, id: string) => {
  const existingLink = document.getElementById(id);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.id = `preload-${id}`;
  link.onload = () => {
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = href;
    styleLink.id = id;
    document.head.appendChild(styleLink);
  };
  
  document.head.appendChild(link);
};

// Critical CSS loader for above-the-fold content
export const loadCriticalCSS = async () => {
  try {
    // Load critical CSS file
    const response = await fetch('/src/styles/critical.css');
    const criticalCSS = await response.text();
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.id = 'critical-css';
    document.head.appendChild(style);
  } catch (error) {
    console.warn('Failed to load critical CSS:', error);
    // Fallback critical CSS
    const fallbackCSS = `
      .loading-screen { display: flex; justify-content: center; align-items: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; }
      .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
      @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;
    
    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    style.id = 'critical-css-fallback';
    document.head.appendChild(style);
  }
};

// Load non-critical CSS
export const loadNonCriticalCSS = () => {
  const loadStylesheet = (href: string, id: string) => {
    if (document.getElementById(id)) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    
    document.head.appendChild(link);
  };

  // Load non-critical styles after a delay
  setTimeout(() => {
    loadStylesheet('/src/styles/non-critical.css', 'non-critical-css');
  }, 500);
};

// Optimized CSS loading for specific libraries
export const loadLibraryCSS = {
  swiper: () => {
    if (document.getElementById('swiper-css')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    link.id = 'swiper-css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    
    document.head.appendChild(link);
  },
  
  aos: () => {
    if (document.getElementById('aos-css')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    link.id = 'aos-css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    
    document.head.appendChild(link);
  },
  
  datepicker: () => {
    if (document.getElementById('datepicker-css')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/react-datepicker@4.21.0/dist/react-datepicker.min.css';
    link.id = 'datepicker-css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    
    document.head.appendChild(link);
  }
};