import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Tipo para eventos de analytics
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Configuración de Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export const useAnalytics = () => {
  const location = useLocation();

  // Inicializar Google Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.gtag) {
      // Cargar Google Analytics solo en producción
      if (process.env.NODE_ENV === 'production') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer?.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    }
  }, []);

  // Trackear cambios de página
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location]);

  // Función para trackear eventos
  const trackEvent = (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // También puedes enviar a otros servicios como Facebook Pixel, etc.
    console.log('Analytics Event:', event);
  };

  // Eventos específicos para e-commerce
  const trackEcommerce = {
    // Ver producto
    viewProduct: (product: any) => {
      trackEvent({
        action: 'view_item',
        category: 'ecommerce',
        label: product.name,
        custom_parameters: {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          currency: 'CRC',
        },
      });
    },

    // Añadir al carrito
    addToCart: (product: any, quantity: number = 1) => {
      trackEvent({
        action: 'add_to_cart',
        category: 'ecommerce',
        label: product.name,
        value: product.price * quantity,
        custom_parameters: {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity,
          currency: 'CRC',
        },
      });
    },

    // Iniciar checkout
    beginCheckout: (items: any[], totalValue: number) => {
      trackEvent({
        action: 'begin_checkout',
        category: 'ecommerce',
        value: totalValue,
        custom_parameters: {
          currency: 'CRC',
          items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
    },

    // Compra completada
    purchase: (orderId: string, items: any[], totalValue: number) => {
      trackEvent({
        action: 'purchase',
        category: 'ecommerce',
        value: totalValue,
        custom_parameters: {
          transaction_id: orderId,
          currency: 'CRC',
          items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
    },

    // Búsqueda
    search: (searchTerm: string, resultsCount: number) => {
      trackEvent({
        action: 'search',
        category: 'engagement',
        label: searchTerm,
        value: resultsCount,
        custom_parameters: {
          search_term: searchTerm,
          results_count: resultsCount,
        },
      });
    },

    // Filtrar productos
    filterProducts: (filterType: string, filterValue: string) => {
      trackEvent({
        action: 'filter_products',
        category: 'engagement',
        label: `${filterType}: ${filterValue}`,
        custom_parameters: {
          filter_type: filterType,
          filter_value: filterValue,
        },
      });
    },

    // Contacto
    contact: (method: string) => {
      trackEvent({
        action: 'contact',
        category: 'engagement',
        label: method,
        custom_parameters: {
          contact_method: method,
        },
      });
    },

    // Suscripción newsletter
    subscribe: (email: string) => {
      trackEvent({
        action: 'subscribe',
        category: 'engagement',
        label: 'newsletter',
        custom_parameters: {
          email_provided: !!email,
        },
      });
    },
  };

  return {
    trackEvent,
    trackEcommerce,
  };
};

// Hook para performance y Core Web Vitals
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Trackear Core Web Vitals
    const trackWebVitals = async () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        const sendToAnalytics = (metric: any) => {
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: metric.name,
              value: Math.round(metric.value),
              custom_parameters: {
                metric_name: metric.name,
                metric_value: metric.value,
                metric_delta: metric.delta,
              },
            });
          }
        };

        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
      }
    };

    trackWebVitals();
  }, []);

  // Trackear errores JavaScript
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (window.gtag) {
        window.gtag('event', 'javascript_error', {
          event_category: 'Error',
          event_label: event.message,
          custom_parameters: {
            error_message: event.message,
            error_filename: event.filename,
            error_lineno: event.lineno,
            error_colno: event.colno,
          },
        });
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
};
