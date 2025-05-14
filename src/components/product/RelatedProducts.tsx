import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  relatedProducts: {
    id: number;
    name: string;
    description: string;
    category: string;
    details: {
      color: { hex: string; name: string }[];
    };
    WarehouseItem: {
      price: number;
      discount: number | null;
    }[];
    Images: {
      url: string[];
    }[];
  }[];
  category: string;
  type?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  category,
  type,
}) => {
  const [visibleProducts, setVisibleProducts] = useState(4); // Número inicial de productos visibles
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      {/* Título */}
      {type !== "now" && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-primary-900 mb-4">
            Productos Relacionados
          </h2>
          <p className="text-primary-600 max-w-2xl mx-auto">
            Explora más piezas de nuestra colección {category}
          </p>
        </div>
      )}

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, visibleProducts).map((product) => {
          const price = product.WarehouseItem[0]?.price || 0;
          const discount = product.WarehouseItem[0]?.discount || 0;
          const finalPrice = discount
            ? price - price * (discount / 100)
            : price;
          const imageUrl =
            product.Images[0]?.url[0] || "/placeholder.jpg"; // Usar un placeholder si no hay imagen

          return (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: finalPrice,
                image: imageUrl,
                description: product.description,
              }}
              onAddToCart={() => console.log(`Agregar al carrito: ${product.name}`)}
              onClick={() => navigate(`/producto/${product.id}`)}
            />
          );
        })}
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center mt-8">
          <span className="text-primary-600">Cargando más productos...</span>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
