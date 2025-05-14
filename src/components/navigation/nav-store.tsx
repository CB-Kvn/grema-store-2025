import {
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Importar useLocation
import { useAppSelector } from "@/hooks/useAppSelector";
import LoginModal from "../admin/login/LoginModal";
import SearchBar from "./search-bar";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";

export const Menu_Bar = ({ isOpen }: { isOpen: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual

  // Verificar si la URL contiene la palabra "tienda"
  const isTiendaPage = location.pathname.includes("tienda");

  return (
    <>
      <nav className="sticky top-0 z-30 bg-primary-600 bg-opacity-50 backdrop-blur-md shadow-md border-b border-primary-700">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Botón para menú móvil a la izquierda */}
            <button
              className="flex items-center space-x-2 md:hidden p-2 text-white hover:bg-primary-700 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
              <span className="text-sm font-medium">MENU</span>
            </button>

            {/* Logo dinámico en el centro */}
            <Link to={"/"}>
              <div className="flex flex-shrink-0 items-center">
                <div className="w-32 h-12 sm:w-48 sm:h-16 lg:w-64 lg:h-20 bg-cover bg-center bg-no-repeat">
                  <img
                    src="/Logo en negro.png"
                    alt="Logo de la empresa"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Link>

            {/* Botones de búsqueda y carrito a la derecha */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchBar />
              {/* Botón del carrito */}
              <button
                className="p-2 hover:bg-primary-50 rounded-full relative"
                onClick={() => {
                  isOpen();
                }}
              >
                <ShoppingCart className="h-6 w-6 text-white" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </button>

              {/* Botón de login */}
              <button
                className="p-2 hover:bg-primary-50 rounded-full"
                onClick={() => setIsLoginOpen(true)}
              >
                <User className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú inferior para pantallas pequeñas */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-600 md:hidden shadow-lg">
        <div className="flex justify-around items-center py-2">
          {/* Botón Tienda */}
          <Link
            to="/tienda"
            className="flex flex-col items-center text-white hover:text-primary-200"
          >
            <Store className="h-6 w-6" />
            <span className="text-xs">Tienda</span>
          </Link>

          {/* Botón Carrito */}
          <button
            onClick={() => isOpen()}
            className="flex flex-col items-center text-white hover:text-primary-200"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs">Carrito</span>
          </button>

          {/* Botón Login */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center text-white hover:text-primary-200"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Login</span>
          </button>
        </div>
      </div>

      {/* Franja "Ver tienda" */}
      {!isTiendaPage && (
        <Link
          to="/tienda"
          className="hidden md:block bg-primary-600 text-white py-3 hover:bg-primary-700 active:bg-primary-800 transition-colors duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            <Store className="h-6 w-6" />
            <span className="text-sm font-medium">Ver tienda</span>
          </div>
        </Link>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
