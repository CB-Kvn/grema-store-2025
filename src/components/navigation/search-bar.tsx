import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useAppSelector";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Obtiene los productos del store
  const productos = useAppSelector((state) => state.products.items);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filteredResults = productos.filter((item) =>
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-primary-50 rounded-full"
        aria-label="Abrir búsqueda de productos"
      >
        <Search className="h-10 w-10 text-primary-600" />
      </Button>

      {/* Ventana emergente */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 z-50 flex flex-col bg-white shadow-lg"
          style={{ top: "100%" }}
        >
          {/* Barra de búsqueda */}
          <div className="flex items-center p-4 border-b border-gray-300">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Cerrar búsqueda"
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
          <div
            ref={resultsContainerRef}
            className="flex-1 overflow-y-auto p-4 max-h-[60vh]"
          >
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((result) => {
                  const imageUrl =
                    result.Images && result.Images[0] && result.Images[0].url && result.Images[0].url[0]
                      ? result.Images[0].url[0]
                      : "https://via.placeholder.com/150x150?text=Sin+Imagen";
                  return (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer bg-white w-full min-h-[140px] col-span-1 sm:col-span-2"
                      style={{ flexDirection: "row", height: "160px" }}
                    >
                      <img
                        src={imageUrl}
                        alt={result.name}
                        className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1 justify-center h-full">
                        <span className="text-base font-semibold text-primary-900">
                          {result.name}
                        </span>
                        <span className="text-sm text-gray-600 line-clamp-2">
                          {result.description}
                        </span>
                        <span className="text-xs text-primary-600 mt-1">
                          {result.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
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