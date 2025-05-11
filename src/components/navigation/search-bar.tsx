import React, { useState } from "react";
import { Product } from "../../interfaces/products"; // Importa la interfaz Product
import { products } from "@/pages/initial"; // Importa los datos de productos
import { Search, X } from "lucide-react"; // Íconos de lupa y cerrar

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si la ventana está abierta

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filteredResults = products.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      {/* Ícono de lupa */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-primary-50 rounded-full"
      >
        <Search className="h-6 w-6 text-primary-600" />
      </button>

      {/* Ventana emergente */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 z-50 flex flex-col bg-white shadow-lg"
          style={{ top: "100%" }} // Ajusta la posición vertical
        >
          {/* Barra de búsqueda */}
          <div className="flex items-center p-4 border-b border-gray-300">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={handleSearch}
              className="flex-1 ml-4 pl-4 pr-4 py-2 border border-primary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Resultados de búsqueda */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer"
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <span className="mt-2 text-sm font-medium text-gray-700">
                      {result.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron resultados.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;