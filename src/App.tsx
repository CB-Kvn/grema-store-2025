import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { Menu_Bar } from "./components/navigation/nav-store";
import { Networking } from "./components/socials/networking";
import { Footer } from "./components/login/initial-page/footer";
import { addToCartShop, removeFromCartShop, updateQuantityShop } from "./store/slices/cartSlice";
import Loader from '@/components/ui/Loader';
import { AlertProvider } from "./context/AlertContext";
import { LoadingScreen } from "./components/common/LoadingScreen";
import "./components/common/LoadingScreen.css";

// Lazy loading de páginas principales
const Initial = lazy(() => import("./pages/initial"));
const ProductDetail = lazy(() => import("./components/product/productDetail"));
const CartDrawer = lazy(() => import("./components/shopping/cart"));
const CheckoutPage = lazy(() => import("./components/shopping/checkout"));
const ShopPage = lazy(() => import("./components/store/storePage").then(module => ({ default: module.ShopPage })));
const ValuesPage = lazy(() => import("./pages/values").then(module => ({ default: module.ValuesPage })));
const AboutUs = lazy(() => import("./pages/about-us"));

// Lazy loading de páginas administrativas (solo cargar cuando sea necesario)
const OrderDocumentsPage = lazy(() => import("./pages/OrderDocumentsPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));

// Componente de carga para rutas
const RouteLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
      <p className="text-primary-600 text-sm">Cargando página...</p>
    </div>
  </div>
);

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
          <Suspense fallback={<div>Cargando carrito...</div>}>
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </Suspense>
          <Menu_Bar isOpen={() => setIsCartOpen(true)}></Menu_Bar>

          <Suspense fallback={<RouteLoader />}>
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
          </Suspense>
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
