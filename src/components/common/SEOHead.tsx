import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  type?: 'website' | 'product' | 'category' | 'article';
  jsonLd?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = '',
  ogTitle,
  ogDescription,
  ogImage = '/logo-grema.png',
  ogUrl,
  canonicalUrl,
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    // Actualizar title
    document.title = title;

    // Función para actualizar o crear meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags básicos
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Grema Store');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('', ogTitle || title, 'og:title');
    updateMetaTag('', ogDescription || description, 'og:description');
    updateMetaTag('', type, 'og:type');
    updateMetaTag('', ogImage, 'og:image');
    updateMetaTag('', 'Grema Store', 'og:site_name');
    updateMetaTag('', 'es_ES', 'og:locale');
    
    if (ogUrl) updateMetaTag('', ogUrl, 'og:url');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // JSON-LD Structured Data
    if (jsonLd) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, type, jsonLd]);

  return null;
};

// Hook para generar structured data
export const useStructuredData = () => {
  const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Grema Store',
    url: 'https://www.grema-store.com',
    logo: 'https://www.grema-store.com/logo-grema.png',
    description: 'Tienda especializada en bisutería artesanal hecha a mano con diseños únicos',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+506-8888-8888',
      contactType: 'Customer Service',
      availableLanguage: 'Spanish'
    },
    sameAs: [
      'https://facebook.com/gremastore',
      'https://instagram.com/gremastore',
      'https://twitter.com/gremastore'
    ]
  });

  const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Grema Store',
    url: 'https://www.grema-store.com',
    description: 'Tienda online de bisutería artesanal hecha a mano con diseños únicos',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.grema-store.com/tienda?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });

  const generateProductSchema = (product: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.Images || product.image,
    brand: {
      '@type': 'Brand',
      name: 'Grema Store'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CRC',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Grema Store'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  });

  const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });

  return {
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateProductSchema,
    generateBreadcrumbSchema
  };
};

export { SEOHead };
