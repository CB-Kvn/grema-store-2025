import React, { useState } from 'react';
import { Heart, ShoppingCart, Share2, Facebook, Twitter, Instagram, Link } from 'lucide-react';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const discountedPrice = product.price * 0.85; // 15% de descuento

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Mira esta hermosa ${product.name} en Joyas de Lujo!`);
    
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

  return (
    <>
    <div 
      className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-lg shadow-md overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowShareMenu(false);
      }}
      onClick={onClick}
    >
      {/* Full-size image background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300 transform group-hover:scale-105"
        style={{
          backgroundImage: `url(${product.image})`
        }}
      />

      {/* Action buttons */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2 z-20">
        <button 
          className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowShareMenu(!showShareMenu);
          }}
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
        className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 sm:p-6 transform transition-transform duration-300 ease-out ${
          isHovering ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <h3 className="text-lg sm:text-xl font-medium text-primary-900 mb-3">{product.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-xl sm:text-2xl font-bold text-primary-900"> {new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                discountedPrice
                              )}</span>
          <span className="ml-2 text-sm line-through text-primary-400">{new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                product.price
                              )}</span>
        </div>
        
      </div>
      <button 
          className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          Agregar al Carrito
        </button>
    </div>
    <button 
          className="w-full bg-primary-600 mt-5 text-white py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          Agregar al Carrito
        </button>
    </>
    
  );
};

export default ProductCard;