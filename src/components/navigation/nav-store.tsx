import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import LoginModal from "../admin/login/LoginModal";
import SearchBar from "./search-bar";

export const Menu_Bar = ({ isOpen }: { isOpen: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-primary-600 bg-opacity-50 backdrop-blur-md shadow-md">
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
                    src="/Logo en negro.png" // Ruta desde la carpeta public
                    alt="Logo de la empresa"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Link>

            {/* Botones de búsqueda y carrito a la derecha */}
            <div className="flex items-center space-x-4">
              {/* Botón de búsqueda */}
              <button
                className="p-2 hover:bg-primary-50 rounded-full"
                onClick={() => {
                  // Lógica para abrir la barra de búsqueda
                }}
              >
                <SearchBar />
              </button>

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
            </div>
          </div>

          {/* Menú móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg">
              <ul className="space-y-1 px-2 pb-3 pt-2">
                <li>
                  <SearchBar />
                </li>
                <li>
                  <Link
                    to="/sobre-nosotros"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nuestros-valores"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Nuestros Valores
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Franja con ícono de tienda y frase */}
      <Link
        to="/tienda"
        className="hidden md:block bg-primary-600 text-white py-3 hover:bg-primary-700 active:bg-primary-800 transition-colors duration-300"
      >
        <div className="flex items-center justify-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-sm font-medium">Ver tienda</span>
        </div>
      </Link>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
