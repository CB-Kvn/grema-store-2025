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
import {
  addToCartShop,
  removeFromCartShop,
  updateQuantityShop,
} from "./store/slices/cartSlice";
import { useAppSelector } from "./hooks/useAppSelector";
import { HistoryUs } from "./pages/history";
import { ValuesPage } from "./pages/values";
import { Menu_Bar } from "./components/navigation/nav-store";

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
    console.log("Cantidad",{productId,newQuantity})
    if (newQuantity < 1) return;
    dispatch(updateQuantityShop({ id: productId, quantity: newQuantity }));
  };

  return (
    <Router>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
        <Menu_Bar isOpen={() => setIsCartOpen(true)}></Menu_Bar>

      <Routes>
        <Route path="/" element={<Initial addToCart={addToCart}/>} />
        <Route
          path="/producto/:id"
          element={<ProductDetail addToCart={addToCart} updateQuantity={updateQuantity} />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cartItems={cartItems} />}
        />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/sobre-nosotros" element={<HistoryUs />} />
        <Route path="/nuestros-valores" element={<ValuesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
