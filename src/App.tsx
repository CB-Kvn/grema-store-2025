import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
import { Footer } from "./components/initial-page/footer";
import { addToCartShop, removeFromCartShop, updateQuantityShop } from "./store/slices/cartSlice";
import OrderDocumentsPage from "./pages/OrderDocumentsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import InventoryPage from "./pages/InventoryPage";
import Loader from '@/components/ui/Loader';
import { AlertProvider } from "./context/AlertContext";
import AboutUs from "./pages/about-us";
import { motion } from "framer-motion";

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
  const cartItems = useAppSelector((state) => state.cart.items);

  const addToCart = (product: (typeof products)[0]) => {
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
