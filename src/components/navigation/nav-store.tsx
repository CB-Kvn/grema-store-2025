import { Store, ShoppingCart, User, Info, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { IKImage, IKContext } from 'imagekitio-react';
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SearchBar from "./search-bar";
import LoginModal from "../admin/login/LoginModal";
import { useAuthGoogleContext } from "@/context/ContextAuth";

interface MenuBarProps {
  isOpen: () => void;
}

export const Menu_Bar: React.FC<MenuBarProps> = ({ isOpen }) => {
  // Estados agrupados para evitar cambios en el orden de hooks
  const [modals, setModals] = useState({
    isLoginOpen: false,
    showUserMenu: false,
    showFallback: false
  });

  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, logout } = useAuthGoogleContext();
  const navigate = useNavigate();

  // Memoizar el total de items del carrito para evitar recálculos
  const totalCartItems = useMemo(() => 
    cartItems.reduce((total: number, item: any) => total + item.quantity, 0),
    [cartItems]
  );

  // Callbacks memoizados para evitar re-renderizados
  const handleLoginOpen = useCallback(() => {
    setModals(prev => ({ ...prev, isLoginOpen: true }));
  }, []);

  const handleLoginClose = useCallback(() => {
    setModals(prev => ({ ...prev, isLoginOpen: false }));
  }, []);

  const handleUserMenuChange = useCallback((open: boolean) => {
    setModals(prev => ({ ...prev, showUserMenu: open }));
  }, []);

  const handleImageError = useCallback(() => {
    setModals(prev => ({ ...prev, showFallback: true }));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setModals(prev => ({ ...prev, showUserMenu: false }));
    navigate("/");
  }, [logout, navigate]);

  // Navegación memoizada
  const navigationHandlers = useMemo(() => ({
    tienda: () => navigate("/tienda"),
    valores: () => navigate("/sobre-nosotros"),
    tracking: () => navigate("/tracking"),
    admin: () => navigate("/admin/inventory"),
    home: () => navigate("/")
  }), [navigate]);

  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado:", user);
    }
  }, [user]);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-gradient-to-r from-primary-600/40 to-primary-700/80 backdrop-blur-lg shadow-lg border-b border-primary-200/20">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          {/* NAVBAR */}
          <div className="relative flex h-16 items-center lg:justify-between justify-center">
            {/* --- LOGO CENTRADO EN MOBILE/TABLET, IZQUIERDA EN DESKTOP --- */}
            <Link to={"/"} className="lg:flex-shrink-0">
              <div className="flex flex-shrink-0 items-center">
                <IKContext urlEndpoint="https://ik.imagekit.io/xj7y5uqcr">
              <IKImage
                path="/tr:w-300,q-80/Logos/Logo_en_negro.png"
                loading="lazy"
                lqip={{ active: true }}
                alt="Logo de la empresa"
                className="w-52 h-14 sm:w-60 sm:h-16 md:w-64 md:h-18 lg:w-48 lg:h-16 xl:w-64 xl:h-20 object-contain transition-all duration-200"
              />
            </IKContext>
              </div>
            </Link>

            {/* --- BUSQUEDA SOLO EN MD, OCULTA EN MOBILE Y LG+ --- */}
            <div className="hidden md:flex lg:hidden absolute right-0 items-center">
              {/* Botón de búsqueda */}
              <SearchBar />
            </div>

            {/* --- CENTRO: BOTONES SOLO EN LG+ --- */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="flex gap-2 lg:gap-4">
                <Button 
                  variant="ghost" 
                  className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                  onClick={navigationHandlers.tienda}
                >
                  <Store className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-900" /> 
                  Tienda
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                  onClick={navigationHandlers.valores}
                >
                  <Info className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-900" /> 
                  <span className="hidden lg:inline">Sobre Nosotros</span>
                  <span className="lg:hidden">Nosotros</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                  onClick={navigationHandlers.tracking}
                >
                  <Package className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-900" /> 
                  Rastreo
                </Button>
                {user?.typeUser === "ADMIN" && (
                  <Button 
                    variant="ghost" 
                    className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                    onClick={navigationHandlers.admin}
                  >
                    <User className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-900" /> 
                    <span className="hidden lg:inline">Administración</span>
                    <span className="lg:hidden">Admin</span>
                  </Button>
                )}
              </div>
            </div>

            {/* --- DERECHA: ACCIONES SOLO EN LG+ --- */}
            <div className="hidden lg:flex items-center gap-2 lg:gap-4">
              {/* Acciones: búsqueda, carrito, usuario */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                <div className="block">
                  <SearchBar />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={isOpen} 
                  className="relative p-2 lg:p-3 hover:bg-primary-50 rounded-full transition-colors"
                  aria-label="Abrir carrito de compras"
                >
                  <ShoppingCart className="h-8 lg:h-12 w-8 lg:w-12 text-primary-900" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs lg:text-sm rounded-full h-5 lg:h-6 w-5 lg:w-6 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </Button>
                {!user && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLoginOpen} 
                    className="p-2 lg:p-3 hover:bg-primary-50 rounded-full transition-colors"
                    aria-label="Iniciar sesión"
                  >
                    <User className="h-8 lg:h-10 w-8 lg:w-10 text-primary-900" />
                  </Button>
                )}
                {user && (
                  <DropdownMenu open={modals.showUserMenu} onOpenChange={handleUserMenuChange}>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer w-8 lg:w-10 h-8 lg:h-10 hover:ring-2 hover:ring-primary-200 transition-all">
                        {!modals.showFallback && user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 lg:w-10 h-8 lg:h-10 rounded-full"
                            onError={handleImageError}
                          />
                        ) : (
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {user.name ? user.name.charAt(0) : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    {/* --- Menú de usuario (Dropdown) --- */}
                    <DropdownMenuContent align="end" className="w-48 bg-gradient-to-br from-white to-primary-25 shadow-xl border border-primary-100 rounded-xl">
                      <DropdownMenuItem className="text-primary-900 text-base py-3 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={navigationHandlers.tienda}>
                        <Store className="mr-2 h-4 w-4" />
                        Tienda
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-primary-900 text-base py-3 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={navigationHandlers.tracking}>
                        <Package className="mr-2 h-4 w-4" />
                        Rastreo
                      </DropdownMenuItem>
                      {user?.typeUser === "ADMIN" && (
                        <DropdownMenuItem className="text-primary-900 text-base py-3 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={navigationHandlers.admin}>
                          <User className="mr-2 h-4 w-4" />
                          Administrar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600 text-base py-3 font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={handleLogout}>
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>



      {/* Menú inferior móvil - visible hasta MD */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary-600/80 to-primary-700/80 backdrop-blur-lg lg:hidden shadow-2xl border-t border-primary-500">
        <div className="flex justify-around items-center py-2 px-4">
          <Link to="/tienda" className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl">
            <Store className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Tienda</span>
          </Link>
          <Link to="/sobre-nosotros" className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl">
            <Info className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Nosotros</span>
          </Link>
          <Link to="/tracking" className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl">
            <Package className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Rastreo</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={isOpen} 
            className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl relative"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="h-6 w-6 mb-1" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg font-bold">
                {totalCartItems}
              </span>
            )}
            <span className="text-xs font-medium">Carrito</span>
          </Button>
          {!user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLoginOpen} 
              className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl"
              aria-label="Iniciar sesión"
            >
              <User className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Login</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex flex-col items-center text-white hover:text-primary-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 py-2 px-3 rounded-xl"
                  aria-label="Menú de usuario"
                >
                  <Avatar className="w-6 h-6 mb-1">
                    {!modals.showFallback && user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                        onError={handleImageError}
                      />
                    ) : (
                      <AvatarFallback className="w-6 h-6 text-xs">
                        {user.name ? user.name.charAt(0) : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-xs font-medium">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2 bg-gradient-to-br from-white to-primary-25 shadow-xl border border-primary-100 rounded-xl">
                {user?.typeUser === "ADMIN" && (
                  <DropdownMenuItem className="text-primary-900 text-sm py-2 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={navigationHandlers.admin}>
                    <User className="mr-2 h-4 w-4" />
                    Administrar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600 text-sm py-2 font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:shadow-md transition-all duration-300 rounded-lg mx-1 my-1" onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>





      {/* Login Modal usando Dialog de shadcn/ui */}
      <Dialog open={modals.isLoginOpen} onOpenChange={handleLoginClose}>
        <DialogContent className="max-w-md">
          <LoginModal isOpen={modals.isLoginOpen} onClose={handleLoginClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};