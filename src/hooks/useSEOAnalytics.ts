import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';

interface SEOAnalyticsData {
  title: string;
  description: string;
  keywords: string[];
  category?: string;
  products?: any[];
}

export const useSEOAnalytics = (data: SEOAnalyticsData) => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Trackear vista de página con datos SEO
    trackEvent({
      action: 'page_view',
      category: 'seo',
      label: data.title,
      custom_parameters: {
        page_path: location.pathname,
        page_title: data.title,
        page_description: data.description,
        page_keywords: data.keywords.join(', '),
        page_category: data.category,
        products_count: data.products?.length || 0,
      },
    });

    // Trackear palabras clave principales
    if (data.keywords.length > 0) {
      trackEvent({
        action: 'seo_keywords',
        category: 'seo',
        label: data.keywords.slice(0, 5).join(', '), // Primeras 5 palabras clave
        custom_parameters: {
          all_keywords: data.keywords.join(', '),
          keywords_count: data.keywords.length,
        },
      });
    }

    // Trackear categoría si existe
    if (data.category) {
      trackEvent({
        action: 'category_view',
        category: 'navigation',
        label: data.category,
        custom_parameters: {
          category_name: data.category,
          products_in_category: data.products?.length || 0,
        },
      });
    }
  }, [location.pathname, data, trackEvent]);

  // Función para trackear interacciones SEO específicas
  const trackSEOInteraction = (action: string, details: Record<string, any>) => {
    trackEvent({
      action: `seo_${action}`,
      category: 'seo',
      label: details.label || action,
      custom_parameters: {
        page_title: data.title,
        page_category: data.category,
        ...details,
      },
    });
  };

  return {
    trackSEOInteraction,
  };
};
