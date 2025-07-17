import React, { useState, useEffect } from "react";
import ProductCard from "../../components/product/ProductCard";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";

const LatestProducts: React.FC<{ products: Product[]; addToCart: (product: Product) => void }> = ({ products, addToCart }) => {
  const [visibleProducts, setVisibleProducts] = useState(8); // Número inicial de productos visibles
  const navigate = useNavigate();

  // Función para cargar más productos al hacer scroll
  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 8); // Incrementar el número de productos visibles
  };

  // Detectar el scroll para cargar más productos
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ordenar los productos por fecha de creación (más recientes primero)
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
        Últimas Novedades
      </h2>
      <p className="text-primary-600 max-w-2xl mx-auto mb-8">
        Explora nuestras más recientes creaciones. Diseños innovadores que marcan tendencia en bisutería fina.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProducts.slice(0, visibleProducts).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => addToCart(product)}
            onClick={() => navigate(`/producto/${product.id}`)}
          />
        ))}
      </div>
      {visibleProducts < products.length && (
        <button
          onClick={loadMoreProducts}
          className="mt-8 px-6 py-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition"
        >
          Cargar más
        </button>
      )}
    </div>
  );
};

export default LatestProducts;