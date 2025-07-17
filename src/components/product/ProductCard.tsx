import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Share2, Facebook, Twitter, Instagram, Link } from 'lucide-react';
import { OptimizedImage } from '@/components/common/OptimizedImage';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  WareHouseItem?:[
    {
      id:string,
      price:number,
      discount:number,
    }
  ],
  Images?:[
    {
      url:string[],
    }
  ]
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void | null;
  onClick?: () => void | null;
  priority?: boolean; // New prop for LCP optimization
  index?: number; // New prop for position-based optimization
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick, 
  priority = false, 
  index = 0 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Determine loading strategy based on position
  const isAboveFold = index < 6; // First 6 products are likely above the fold
  const shouldEagerLoad = priority || isAboveFold;

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Mira esta hermosa ${product.name} en Joyas de Lujo!`);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      instagram: `https://instagram.com`,
      copyLink: window.location.href
    };

    if (platform === 'copyLink') {
      navigator.clipboard.writeText(shareUrls[platform]);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  useEffect(() => {
    console.log('ProductCard mounted:', product);
  },[]);

  return (
    <>
      <div
        className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-lg shadow-md overflow-hidden group cursor-pointer flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setShowShareMenu(false);
        }}
        onClick={onClick}
      >
        {/* Full-size image with OptimizedImage component */}
        <div className="flex-grow relative overflow-hidden">
          <OptimizedImage
            src={
              product.Images && product.Images[0] && product.Images[0].url
                ? product.Images[0].url[0]
                : "https://via.placeholder.com/400x400" // Imagen de placeholder si no hay imágenes
            }
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-105"
            loading={shouldEagerLoad ? "eager" : "lazy"}
            width={400}
            height={400}
          />
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2 z-20">
          <button
            className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            aria-label={showShareMenu ? "Cerrar menú de compartir" : "Compartir producto"}
            aria-expanded={showShareMenu}
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </button>
          {/* <button 
          className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
        </button> */}
          <button
            className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </button>
        </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div
            className="absolute top-12 sm:top-16 right-2 sm:right-4 bg-white rounded-lg shadow-lg p-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-primary-50 rounded w-full text-sm sm:text-base text-primary-700"
            >
              <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-primary-50 rounded w-full text-sm sm:text-base text-primary-700"
            >
              <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('instagram')}
              className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-primary-50 rounded w-full text-sm sm:text-base text-primary-700"
            >
              <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => handleShare('copyLink')}
              className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-primary-50 rounded w-full text-sm sm:text-base text-primary-700"
            >
              <Link className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Copiar Enlace</span>
            </button>
          </div>
        )}

        {/* Product Details - Slides up from bottom on hover */}
        <div
          className={`absolute bottom-20 left-4 right-4 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-lg transform transition-all duration-300 ease-out ${isHovering ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
            }`}
        >
          <h3 className="text-base sm:text-lg font-medium text-primary-900 mb-2 line-clamp-3">
            {product.name}
          </h3>
          <div className="flex items-baseline">
            {product.WareHouseItem && product.WareHouseItem.length > 0 && product.WareHouseItem[0].price ? (
              <>
                <span className="text-lg sm:text-xl font-bold text-primary-900">
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(product.WareHouseItem[0].price)}
                </span>
                {product.WareHouseItem[0].discount > 0 && (
                  <span className="ml-2 text-xs sm:text-sm line-through text-primary-400">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(
                      product.WareHouseItem[0].price /
                        (1 - product.WareHouseItem[0].discount / 100)
                    )}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs sm:text-sm text-primary-400">Precio no disponible</span>
            )}
          </div>
        </div>
        {/* Add to Cart Button */}
        <button
          className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-b-lg text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          Agregar al Carrito
        </button>
      </div>

    </>

  );
};

export default ProductCard;