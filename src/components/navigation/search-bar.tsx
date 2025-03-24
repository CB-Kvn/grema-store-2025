import React, { useState } from "react";
import { Product } from "../../interfaces/products"; // Importa la interfaz Product
import { products } from "@/pages/initial";
 // Importa los datos de productos

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

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
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={handleSearch}
        className="pl-10 pr-4 py-2 border border-primary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      {results.length > 0 && (
        <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-40">
          {results.slice(0, 8).map((result) => (
            <div
              key={result.id}
              className="flex items-center p-2 hover:bg-[#f2e1ee] cursor-pointer"
            >
              <img
                src={result.image}
                alt={result.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm">{result.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;