import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
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
  Flame,
  Sparkles,
} from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useProductService } from "@/hooks/useProductService";
import { setProducts } from "@/store/slices/productsSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import RelatedProducts from "./RelatedProducts";
import { ProductSEO } from "./ProductSEO";
import { useSEOAnalytics } from "@/hooks/useSEOAnalytics";

interface ProductDetailProps {
  addToCart: (product: (typeof products)[0] & { quantity: number }) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart, updateQuantity }) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { getProductById, getPendingQuantities } = useProductService();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null); // Nuevo: referencia al Swiper principal
  const [quantity, setQuantity] = useState(1);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeProductId, setActiveProductId] = useState(Number(id)); // Estado para el producto activo
  const [pendingQuantities, setPendingQuantities] = useState(0);
  const productCartShop = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.items);
  const product = products.find((p) => p.id === activeProductId); // Producto activo basado en el estado

  // --- NUEVO: Sumatoria de stock total en WarehouseItem ---
  const totalStock = Array.isArray(product?.WarehouseItem)
    ? product.WarehouseItem.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  // --- NUEVO: Stock disponible (total en stock menos pendientes) ---
  const availableStock = totalStock - pendingQuantities;

  const pendingQuantitiesSearch = async () => {
    const dsg = await getPendingQuantities(Number(id));
    setPendingQuantities(dsg.pendingQuantity ?? 0);
  }
  const fetchData = async () => {
    try {
      const productData = await getProductById(Number(id));

      dispatch(setProducts([productData]));
      // <-- Guarda el valor pendiente en el estado
    } catch (error) {
      console.error("Error al cargar el producto:", error);
    }
  };


  useEffect(() => {
    if (!products || products.length === 0) {
      fetchData();
    }
    pendingQuantitiesSearch()
  }, []);

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

  // Obtener los colores disponibles del producto actual
  const getAvailableColors = () => {
    return products
      .filter((p) => p.name === product.name) // Filtrar productos con el mismo nombre
      .flatMap((p) => p.details.color || []) // Extraer los colores disponibles
      .reduce((uniqueColors, color) => {
        // Eliminar colores duplicados
        if (!uniqueColors.some((c) => c.hex === color.hex)) {
          uniqueColors.push(color);
        }
        return uniqueColors;
      }, []);
  };

  // Cambiar al producto del color seleccionado
  const handleColorChange = (selectedColorHex: string) => {
    const selectedProduct = products.find(
      (p) =>
        p.name === product.name &&
        p.details.color?.some((color) => color.hex === selectedColorHex)
    );

    if (selectedProduct) {
      setActiveProductId(selectedProduct.id); // Actualizar el producto activo
    }
  };

  const availableColors = getAvailableColors();

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
    .filter((p) => p.category === product.category && p.id !== product.id) // Filtrar por categoría y excluir el producto actual
    .slice(0, 8); // Limitar a 8 productos relacionados

  const ProductSlider = ({ products }: { products: typeof relatedProducts }) => (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
      className="pb-12"
    >
      {products.map((relatedProduct) => (
        <SwiperSlide key={relatedProduct.id}>
          <Link
            to={`/producto/${relatedProduct.id}`}
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="relative pb-[100%]">
              <img
                src={relatedProduct.Images[0]?.url[0] || "/placeholder.jpg"} // Usar la primera imagen o un placeholder
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
                    relatedProduct.WarehouseItem[0]?.price || 0 // Mostrar el precio del primer WarehouseItem
                  )}
                </span>
                {relatedProduct.WarehouseItem[0]?.discount && (
                  <span className="ml-2 text-sm line-through text-primary-400">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(
                      relatedProduct.WarehouseItem[0]?.price /
                      (1 - relatedProduct.WarehouseItem[0]?.discount / 100)
                    )}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Component */}
      {product && (
        <ProductSEO
          product={product}
          category={product.category}
        />
      )}
      
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm py-4">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Swiper principal */}
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              navigation
              pagination={{ clickable: true }}
              className="h-[350px] xs:h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden"
              onSwiper={setMainSwiper} // Guarda la instancia del Swiper principal
            >
              {product.Images[0]?.url.map((image, index) => (
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
                      className="zoom-image w-full h-full object-contain"
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
              //@ts-ignore
              onSwiper={setThumbsSwiper}
              spaceBetween={16}
              slidesPerView={Math.min(product.Images[0]?.url.length || 1, 4)}
              modules={[Navigation, Thumbs]}
              className="h-32 sm:h-36" // <-- Aumenta el alto del Swiper
            >
              {product.Images[0]?.url.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    style={{ width: "120px", height: "120px" }} // <-- Aumenta el tamaño del contenedor
                    onClick={() => {
                      if (mainSwiper) {
                        mainSwiper.slideTo(index);
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Miniatura ${index + 1}`}
                      className="object-cover rounded-lg"
                      style={{ width: "110px", height: "110px" }} // <-- Aumenta el tamaño de la imagen
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary-900">
                {product.name}
              </h1>
              <div className="flex items-center mt-2 text-primary-600">
                <Barcode className="h-4 w-4 mr-2" />
                <span className="text-xl">SKU: {product.sku}</span>
              </div>
              {/* --- NUEVO: Mostrar stock total --- */}
              <div className="flex items-center mt-2 text-primary-600">
                <Package className="h-4 w-4 mr-2" />
                <span className="text-lg font-semibold text-primary-900">
                  Stock total: {availableStock < 0 ? 0 : availableStock}
                </span>
              </div>
              <p className="text-primary-600 mt-4 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline">
                  <span className="text-xl md:text-3xl font-bold text-primary-900">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(product.WarehouseItem?.[0]?.price ?? 0)}
                  </span>
                  {product.WarehouseItem?.[0]?.discount > 0 && (
                    <span className="ml-2 text-lg line-through text-primary-400">
                      {new Intl.NumberFormat("es-CR", {
                        style: "currency",
                        currency: "CRC",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(
                        (product.WarehouseItem?.[0]?.price ?? 0) /
                        (1 - (product.WarehouseItem?.[0]?.discount ?? 0) / 100)
                      )}
                    </span>
                  )}
                </div>
                <div className="flex space-x-4">
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

            {/* Separador */}
            <hr className="border-primary-200 my-6" />

            {/* Product Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">Detalles del Producto</h3>
              <ul className="space-y-2">
                {Object.entries(product.details).map(([key, value]) => (
                  <li key={key} className="flex flex-col sm:flex-row sm:items-start">
                    <span className="font-medium text-primary-900 capitalize">{key}:</span>
                    <span className="ml-2 text-primary-600">
                      {Array.isArray(value) ? (
                        // Si es un array, verificar si contiene objetos o valores simples
                        value.every((item) => typeof item === "object") ? (
                          value.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              {item.hex && (
                                <button
                                  onClick={() => console.log(`Color seleccionado: ${item.name}`)}
                                  className="inline-block w-4 h-4 rounded-full border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  style={{ backgroundColor: item.hex }}
                                  title={item.name} // Mostrar el nombre del color al pasar el mouse
                                ></button>
                              )}
                              <span>{item.name}</span>
                            </div>
                          ))
                        ) : (
                          value.join(", ") // Si son valores simples, unirlos con comas
                        )
                      ) : typeof value === "object" && value !== null ? (
                        // Si es un objeto, renderizar subclaves y valores
                        Object.entries(value).map(([subKey, subValue]) => (
                          <div key={subKey} className="flex items-start">
                            <span className="font-medium text-primary-900 capitalize">{subKey}:</span>
                            <span className="ml-2 text-primary-600">
                              {Array.isArray(subValue) ? (
                                subValue.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    {item.hex && (
                                      <button
                                        onClick={() => console.log(`Color seleccionado: ${item.name}`)}
                                        className="inline-block w-4 h-4 rounded-full border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        style={{ backgroundColor: item.hex }}
                                        title={item.name} // Mostrar el nombre del color al pasar el mouse
                                      ></button>
                                    )}
                                    <span>{item.name || item}</span>
                                  </div>
                                ))
                              ) : (
                                subValue
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        value // Si es un valor simple, mostrarlo directamente
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Separador */}
            <hr className="border-primary-200 my-6" />

            {/* Colores Disponibles */}
            <div className="space-y-6">
              <h3 className="font-medium text-primary-900 capitalize">Colores Disponibles</h3>
              <div className="flex space-x-4">
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color.hex)} // Cambiar producto según el color seleccionado
                    className="inline-block w-8 h-8 rounded-full border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: color.hex }}
                    title={color.name} // Mostrar el nombre del color al pasar el mouse
                  ></button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block font-medium text-primary-900 capitalize">
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
                  <h4 className="font-medium text-primary-900">Envío x medio de Correos de Costa Rica</h4>
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
        <RelatedProducts relatedProducts={relatedProducts} category={product.category} />

      </div>
    </div>
  );
};

export default ProductDetail;