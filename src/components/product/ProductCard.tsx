import React, { useEffect, useState, useMemo } from 'react';
import { IKImage, IKContext } from 'imagekitio-react';
import { Heart, ShoppingCart, Share2, Facebook, Twitter, Instagram, Link, Tag, Percent, DollarSign } from 'lucide-react';
import { useDiscountCalculator } from '@/hooks/useDiscountCalculator';
import { CartItem } from '@/utils/discountCalculator';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  sku?: string;
  details?: any;
  createdAt?: string;
  updatedAt?: string;
  available?: boolean;
  filepaths?: any[];
  WarehouseItem?: [
    {
      id: string,
      price: number,
      discount: number,
    }
  ],
  Images?: [
    {
      url: string[],
    }
  ]
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Crear item del carrito para cálculo de descuentos
  const cartItemForDiscount: CartItem[] = useMemo(() => {
    return [{
      product: {
        id: product.id,
        name: product.name,
        price: product.WarehouseItem?.[0]?.price || product.price || 0,
        Images: product.Images?.[0]?.url?.[0] || '',
        description: product.description,
        category: product.category,
        sku: product.sku || '',
        details: product.details || {},
        createdAt: product.createdAt || '',
        updatedAt: product.updatedAt || '',
        available: product.available ?? true,
        WarehouseItem: product.WarehouseItem || [],
        filepaths: product.filepaths || []
      },
      quantity: 1
    }];
  }, [product]);

  // Hook para calcular descuentos
  const {
    calculationResult,
    itemsWithDiscounts,
    hasDiscounts,
    isLoading: discountLoading,
    error: discountError
  } = useDiscountCalculator(cartItemForDiscount);

  // Información de descuentos
  const discountInfo = useMemo(() => {
    if (!hasDiscounts || !itemsWithDiscounts.length) {
      return null;
    }

    const itemWithDiscount = itemsWithDiscounts[0];
    if (!itemWithDiscount.appliedDiscount) {
      return null;
    }

    const discount = itemWithDiscount.appliedDiscount;
    
    return {
      type: discount.type,
      value: discount.value,
      discountApplied: discount.discountApplied,
      originalPrice: discount.originalPrice,
      finalPrice: discount.finalPrice,
      message: discount.message,
      savings: discount.discountApplied,
      savingsPercentage: discount.originalPrice > 0 ? (discount.discountApplied / discount.originalPrice) * 100 : 0
    };
  }, [hasDiscounts, itemsWithDiscounts]);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Mira esta hermosa ${product.name} en Grema Store!`);

    const shareUrls = {
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
    <IKContext urlEndpoint="https://ik.imagekit.io/wtelcc7rn"> {/* Reemplaza por tu urlEndpoint real */}
      <div
        className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] max-h-[400px] min-h-[300px] rounded-lg shadow-md overflow-hidden group cursor-pointer flex flex-col bg-gradient-to-br from-white to-primary-25 border border-primary-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setShowShareMenu(false);
        }}
        onClick={onClick}
      >
        {/* Badge de descuento */}
        {discountInfo && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center space-x-1 shadow-lg">
              {discountInfo.type === 'PERCENTAGE' && <Percent className="h-3 w-3" />}
              {discountInfo.type === 'FIXED' && <DollarSign className="h-3 w-3" />}
              {discountInfo.type === 'BUY_X_GET_Y' && <Tag className="h-3 w-3" />}
              <span>
                {discountInfo.type === 'PERCENTAGE' && `${discountInfo.value}% OFF`}
                {discountInfo.type === 'FIXED' && `₡${discountInfo.value} OFF`}
                {discountInfo.type === 'BUY_X_GET_Y' && 'OFERTA'}
              </span>
            </div>
          </div>
        )}

        {/* Imagen optimizada con IKImage */}
        <div className="flex-grow relative transition-all duration-300 transform group-hover:scale-105">
          <IKImage
            path={
              product.filepaths && product.filepaths[0] && product.filepaths[0].url
                ? JSON.parse(product.filepaths[0].url)[0]
                : "/placeholder.jpg"
            }
            transformation={[{ width: 300, quality: 80 }]}
            loading="lazy"
            lqip={{ active: true }}
            alt={product.name || "Imagen optimizada"}
            className="object-cover w-full h-full absolute inset-0"
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
              if (onAddToCart) {
                onAddToCart();
              }
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
          <div className="flex flex-col space-y-1">
            {/* Mostrar precios con descuentos globales si aplican */}
            {discountInfo ? (
              <>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg sm:text-xl font-bold text-green-600">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(discountInfo.finalPrice)}
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(discountInfo.originalPrice)}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Ahorras: {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(discountInfo.savings)} ({discountInfo.savingsPercentage.toFixed(0)}%)
                </div>
                {discountInfo.message && (
                  <div className="text-xs text-blue-600 italic">
                    {discountInfo.message}
                  </div>
                )}
              </>
            ) : (
              /* Mostrar precios normales o con descuentos de WarehouseItem */
              product.WarehouseItem && product.WarehouseItem.length > 0 && product.WarehouseItem[0].price ? (
                <>
                  <span className="text-lg sm:text-xl font-bold text-primary-900">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(product.WarehouseItem[0].price)}
                  </span>
                  {product.WarehouseItem[0].discount > 0 && (
                    <span className="ml-2 text-xs sm:text-sm line-through text-primary-400">
                      {new Intl.NumberFormat("es-CR", {
                        style: "currency",
                        currency: "CRC",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(
                        product.WarehouseItem[0].price /
                          (1 - product.WarehouseItem[0].discount / 100)
                      )}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs sm:text-sm text-primary-400">Precio no disponible</span>
              )
            )}
          </div>
        </div>
        {/* Add to Cart Button */}
        <button
          className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-b-lg text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) {
              onAddToCart();
            }
          }}
        >
          Agregar al Carrito
        </button>
      </div>
    </IKContext>
  );
};

export default ProductCard;