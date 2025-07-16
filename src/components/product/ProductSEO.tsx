import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../../types';

interface ProductSEOProps {
  product: Product;
  category?: string;
}

export const ProductSEO: React.FC<ProductSEOProps> = ({ product, category }) => {
  const {
    name,
    description,
    price,
    Images,
    id,
    sku,
  } = product;

  const productUrl = `${window.location.origin}/product/${id}`;
  const imageUrl = Images || '/default-product-image.jpg';
  const productName = name || 'Producto sin nombre';
  const productDescription = description || 'Descripción no disponible';
  const productPrice = price || 0;
  const productCategory = category || product.category || 'Productos';
  
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/store' },
    ...(productCategory ? [{ name: productCategory, url: `/store?category=${productCategory}` }] : []),
    { name: productName, url: productUrl },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: imageUrl,
    url: productUrl,
    sku: sku || id?.toString() || 'SKU-001',
    brand: {
      '@type': 'Brand',
      name: 'Grema Store',
    },
    offers: {
      '@type': 'Offer',
      price: productPrice,
      priceCurrency: 'CRC',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Grema Store',
        url: window.location.origin,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12',
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${window.location.origin}${breadcrumb.url}`,
    })),
  };

  useEffect(() => {
    // Actualizar el título de la página
    document.title = `${productName} - Grema Store`;
  }, [productName]);

  return (
    <Helmet>
      {/* Título y meta descripción */}
      <title>{productName} - Grema Store</title>
      <meta name="description" content={productDescription} />
      <meta name="keywords" content={`${productName}, ${productCategory}, joyería, comprar, Costa Rica`} />
      
      {/* Meta tags para robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={productUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={productName} />
      <meta property="og:description" content={productDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:site_name" content="Grema Store" />
      <meta property="product:price:amount" content={productPrice.toString()} />
      <meta property="product:price:currency" content="CRC" />
      <meta property="product:availability" content="in_stock" />
      <meta property="product:condition" content="new" />
      <meta property="product:brand" content="Grema Store" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="product" />
      <meta name="twitter:title" content={productName} />
      <meta name="twitter:description" content={productDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:label1" content="Precio" />
      <meta name="twitter:data1" content={`₡${productPrice.toLocaleString()}`} />
      <meta name="twitter:label2" content="Disponibilidad" />
      <meta name="twitter:data2" content="En stock" />
      
      {/* Pinterest */}
      <meta name="pinterest" content="nopin" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
};
