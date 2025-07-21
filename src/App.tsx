import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Initial from "./pages/initial";
import ProductDetail from "./components/product/productDetail";
import CartDrawer from "./components/shopping/cart";
import CheckoutPage from "./components/shopping/checkout";
import { ShopPage } from "./components/store/storePage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { ValuesPage } from "./pages/values";
import { Menu_Bar } from "./components/navigation/nav-store";
import { Networking } from "./components/socials/networking";
import { Footer } from "./components/login/initial-page/footer";
import { addToCartShop, removeFromCartShop, updateQuantityShop } from "./store/slices/cartSlice";
import OrderDocumentsPage from "./pages/OrderDocumentsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import InventoryPage from "./pages/InventoryPage";
import Loader from '@/components/ui/Loader';
import { AlertProvider } from "./context/AlertContext";
import AboutUs from "./pages/about-us";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./components/common/LoadingScreen";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Componente wrapper para manejar la navegación condicionalmente
function AppContent() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Verificar si estamos en la página de administración
  const isAdminRoute = location.pathname.startsWith('/admin');

  const addToCart = (product: any) => {
    console.log("EN CaRRO");
    dispatch(addToCartShop({ product: product }));
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    console.log("Borrando")
    dispatch(removeFromCartShop(productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    console.log("Cantidad", { productId, newQuantity })
    if (newQuantity < 1) return;
    dispatch(updateQuantityShop({ id: productId, quantity: newQuantity }));
  };

  return (
    <>
      <AlertProvider>
        {/* Mostrar carrito solo si no estamos en rutas de admin */}
        {!isAdminRoute && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        )}
        
        {/* Mostrar menú de navegación solo si no estamos en rutas de admin */}
        {!isAdminRoute && <Menu_Bar isOpen={() => setIsCartOpen(true)} />}

        <Routes>
          <Route path="/" element={<Initial addToCart={addToCart} />} />
          <Route
            path="/producto/:id"
            element={<ProductDetail addToCart={addToCart} updateQuantity={updateQuantity} />}
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cartItems={cartItems} />}
          />
          <Route path="/tienda" element={<ShopPage addToCart={addToCart} />} />
          <Route path="/sobre-nosotros" element={<AboutUs />} />
          <Route path="/nuestros-valores" element={<ValuesPage />} />
          <Route path="/admin/inventory" element={<InventoryPage />} />
          <Route path="/orders/:orderIdFromUrl/documents" element={<OrderDocumentsPage />} />
          <Route path="/tracking" element={<OrderTrackingPage />} />
        </Routes>
        
        {/* Mostrar componentes de pie de página solo si no estamos en rutas de admin */}
        {!isAdminRoute && (
          <>
            <Networking />
            <Footer />
          </>
        )}
        
        <Loader />
      </AlertProvider>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen onComplete={handleLoadingComplete} />
        ) : (
          <Router>
            <AppContent />
          </Router>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;
