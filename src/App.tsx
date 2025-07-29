import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLazyCSS, loadCriticalCSS, loadNonCriticalCSS, loadLibraryCSS } from "./hooks/useLazyCSS";
import Initial, { products } from "./pages/initial";
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
import { motion } from "framer-motion";
import { LoadingScreen } from "./components/common/LoadingScreen";
import "./components/common/LoadingScreen.css";

// Componente de fondo confeti animado (líneas más gruesas)
function ConfettiBackground() {
  const lines = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const rotate = Math.random() * 360;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2;
    const color = [
      "bg-primary-200",
      "bg-primary-300",
      "bg-primary-400",
      "bg-primary-100",
      "bg-primary-50",
      "bg-yellow-200",
      "bg-pink-200",
      "bg-blue-200",
      "bg-green-200",
    ][Math.floor(Math.random() * 9)];

    return (
      <motion.div
        key={i}
        className={`absolute ${color} rounded-full`}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: "5px",
          height: `${16 + Math.random() * 24}px`,
          rotate,
          opacity: 0.7,
        }}
        initial={{ y: 0, opacity: 0.7 }}
        animate={{ y: [0, 20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{
          repeat: Infinity,
          duration,
          delay,
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-10]"
      aria-hidden="true"
      style={{ background: "#fff" }}
    >
      {lines}
    </div>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cartItems = useAppSelector((state) => state.cart.items);

  // Load critical CSS immediately
  useEffect(() => {
    loadCriticalCSS();
    
    // Load non-critical CSS after initial render
    loadNonCriticalCSS();
    
    // Load library-specific CSS when needed
    const loadLibrariesCSS = () => {
      // Check if Swiper is used
      if (document.querySelector('.swiper')) {
        loadLibraryCSS.swiper();
      }
      
      // Check if AOS is used
      if (document.querySelector('[data-aos]')) {
        loadLibraryCSS.aos();
      }
      
      // Check if DatePicker is used
      if (document.querySelector('.react-datepicker')) {
        loadLibraryCSS.datepicker();
      }
    };
    
    // Load libraries CSS after a delay to allow components to mount
    setTimeout(loadLibrariesCSS, 1000);
    
    // Also check periodically for dynamically added components
    const interval = setInterval(loadLibrariesCSS, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Optimized lazy loading for specific conditions
  useLazyCSS([
    {
      href: 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css',
      id: 'driver-css',
      condition: () => document.querySelector('.driver-popover') !== null
    }
  ]);

  const addToCart = (product: (typeof products)[0] & { quantity: number; isGift?: boolean; giftMessage?: string }) => {
    console.log("EN CARRO", { product, quantity: product.quantity, isGift: product.isGift, giftMessage: product.giftMessage });
    dispatch(addToCartShop({ 
      product: product, 
      quantity: product.quantity,
      isGift: product.isGift || false,
      giftMessage: product.giftMessage || ''
    }));
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      
      <Router>
        <AlertProvider>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
          <Menu_Bar isOpen={() => setIsCartOpen(true)}></Menu_Bar>

          <Routes>
            <Route path="/" element={<Initial addToCart={addToCart} />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
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
            <Route path="/tracking" element={<OrderTrackingPage />}></Route>
          </Routes>
          <Networking></Networking>
          <Footer></Footer>
          <Loader />
          {/* <ConfettiBackground /> */}
        </AlertProvider>
      </Router>
    </>
  );
}

export default App;
