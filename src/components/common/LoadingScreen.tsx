import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular carga progresiva
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Completar la carga inmediatamente si hay búsqueda
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 300);
    }
  };

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center z-50">
      <div className="text-center max-w-md w-full px-6">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <picture>
            <source srcSet="/Logo en negro.webp" type="image/webp" />
            <img
              src="/Logo en negro.png"
              alt="Grema Store"
              className="w-48 h-32 sm:w-64 sm:h-40 lg:w-80 lg:h-48 object-contain mx-auto"
            />
          </picture>
        </div>

        {/* Título de bienvenida */}
        <div className="mb-8 animate-fade-in-delay">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
            Bienvenido a Grema Store
          </h1>
          <p className="text-primary-600 text-sm sm:text-base">
            Encuentra todo lo que necesitas
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8 animate-fade-in-delay-2">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-full border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-center"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-primary-600 hover:bg-primary-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Barra de progreso */}
        <div className="mb-4 animate-fade-in-delay-3">
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-primary-600 text-sm mt-2">
            Cargando... {progress}%
          </p>
        </div>

        {/* Mensaje de carga */}
        <div className="animate-pulse">
          <p className="text-primary-500 text-xs">
            Preparando tu experiencia de compra
          </p>
        </div>
      </div>
    </div>
  );
};
