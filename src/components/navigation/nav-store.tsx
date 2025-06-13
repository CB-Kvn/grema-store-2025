import {
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Importar useLocation
import { useAppSelector } from "@/hooks/useAppSelector";
import LoginModal from "../admin/login/LoginModal";
import SearchBar from "./search-bar";
import React, { useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Menu_Bar = ({ isOpen }: { isOpen: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // const { user } = useAuth();
  const user = {}
  const navigate = useNavigate();
  const selectTriggerRef = useRef<HTMLButtonElement>(null);

  // Verificar si la URL contiene la palabra "tienda"
  const isTiendaPage = location.pathname.includes("tienda");

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

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

              {/* Botón solo para abrir el modal de login */}
              {!user && (
                <button
                  className="p-2 hover:bg-primary-50 rounded-full"
                  onClick={() => setIsLoginOpen(true)}
                >
                  <User className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Si el usuario está logueado, muestra avatar y botones de navegación */}
               {user && (
                <div className="flex items-center gap-2 ml-2 relative" ref={menuRef}>
                  <span
                    className="w-6 h-6 flex items-center justify-center text-white font-bold uppercase bg-primary-700 rounded-full cursor-pointer"
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    tabIndex={0}
                    role="button"
                    aria-label="Abrir menú de usuario"
                  >
                    {user.name ? user.name.charAt(0) : "U"}
                  </span>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.ul
                        initial={{ opacity: 0, scale: 0.85, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-44 bg-white rounded shadow-lg border border-primary-200 py-2"
                      >
                        <li>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-primary-50 text-primary-700"
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate("/tienda");
                            }}
                          >
                            Tienda
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-primary-50 text-primary-700"
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate("/admin/inventory");
                            }}
                          >
                            Administrar
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-primary-50 text-primary-700"
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate("/logout");
                            }}
                          >
                            Salir
                          </button>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )} 
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
