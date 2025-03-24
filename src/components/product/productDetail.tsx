import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import {
  Heart,
  Share2,
  ArrowLeft,
  Shield,
  Truck,
  Package,
  Gift,
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  Barcode,
  Check,
} from "lucide-react";
import { products } from "@/pages/initial";
import { useAppSelector } from "@/hooks/useAppSelector";

interface ProductDetailProps {
  addToCart: (product: (typeof products)[0] & { quantity: number }) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart, updateQuantity }) => {
  const { id } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const productCartShop = useAppSelector((state) => state.cart.items);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            Producto no encontrado
          </h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Verificar si el producto ya está en el carrito
  const isProductInCart = productCartShop.some((item) => item.id === product.id);

  // Obtener la cantidad del producto en el carrito
  const productInCart = productCartShop.find((element) => element.id === Number(id));
  const quantityInCart = productInCart ? productInCart.quantity : quantity;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: quantityInCart });
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `¡Mira esta hermosa ${product.name} en Joyas de Lujo!`
    );

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      instagram: `https://instagram.com`,
      copyLink: window.location.href,
    };

    if (platform === "copyLink") {
      navigator.clipboard.writeText(shareUrls[platform]);
    } else {
      window.open(shareUrls[platform], "_blank");
    }
    setShowShareMenu(false);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    container: HTMLDivElement
  ) => {
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    const overlay = container.querySelector(".zoom-overlay") as HTMLElement;
    if (overlay) {
      overlay.style.backgroundPosition = `${x}% ${y}%`;
    }
    container.classList.add("zoom-active");
  };

  const handleMouseLeave = (container: HTMLDivElement) => {
    if (container) {
      container.classList.remove("zoom-active");
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Volver</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4 max-w-[500px] mx-auto">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              navigation
              pagination={{ clickable: true }}
              className="h-[500px] sm:h-[600px] lg:h-[700px] rounded-lg overflow-hidden"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="zoom-container w-full h-full"
                    onMouseMove={(e) => {
                      const container = e.currentTarget;
                      handleMouseMove(e, container);
                    }}
                    onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="zoom-image object-contain"
                    />
                    <div
                      className="zoom-overlay"
                      style={{
                        backgroundImage: `url(${image})`,
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            <Swiper
              // @ts-ignore
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              modules={[Navigation, Thumbs]}
              className="h-24"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="h-24 w-full cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors">
                    <img
                      src={image}
                      alt={`${product.name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary-900">
                {product.name}
              </h1>
              <div className="flex items-center mt-2 text-primary-600">
                <Barcode className="h-4 w-4 mr-2" />
                <span className="text-xl">SKU: {product.sku}</span>
              </div>
              <p className="text-primary-600 mt-4 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-primary-900">
                  {new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                product.price * 0.85
                              )}
                  </span>
                  <span className="ml-2 text-lg line-through text-primary-400">
                  {new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                product.price
                              )}
                    
                  </span>
                </div>
                <div className="flex space-x-4">
                  {/* <button className="p-2 hover:bg-primary-50 rounded-full transition-colors">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </button> */}
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                    >
                      <Share2 className="h-6 w-6 text-primary-600" />
                    </button>
                    {showShareMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-20">
                        <button
                          onClick={() => handleShare("facebook")}
                          className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded w-full"
                        >
                          <Facebook className="h-4 w-4" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded w-full"
                        >
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare("instagram")}
                          className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded w-full"
                        >
                          <Instagram className="h-4 w-4" />
                          <span>Instagram</span>
                        </button>
                        <button
                          onClick={() => handleShare("copyLink")}
                          className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded w-full"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span>Copiar Enlace</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-900">
                Detalles del Producto
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="bg-primary-50 p-3 rounded-lg">
                    <span className="text-sm text-primary-600 capitalize">
                      {key}
                    </span>
                    {Array.isArray(value) ? (
                      <div className="space-y-1">
                        {value.map((item, index) => (
                          <div key={index} className="flex items-center">
                            {item.hex && (
                              <span
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: item.hex }}
                              ></span>
                            )}
                            <p className="text-primary-900 font-medium">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : typeof value === "object" && value !== null ? (
                      <div className="space-y-1">
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <div key={subKey}>
                            {Array.isArray(subValue) ? (
                              <div className="space-y-1">
                                {subValue.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center"
                                  >
                                    {item.hex && (
                                      <span
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: item.hex }}
                                      ></span>
                                    )}
                                    <p className="text-primary-900 font-medium">
                                      {item.name}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-primary-900 font-medium">
                                {subValue}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-primary-900 font-medium">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-700">
                Cantidad
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const newQuantity = quantityInCart - 1;
                    if (newQuantity >= 1) {
                      updateQuantity(product.id, newQuantity); // Actualizar cantidad
                    }
                  }}
                  className="px-3 py-1 border border-primary-200 rounded-md hover:bg-primary-50"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantityInCart}</span>
                <button
                  onClick={() => {
                    const newQuantity = quantityInCart + 1;
                    updateQuantity(product.id, newQuantity); // Actualizar cantidad
                  }}
                  className="px-3 py-1 border border-primary-200 rounded-md hover:bg-primary-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Gift Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isGift"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="isGift"
                  className="flex items-center text-primary-900"
                >
                  <Gift className="h-5 w-5 mr-2 text-primary-600" />
                  Es un regalo
                </label>
              </div>
              {isGift && (
                <textarea
                  placeholder="Escribe tu mensaje de regalo..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full p-3 border border-primary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-primary-700">
                  ¿Requiere factura timbrada?
                </label>
                <p className="text-primary-600">
                  Comuníquese al <a href="https://wa.me/1234567890" className="text-primary-600 hover:text-primary-700">WhatsApp</a> o solicítela al pagar.
                </p>
              </div>
            </div>

            {/* Add to Cart Button or Already Added Message */}
            {isProductInCart ? (
              <div className="flex items-center justify-center space-x-2 bg-green-50 p-4 rounded-lg border border-green-200">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700">Este producto ya está en el carrito</span>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 text-white py-4 rounded-full font-medium hover:bg-primary-700 transition-colors"
              >
                Agregar al Carrito
              </button>
            )}

            {/* Shipping Info */}
            <div className="border-t border-primary-100 pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <h4 className="font-medium text-primary-900">Envío Gratis</h4>
                  <p className="text-sm text-primary-600">
                    Entrega estimada: 3-5 días hábiles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-primary-600" />
                <div>
                  <h4 className="font-medium text-primary-900">
                    Devolución Gratuita
                  </h4>
                  <p className="text-sm text-primary-600">
                    30 días para cambios o devoluciones
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <h4 className="font-medium text-primary-900">
                    Garantía de Autenticidad
                  </h4>
                  <p className="text-sm text-primary-600">
                    Certificado de autenticidad incluido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-primary-100 pt-8">
          <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
            Productos Relacionados
          </h2>
          <div className="px-4 -mx-4">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="related-products-slider pb-12"
            >
              {relatedProducts.map((relatedProduct) => (
                <SwiperSlide key={relatedProduct.id}>
                  <Link
                    to={`/producto/${relatedProduct.id}`}
                    className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative pb-[100%]">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-primary-900 font-medium line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-lg font-bold text-primary-900">
                        {new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                relatedProduct.price * 0.85
                              )}
                         
                        </span>
                        <span className="ml-2 text-sm line-through text-primary-400">
                        {new Intl.NumberFormat("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              }).format(
                                relatedProduct.price
                              )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;