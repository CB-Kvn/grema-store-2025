// Utility to generate sitemap XML
export const generateSitemap = (baseUrl: string = 'https://gremastore.com') => {
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/tienda', changefreq: 'daily', priority: '0.9' },
    { url: '/nosotros', changefreq: 'monthly', priority: '0.8' },
    { url: '/contacto', changefreq: 'monthly', priority: '0.8' },
    { url: '/valores', changefreq: 'monthly', priority: '0.7' },
    { url: '/historia', changefreq: 'monthly', priority: '0.7' },
  ];

  const categories = [
    'anillos',
    'collares', 
    'aretes',
    'pulseras',
    'sets'
  ];

  const categoryPages = categories.map(category => ({
    url: `/tienda?categoria=${category}`,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticPages, ...categoryPages].map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;

  return sitemapXml;
};

// Generate robots.txt
export const generateRobotsTxt = (baseUrl: string = 'https://gremastore.com') => {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /carrito/
Disallow: /checkout/
Disallow: /perfil/

Sitemap: ${baseUrl}/sitemap.xml`;
};

// SEO-friendly URL generator
export const generateSEOUrl = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Generate product URL
export const generateProductUrl = (product: any): string => {
  const productSlug = generateSEOUrl(product.name || `producto-${product.id}`);
  return `/producto/${product.id}/${productSlug}`;
};

// Generate category URL
export const generateCategoryUrl = (category: string): string => {
  const categorySlug = generateSEOUrl(category);
  return `/categoria/${categorySlug}`;
};

// Meta tags for different page types
export const getPageSEOData = (pageType: string, data?: any) => {
  const baseUrl = 'https://gremastore.com';
  
  switch (pageType) {
    case 'home':
      return {
        title: 'Grema Store - Joyería Fina y Accesorios de Alta Calidad',
        description: 'Descubre nuestra colección exclusiva de joyería fina, anillos, collares, aretes y pulseras. Calidad premium y diseños únicos en Grema Store.',
        keywords: 'joyería, anillos, collares, aretes, pulseras, oro, plata, piedras preciosas, joyería fina, accesorios, Costa Rica',
        canonicalUrl: baseUrl,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
    
    case 'store':
      return {
        title: 'Tienda Online - Grema Store | Joyería Fina',
        description: 'Explora nuestra tienda online con la mejor selección de joyería fina. Anillos, collares, aretes y pulseras con envío a todo Costa Rica.',
        keywords: 'tienda joyería, comprar anillos, comprar collares, joyería online, Costa Rica',
        canonicalUrl: `${baseUrl}/tienda`,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
    
    case 'product':
      return {
        title: `${data?.name || 'Producto'} - Grema Store`,
        description: `${data?.description || 'Descubre este increíble producto de joyería fina.'} Calidad premium y diseño único en Grema Store.`,
        keywords: `${data?.name || 'producto'}, joyería, ${data?.category || 'accesorios'}, Grema Store`,
        canonicalUrl: `${baseUrl}${generateProductUrl(data)}`,
        ogImage: data?.Images || data?.image || `${baseUrl}/logo-grema.png`,
        type: 'product' as const
      };
    
    case 'category':
      const categoryNames: Record<string, string> = {
        anillos: 'Anillos',
        collares: 'Collares',
        aretes: 'Aretes',
        pulseras: 'Pulseras',
        sets: 'Sets'
      };
      
      const categoryName = categoryNames[data?.category] || 'Productos';
      
      return {
        title: `${categoryName} - Grema Store | Joyería Fina`,
        description: `Descubre nuestra colección de ${categoryName.toLowerCase()} en Grema Store. Diseños únicos y calidad premium en joyería fina.`,
        keywords: `${categoryName.toLowerCase()}, joyería, ${data?.category}, Grema Store, Costa Rica`,
        canonicalUrl: `${baseUrl}${generateCategoryUrl(data?.category || 'productos')}`,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
    
    case 'about':
      return {
        title: 'Nosotros - Grema Store | Nuestra Historia',
        description: 'Conoce la historia de Grema Store, nuestra pasión por la joyería fina y nuestro compromiso con la calidad y excelencia.',
        keywords: 'nosotros, historia, Grema Store, joyería artesanal, Costa Rica',
        canonicalUrl: `${baseUrl}/nosotros`,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
    
    case 'contact':
      return {
        title: 'Contacto - Grema Store | Información de Contacto',
        description: 'Ponte en contacto con Grema Store. Encuentra nuestra ubicación, horarios y formas de comunicarte con nosotros.',
        keywords: 'contacto, ubicación, horarios, Grema Store, joyería Costa Rica',
        canonicalUrl: `${baseUrl}/contacto`,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
    
    default:
      return {
        title: 'Grema Store - Joyería Fina',
        description: 'Joyería fina y accesorios de alta calidad en Grema Store.',
        keywords: 'joyería, accesorios, Grema Store',
        canonicalUrl: baseUrl,
        ogImage: `${baseUrl}/logo-grema.png`,
        type: 'website' as const
      };
  }
};
