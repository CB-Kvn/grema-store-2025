/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "@/components/product/ProductCard";
import { useNavigate } from "react-router-dom";
import { Info_Bussiness } from "@/components/login/initial-page/bussiness";

import ContactPage from "@/components/login/initial-page/contact";
import "aos/dist/aos.css";
import { Product } from "@/types";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useProductService } from "@/hooks/useProductService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "all", name: "Todo" },
  { id: "rings", name: "Anillos" },
  { id: "necklaces", name: "Collares" },
  { id: "earrings", name: "Aretes" },
  { id: "bracelets", name: "Pulseras" },
  { id: "sets", name: "Sets" },
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const products = useAppSelector((state) => state.products.items);
  const latest = useAppSelector((state) => state.products.isNew);
  const bestSellers = useAppSelector((state) => state.products.isBestSeller);
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const { loading, error, data, getAllProducts } = useProductService();

  const [activeTab, setActiveTab] = useState<TabType>("bestSellers");

  const [visibleLatestProducts, setVisibleLatestProducts] = useState(4); // Mostrar 4 inicialmente
  const [loadingP, setLoadingP] = useState(false);

  // Referencia al contenedor de productos relacionados
  const relatedRef = useRef<HTMLDivElement>(null);

  // Cargar más productos al llegar al final de la sección
  useEffect(() => {
    const handleScroll = () => {
      if (!relatedRef.current) return;
      const rect = relatedRef.current.getBoundingClientRect();
      if (
        rect.bottom <= window.innerHeight + 100 && // 100px de margen para anticipar
        !loadingP &&
        visibleLatestProducts < products.length
      ) {
        setLoadingP(true);
        setTimeout(() => {
          setVisibleLatestProducts((prev) => Math.min(prev + 4, products.length)); // Mostrar 4 más
          setLoadingP(false);
        }, 1500); // Simula carga
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingP, visibleLatestProducts, products.length]);

  useEffect(() => {
    getAllProducts();
  }, []);

  // Handler para animar y navegar a la tienda
  const [slide, setSlide] = useState(false);

  const handleGoToShop = () => {
    setSlide(true);
    setTimeout(() => {
      navigate("/tienda");
    }, 400);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Botón flotante a la derecha centrado, solo visible en pantallas md+ */}
      <AnimatePresence>
        {!slide && (
          <motion.button
            key="go-to-shop-btn"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleGoToShop}
            className="hidden md:flex fixed right-8 top-1/2 z-50 -translate-y-1/2 bg-primary-700 hover:bg-primary-900 text-white rounded-full shadow-lg px-7 py-4 items-center gap-2 transition-all duration-300"
            aria-label="Ir a la tienda"
          >Tienda
            <ShoppingBag className="w-6 h-6" />
            <ChevronRight className="ml-2 w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation */}

      <div className="py-10">
        {/* <LogoInitial></LogoInitial> */}

        {/* Categories */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="flex justify-center mb-6">
            {/* Contenedor desplazable horizontalmente con barra oculta */}
            <div
              className="inline-flex bg-primary-100 rounded-full p-1 overflow-x-auto sm:overflow-visible whitespace-nowrap scrollbar-hide"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-1 rounded-full text-sm sm:text-base lg:text-lg font-medium transition-colors ${selectedCategory === category.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-primary-600 hover:bg-primary-50"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div
        className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="flex items-center justify-center mb-6 sm:mb-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
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
                <ProductCard
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onClick={() => navigate(`/producto/${product.id}`)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-primary-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Featured Collections Tabs */}
      <div
        className="py-11 "
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-primary-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab("bestSellers")}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "bestSellers"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-primary-600 hover:bg-primary-50"
                  }`}
              >
                <Flame className="h-4 w-4 mr-2" />
                Más Vendidos
              </button>
              <button
                onClick={() => setActiveTab("newArrivals")}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "newArrivals"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-primary-600 hover:bg-primary-50"
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
                Descubre las piezas que han cautivado a nuestros clientes. Joyas
                atemporales que combinan elegancia y exclusividad.
              </p>
            </div>
            {/* Related Products */}
            <div className="mt-16 border-t border-primary-100 pt-12" ref={relatedRef}>
              {/* Título */}
              {/* Productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {bestSellers && bestSellers.length > 0 && (
                    <>
                      {bestSellers.slice(0, visibleLatestProducts).map((product, idx) => {
                        console.log(product); 
                        const price = product.WarehouseItem?.[0]?.price || 0;
                        const discount = product.WarehouseItem?.[0]?.discount || 0;
                        const finalPrice = discount
                      ? price - price * (discount / 100)
                      : price;
                    const imageUrl = product.Images?.[0]?.url?.[0];
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        layout
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={() => console.log(`Agregar al carrito: ${product.name}`)}
                          onClick={() => navigate(`/producto/${product.id}`)}
                        />
                      </motion.div>
                    );
                  })}

                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Indicador de carga */}
              {loadingP && (
                <div className="text-center mt-8">
                  <span className="text-primary-600">Cargando más productos...</span>
                </div>
              )}
            </div>
          </div>

          {/* New Arrivals Content */}
          <div className={activeTab === "newArrivals" ? "block" : "hidden"}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                Últimas Novedades
              </h2>
              <p className="text-primary-600 max-w-2xl mx-auto">
                Explora nuestras más recientes creaciones. Diseños innovadores
                que marcan tendencia en joyería fina.
              </p>
            </div>
            {/* Related Products */}
            <div className="mt-16 border-t border-primary-100 pt-12" ref={relatedRef}>
              {/* Título */}
              {/* Productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {latest && latest.length > 0 && (
                    <>
                      {latest.slice(0, visibleLatestProducts).map((product, idx) => {
                        console.log(product);
                        const price = product.WarehouseItem?.[0]?.price || 0;
                        const discount = product.WarehouseItem?.[0]?.discount || 0;
                        const finalPrice = discount
                      ? price - price * (discount / 100)
                      : price;
                    const imageUrl = product.Images?.[0]?.url?.[0];
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        layout
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={() => console.log(`Agregar al carrito: ${product.name}`)}
                          onClick={() => navigate(`/producto/${product.id}`)}
                        />
                      </motion.div>
                    );
                  })}

                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Indicador de carga */}
              {loadingP && (
                <div className="text-center mt-8">
                  <span className="text-primary-600">Cargando más productos...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-11">
        <Info_Bussiness></Info_Bussiness>
      </div>


      <ContactPage></ContactPage>
    </div>
  );
};

export default Initial;
