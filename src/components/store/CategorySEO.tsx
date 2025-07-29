import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Category } from '../../types';

interface CategorySEOProps {
  category: Category;
  productCount?: number;
  subcategories?: string[];
}

const categoryInfo: Record<string, { name: string; description: string; keywords: string }> = {
  all: {
    name: 'Todas las categorías',
    description: 'Explora nuestra amplia selección de bisutería fina y accesorios elegantes. Encuentra anillos, collares, aretes y pulseras de la más alta calidad.',
    keywords: 'bisutería, anillos, collares, aretes, pulseras, oro, plata, diamantes, Costa Rica',
  },
  rings: {
    name: 'Anillos',
    description: 'Descubre nuestra colección de anillos elegantes. Desde anillos de compromiso hasta alianzas y anillos de moda, encuentra la pieza perfecta.',
    keywords: 'anillos, anillos de compromiso, alianzas, anillos de oro, anillos de plata, anillos con diamantes',
  },
  necklaces: {
    name: 'Collares',
    description: 'Explora nuestra exclusiva colección de collares. Desde cadenas clásicas hasta collares con colgantes únicos y elegantes.',
    keywords: 'collares, cadenas, colgantes, collares de oro, collares de plata, collares con diamantes',
  },
  earrings: {
    name: 'Aretes',
    description: 'Encuentra los aretes perfectos para cualquier ocasión. Desde aretes discretos hasta piezas llamativas que complementan tu estilo.',
    keywords: 'aretes, pendientes, aretes de oro, aretes de plata, aretes con diamantes, aretes elegantes',
  },
  bracelets: {
    name: 'Pulseras',
    description: 'Descubre nuestra colección de pulseras elegantes. Desde pulseras delicadas hasta piezas statement que realzan tu personalidad.',
    keywords: 'pulseras, brazaletes, pulseras de oro, pulseras de plata, pulseras con diamantes, pulseras elegantes',
  },
};

export const CategorySEO: React.FC<CategorySEOProps> = ({ 
  category, 
  productCount, 
  subcategories 
}) => {
  const info = categoryInfo[category] || {
    name: category ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') : 'Productos',
    description: category ? `Explora nuestra colección de ${category.replace('-', ' ')} de alta calidad en Grema Store.` : 'Explora nuestra amplia selección de productos de alta calidad en Grema Store.',
    keywords: category ? `${category.replace('-', ' ')}, bisutería, accesorios, Costa Rica` : 'bisutería, accesorios, productos, Costa Rica',
  };
  const pageUrl = `${window.location.origin}/store${category !== 'all' ? `?category=${category}` : ''}`;
  
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/store' },
    ...(category !== 'all' ? [{ name: info.name, url: pageUrl }] : []),
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${info.name} - Grema Store`,
    description: info.description,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: productCount || 0,
      itemListElement: subcategories?.map((subcat, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: subcat,
        url: `${window.location.origin}/store?category=${subcat}`,
      })) || [],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: `${window.location.origin}${breadcrumb.url}`,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Grema Store',
      url: window.location.origin,
      logo: {
        '@type': 'ImageObject',
        url: `https://ik.imagekit.io/xj7y5uqcr/tr:w-400,q-80/Logos/Logo_en_negro.png`,
      },
    },
  };

  useEffect(() => {
    document.title = `${info.name} - Grema Store`;
  }, [info.name]);

  return (
    <Helmet>
      {/* Título y meta descripción */}
      <title>{info.name} - Grema Store</title>
      <meta name="description" content={info.description} />
      <meta name="keywords" content={info.keywords} />
      
      {/* Meta tags para robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${info.name} - Grema Store`} />
      <meta property="og:description" content={info.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Grema Store" />
      <meta property="og:image" content={`https://ik.imagekit.io/xj7y5uqcr/tr:w-400,q-80/Logos/Logo_en_negro.png`} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${info.name} - Grema Store`} />
      <meta name="twitter:description" content={info.description} />
      <meta name="twitter:image" content={`https://ik.imagekit.io/xj7y5uqcr/tr:w-400,q-80/Logos/Logo_en_negro.png`} />
      
      {/* Información adicional */}
      {productCount && (
        <meta name="product-count" content={productCount.toString()} />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
