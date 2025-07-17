// Configuración de Google Analytics para SEO
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'GA_MEASUREMENT_ID';

// Configuración de Meta Tags predeterminadas
export const DEFAULT_SEO_CONFIG = {
  siteName: 'Grema Store',
  siteDescription: 'Tienda online de bisutería fina y accesorios elegantes en Costa Rica. Encuentra anillos, collares, aretes y pulseras de la más alta calidad.',
  siteUrl: process.env.REACT_APP_SITE_URL || 'https://www.grema-store.com',
  defaultImage: '/Logo%20en%20negro.png',
  twitterHandle: '@grema_store',
  facebookAppId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
  author: 'Grema Store',
  language: 'es-CR',
  country: 'Costa Rica',
  currency: 'CRC',
};

// Configuración de Structured Data predeterminada
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: DEFAULT_SEO_CONFIG.siteName,
  url: DEFAULT_SEO_CONFIG.siteUrl,
  logo: `${DEFAULT_SEO_CONFIG.siteUrl}${DEFAULT_SEO_CONFIG.defaultImage}`,
  description: DEFAULT_SEO_CONFIG.siteDescription,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CR',
    addressLocality: 'San José',
    addressRegion: 'San José',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+506-1234-5678',
    contactType: 'customer service',
    areaServed: 'CR',
    availableLanguage: ['es', 'en'],
  },
  sameAs: [
    'https://www.facebook.com/gremastore',
    'https://www.instagram.com/gremastore',
    'https://www.twitter.com/grema_store',
  ],
};

// Configuración de Web Store Schema
export const WEBSTORE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: DEFAULT_SEO_CONFIG.siteName,
  url: DEFAULT_SEO_CONFIG.siteUrl,
  description: DEFAULT_SEO_CONFIG.siteDescription,
  image: `${DEFAULT_SEO_CONFIG.siteUrl}${DEFAULT_SEO_CONFIG.defaultImage}`,
  priceRange: '₡₡₡',
  currenciesAccepted: ['CRC', 'USD'],
  paymentAccepted: ['Credit Card', 'Debit Card', 'Bank Transfer'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CR',
    addressLocality: 'San José',
    addressRegion: 'San José',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catálogo de Bisutería',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Anillos',
          category: 'Bisutería',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Collares',
          category: 'Bisutería',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Aretes',
          category: 'Bisutería',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Pulseras',
          category: 'Bisutería',
        },
      },
    ],
  },
};

// Keywords por categorías
export const CATEGORY_KEYWORDS = {
  all: [
    'bisutería Costa Rica',
    'anillos oro',
    'collares plata',
    'aretes diamantes',
    'pulseras elegantes',
    'bisutería fina',
    'accesorios mujer',
    'regalos especiales',
  ],
  rings: [
    'anillos de compromiso',
    'anillos de boda',
    'anillos oro 18k',
    'anillos plata 925',
    'anillos con diamantes',
    'anillos elegantes',
    'anillos para mujer',
    'anillos únicos',
  ],
  necklaces: [
    'collares de oro',
    'collares de plata',
    'cadenas elegantes',
    'colgantes únicos',
    'collares con diamantes',
    'collares largos',
    'collares cortos',
    'collares modernos',
  ],
  earrings: [
    'aretes de oro',
    'aretes de plata',
    'aretes con diamantes',
    'aretes largos',
    'aretes pequeños',
    'aretes elegantes',
    'aretes para fiesta',
    'aretes cotidianos',
  ],
  bracelets: [
    'pulseras de oro',
    'pulseras de plata',
    'pulseras con diamantes',
    'pulseras elegantes',
    'pulseras delicadas',
    'pulseras statement',
    'pulseras únicas',
    'pulseras modernas',
  ],
};
