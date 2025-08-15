/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Flame, Sparkles, Grid3X3, Circle, Heart, Gem, Watch, Package } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { SEOHead, useStructuredData } from "@/components/common/SEOHead";
import { getPageSEOData } from "@/utils/seo";

import "aos/dist/aos.css";
import { Product } from "@/types";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useProductService } from "@/hooks/useProductService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalDiscounts } from "@/hooks/useGlobalDiscounts";

// Lazy loading de componentes pesados
const ProductCard = lazy(() => import("@/components/product/ProductCard"));
const Info_Bussiness = lazy(() => import("@/components/login/initial-page/bussiness").then(module => ({ default: module.Info_Bussiness })));
const ContactPage = lazy(() => import("@/components/login/initial-page/contact"));


const categories = [
  { id: "all", name: "Todo", icon: Grid3X3 },
  { id: "Anillos", name: "Anillos", icon: Circle },
  { id: "Collares", name: "Collares", icon: Heart },
  { id: "Aretes", name: "Aretes", icon: Gem },
  { id: "Pulseras", name: "Pulseras", icon: Watch },
  { id: "Sets", name: "Sets", icon: Package },
];

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ProductInitial {
  addToCart: (products: Product[]) => void;
}

type TabType = "bestSellers" | "newArrivals";

export const Initial: React.FC<ProductInitial> = ({ addToCart }) => {
  const navigate = useNavigate();
  const { generateOrganizationSchema, generateWebsiteSchema } = useStructuredData();
  const seoData = getPageSEOData('home');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const products = useAppSelector((state) => state.products.items) || [];
  const latest = useAppSelector((state) => state.products.isNew) || [];
  const bestSellers = useAppSelector((state) => state.products.isBestSeller) || [];

  // Si bestSellers está vacío, toma 8 productos aleatorios de products
  const randomProducts = useMemo(() => {
    if (bestSellers && bestSellers.length > 0) return bestSellers;
    if (products.length === 0) return [];
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [bestSellers, products]);

  // Memoizar navegación para evitar re-renders
  const handleNavigateToStore = useCallback(() => {
    navigate("/tienda", {
      state: { fromHome: true },
      replace: false,
    });
  }, [navigate]);

  // Memoizar función de agregar al carrito
  const handleAddToCart = useCallback((product: Product) => {
    addToCart([product]);
  }, [addToCart]);

  // Memoizar función de navegación a producto
  const handleNavigateToProduct = useCallback((productId: number) => {
    navigate(`/producto/${productId}`);
  }, [navigate]);

  const { loading, getAllProducts } = useProductService();
  const { fetchGlobalDiscounts } = useGlobalDiscounts();

  const [activeTab, setActiveTab] = useState<TabType>("bestSellers");
  const [visibleLatestProducts, setVisibleLatestProducts] = useState(4); // Mostrar 4 inicialmente
  const [loadingP, setLoadingP] = useState(false);

  // Memoizar productos filtrados para evitar recálculos innecesarios
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Memoizar productos visibles para mejor rendimiento
  const visibleRandomProducts = useMemo(() => {
    return randomProducts?.slice(0, visibleLatestProducts) || [];
  }, [randomProducts, visibleLatestProducts]);

  const visibleLatestProductsList = useMemo(() => {
    return latest?.slice(0, visibleLatestProducts) || [];
  }, [latest, visibleLatestProducts]);

  // Resetear productos visibles cuando cambia la pestaña
  useEffect(() => {
    setVisibleLatestProducts(4);
  }, [activeTab]);

  // Referencia al contenedor de productos relacionados
  const relatedRef = useRef<HTMLDivElement>(null);

  // Optimizar función de cargar más productos con throttling
  const loadMoreProducts = useCallback(() => {
    if (loadingP) return;

    let maxLength = 0;
    if (activeTab === "bestSellers") {
      maxLength = randomProducts.length;
    } else if (activeTab === "newArrivals") {
      maxLength = latest.length;
    }

    if (visibleLatestProducts < maxLength) {
      setLoadingP(true);
      // Usar requestAnimationFrame para mejor rendimiento
      requestAnimationFrame(() => {
        setTimeout(() => {
          setVisibleLatestProducts((prev) => Math.min(prev + 4, maxLength));
          setLoadingP(false);
        }, 500); // Reducir tiempo de espera
      });
    }
  }, [loadingP, activeTab, randomProducts.length, latest.length, visibleLatestProducts]);

  // Memoizar función de cambio de categoría
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Memoizar función de cambio de tab
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    getAllProducts();
    fetchGlobalDiscounts();
  }, [fetchGlobalDiscounts]);

  // Handler para animar y navegar a la tienda
  const [slide, setSlide] = useState(false);

  const handleGoToShop = () => {
    setSlide(true);
    setTimeout(() => {
      navigate("/tienda");
    }, 400);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" data-aos="fade-up" data-aos-duration="1200">
      {/* SEO Head */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage={seoData.ogImage}
        type={seoData.type}
        jsonLd={[generateOrganizationSchema(), generateWebsiteSchema()]}
      />

      {/* Floating Social Button */}
      {/* <FloatingSocialButton /> */}

      {/* Botón flotante a la derecha centrado, solo visible en pantallas md+ - Memoizado */}
      {/* <AnimatePresence>
        {!slide && (
          <motion.button
            key="go-to-shop-btn"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleNavigateToStore}
            className="hidden lg:flex fixed right-8 top-1/2 z-30 -translate-y-1/2 bg-primary-700 hover:bg-primary-900 text-white rounded-full shadow-lg px-7 py-4 items-center gap-2 transition-all duration-300 "
            aria-label="Ir a la tienda"
          >Tienda
            <ShoppingBag className="w-6 h-6" />
            <ChevronRight className="ml-2 w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence> */}

      {/* Navigation */}

      <div className="py-12 lg:py-16">
        {/* <LogoInitial></LogoInitial> */}

        {/* Categories */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="">
            {/* Botones deslizables para pantallas pequeñas */}
            <div className="block md:hidden">
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-md ${selectedCategory === category.id
                            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105"
                            : "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-900 hover:from-primary-100 hover:to-primary-150 hover:shadow-lg active:scale-95"
                          }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
                {/* Indicador de scroll */}
                <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Botones para pantallas medianas y grandes */}
            <div className="hidden md:block">
              <div className="flex justify-center">
                <div className="inline-flex bg-gradient-to-r from-primary-100 to-primary-200 rounded-full p-1 shadow-lg">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 transform ${selectedCategory === category.id
                            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105"
                            : "text-primary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-105 hover:shadow-md active:scale-95"
                          }`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10"
        >
          <div className="flex items-center justify-center mb-8 lg:mb-10">
            <div className="flex items-center">
              <div className="hidden sm:block w-32 h-px bg-primary-300 mr-4" />
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900">
                {selectedCategory === "all"
                  ? "Colección Destacada"
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <div className="hidden sm:block w-32 h-px bg-primary-300 ml-4" />
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <Skeleton height={200} className="mb-4" />
                  <Skeleton height={20} width="60%" className="mb-2" />
                  <Skeleton height={20} width="40%" />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={2}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="pb-12"
            >
              {filteredProducts.map((product: any) => (
                <SwiperSlide key={product.id}>
                  <Suspense fallback={
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  }>
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onClick={() => handleNavigateToProduct(product.id)}
                    />
                  </Suspense>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {filteredProducts.length === 0 && !loading && (
            <div className="w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[5/2] max-h-[400px] min-h-[280px] flex items-center justify-center bg-gradient-to-br from-primary-25 to-primary-50 rounded-2xl border border-primary-100 shadow-sm">
              <div className="text-center px-6 py-8 max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
                </div>
                <p className="text-primary-600 text-base sm:text-lg font-medium mb-2">
                  No se encontraron productos
                </p>
                <p className="text-primary-500 text-sm">
                  que coincidan con tu búsqueda.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Separador moderno con gradiente */}
        <div className="relative py-6 lg:py-6">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-25/30 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300/60 to-primary-400/60"></div>
              <div className="mx-6 p-3 bg-white rounded-full shadow-lg border border-primary-100">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary-300/60 to-primary-400/60"></div>
            </div>
          </div>
        </div>

        {/* Featured Collections Tabs */}
        <div
          className="py-6 lg:py-8 bg-gradient-to-b from-primary-25/20 to-transparent"
        >
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6 lg:mb-8">
              <div className="inline-flex bg-gradient-to-r from-primary-100 to-primary-200 rounded-full p-1 shadow-lg">
                <button
                  onClick={() => handleTabChange("bestSellers")}
                  className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform ${activeTab === "bestSellers"
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105"
                      : "text-primary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-105 hover:shadow-md active:scale-95"
                    }`}
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Más Vendidos
                </button>
                <button
                  onClick={() => handleTabChange("newArrivals")}
                  className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform ${activeTab === "newArrivals"
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105"
                      : "text-primary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-105 hover:shadow-md active:scale-95"
                    }`}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Novedades
                </button>
              </div>
            </div>

            {/* Best Sellers Content */}
            <div className={activeTab === "bestSellers" ? "block" : "hidden"}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                  Nuestros Más Vendidos
                </h2>
                <p className="text-primary-600 max-w-2xl mx-auto">
                  Descubre las piezas artesanales que han cautivado a nuestros clientes. Bisutería
                  hecha a mano que combina elegancia y originalidad única.
                </p>
              </div>
              {/* Related Products */}
              <div className="mt-16 relative pt-12" ref={relatedRef}>


                {/* Título */}
                {/* Productos */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  <AnimatePresence>
                    {visibleRandomProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        layout
                      >
                        <Suspense fallback={
                          <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                            <div className="bg-gray-200 h-48 rounded mb-4"></div>
                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                          </div>
                        }>
                          <ProductCard
                            product={product}
                            onAddToCart={() => handleAddToCart(product)}
                            onClick={() => handleNavigateToProduct(product.id)}
                          />
                        </Suspense>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Botón Cargar más y indicador de carga */}
                <div className="text-center mt-8">
                  {loadingP && (
                    <div className="mb-4">
                      <span className="text-primary-600">Cargando más productos...</span>
                    </div>
                  )}
                  {visibleLatestProducts < (randomProducts?.length || 0) && !loadingP && (
                    <button
                      onClick={loadMoreProducts}
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                    >
                      Cargar más productos
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* New Arrivals Content */}
            <div className={activeTab === "newArrivals" ? "block" : "hidden"}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                  Últimas Novedades
                </h2>
                <p className="text-primary-600 max-w-2xl mx-auto">
                  Explora nuestras más recientes creaciones artesanales. Diseños únicos
                  hechos a mano que marcan tendencia en bisutería artesanal.
                </p>
              </div>
              {/* Related Products */}
              <div className="mt-16 relative pt-12" ref={relatedRef}>
                {/* Separador sutil con puntos */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                  <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                </div>
                <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200/40 to-transparent"></div>
                {/* Título */}
                {/* Productos */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  <AnimatePresence>
                    {visibleLatestProductsList.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        layout
                      >
                        <Suspense fallback={
                          <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                            <div className="bg-gray-200 h-48 rounded mb-4"></div>
                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                          </div>
                        }>
                          <ProductCard
                            product={product}
                            onAddToCart={() => handleAddToCart(product)}
                            onClick={() => handleNavigateToProduct(product.id)}
                          />
                        </Suspense>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Botón Cargar más y indicador de carga */}
                <div className="text-center mt-8">
                  {loadingP && (
                    <div className="mb-4">
                      <span className="text-primary-600">Cargando más productos...</span>
                    </div>
                  )}
                  {visibleLatestProducts < (latest?.length || 0) && !loadingP && (
                    <button
                      onClick={loadMoreProducts}
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                    >
                      Cargar más productos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separador elegante con líneas onduladas */}
      <div className="relative py-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/50 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-200/80 to-primary-300/80"></div>
            <div className="mx-8 flex items-center space-x-3">
              <div className="w-1 h-1 bg-primary-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="w-1 h-1 bg-primary-300 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary-200/80 to-primary-300/80"></div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-11 bg-gradient-to-b from-primary-25/30 to-transparent">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <div className="bg-gray-200 h-8 w-64 mx-auto rounded mb-4 animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-96 mx-auto rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                  <div className="bg-gray-200 h-12 w-12 rounded-full mb-4"></div>
                  <div className="bg-gray-200 h-6 w-32 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          <Info_Bussiness />
        </Suspense>
      </div>

      {/* Separador final con diseño minimalista */}
      <div className="relative py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-primary-400/70"></div>
            <div className="mx-6 p-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full border border-primary-200/60">
              <div className="w-4 h-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-sm"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary-300/50 to-primary-400/70"></div>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="bg-gray-200 h-8 w-48 mx-auto rounded mb-4 animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-80 mx-auto rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-gray-200 h-6 w-32 rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-200 h-10 w-full rounded"></div>
                  <div className="bg-gray-200 h-10 w-full rounded"></div>
                  <div className="bg-gray-200 h-24 w-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <ContactPage />
      </Suspense>
    </div>
  );
};

export default Initial;
