import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface RelatedProductsProps {
  relatedProducts: typeof products;
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  category,
}) => {
  const [visibleProducts, setVisibleProducts] = useState(4); // Número inicial de productos visibles
  const [loading, setLoading] = useState(false);

  // Función para cargar más productos
  const loadMoreProducts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 8); // Incrementar el número de productos visibles
      setLoading(false);
    }, 1000); // Simular un retraso de carga
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

  return (
    <div className="mt-16 border-t border-primary-100 pt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-primary-900 mb-4">
          Productos Relacionados
        </h2>
        <p className="text-primary-600 max-w-2xl mx-auto">
          Explora más piezas de nuestra colección {category}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, visibleProducts).map((product, index) => (
          <Link
            key={product.id}
            to={`/producto/${product.id}`}
            className={`block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }} // Retraso para cada producto
          >
            <div className="relative pb-[100%]">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-primary-900 font-medium line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-lg font-bold text-primary-900">
                  ${(product.price * 0.85).toLocaleString()}
                </span>
                <span className="ml-2 text-sm line-through text-primary-400">
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loading && (
        <div className="text-center mt-8">
          <span className="text-primary-600">Cargando más productos...</span>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;