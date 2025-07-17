import { Store, ShoppingCart, User, Info, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
    valores: () => navigate("/nuestros-valores"),
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
      <nav className="sticky top-0 z-30 bg-primary-600 bg-opacity-50 backdrop-blur-md shadow-md border-b border-primary-700">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          {/* NAVBAR */}
          <div className="relative flex h-16 items-center lg:justify-between justify-center">
            {/* --- LOGO CENTRADO EN MOBILE/TABLET, IZQUIERDA EN DESKTOP --- */}
            <Link to={"/"} className="lg:flex-shrink-0">
              <div className="flex flex-shrink-0 items-center">
                <img
                  src="/Logo en negro.png"
                  alt="Logo de la empresa"
                  className="w-44 h-12 sm:w-52 sm:h-14 md:w-60 md:h-16 lg:w-48 lg:h-16 xl:w-64 xl:h-20 object-contain transition-all duration-200"
                />
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
                  <Store className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-600" /> 
                  Tienda
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                  onClick={navigationHandlers.valores}
                >
                  <Info className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-600" /> 
                  <span className="hidden lg:inline">Sobre Nosotros</span>
                  <span className="lg:hidden">Nosotros</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                  onClick={navigationHandlers.tracking}
                >
                  <Package className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-600" /> 
                  Rastreo
                </Button>
                {user?.typeUser === "ADMIN" && (
                  <Button 
                    variant="ghost" 
                    className="text-primary-900 px-3 lg:px-6 py-3 text-sm lg:text-lg font-light hover:bg-primary-50 transition-colors" 
                    onClick={navigationHandlers.admin}
                  >
                    <User className="mr-1 lg:mr-2 h-5 lg:h-6 w-5 lg:w-6 text-primary-600" /> 
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
                  <ShoppingCart className="h-8 lg:h-12 w-8 lg:w-12 text-primary-600" />
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
                    <User className="h-8 lg:h-10 w-8 lg:w-10 text-primary-600" />
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-primary-900 text-base py-3 font-light hover:bg-primary-50" onClick={navigationHandlers.tienda}>
                        <Store className="mr-2 h-4 w-4" />
                        Tienda
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-primary-900 text-base py-3 font-light hover:bg-primary-50" onClick={navigationHandlers.tracking}>
                        <Package className="mr-2 h-4 w-4" />
                        Rastreo
                      </DropdownMenuItem>
                      {user?.typeUser === "ADMIN" && (
                        <DropdownMenuItem className="text-primary-900 text-base py-3 font-light hover:bg-primary-50" onClick={navigationHandlers.admin}>
                          <User className="mr-2 h-4 w-4" />
                          Administrar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600 text-base py-3 font-light hover:bg-red-50" onClick={handleLogout}>
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
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-600 lg:hidden shadow-lg border-t border-primary-700">
        <div className="flex justify-around items-center py-2 px-4">
          <Link to="/tienda" className="flex flex-col items-center text-white hover:text-primary-200 transition-colors py-2 px-3 rounded-lg">
            <Store className="h-6 w-6 mb-1" />
            <span className="text-xs font-light">Tienda</span>
          </Link>
          <Link to="/nuestros-valores" className="flex flex-col items-center text-white hover:text-primary-200 transition-colors py-2 px-3 rounded-lg">
            <Info className="h-6 w-6 mb-1" />
            <span className="text-xs font-light">Nosotros</span>
          </Link>
          <Link to="/tracking" className="flex flex-col items-center text-white hover:text-primary-200 transition-colors py-2 px-3 rounded-lg">
            <Package className="h-6 w-6 mb-1" />
            <span className="text-xs font-light">Rastreo</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={isOpen} 
            className="flex flex-col items-center text-white hover:text-primary-200 hover:bg-primary-700 transition-colors py-2 px-3 rounded-lg relative"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="h-6 w-6 mb-1" />
            <span className="text-xs font-light">Carrito</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Button>
          {!user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLoginOpen} 
              className="flex flex-col items-center text-white hover:text-primary-200 hover:bg-primary-700 transition-colors py-2 px-3 rounded-lg"
              aria-label="Iniciar sesión"
            >
              <User className="h-6 w-6 mb-1" />
              <span className="text-xs font-light">Login</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex flex-col items-center text-white hover:text-primary-200 hover:bg-primary-700 transition-colors py-2 px-3 rounded-lg"
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
                  <span className="text-xs font-light">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2">
                {user?.typeUser === "ADMIN" && (
                  <DropdownMenuItem className="text-primary-900 text-sm py-2 font-light" onClick={navigationHandlers.admin}>
                    <User className="mr-2 h-4 w-4" />
                    Administrar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-primary-900 text-sm py-2 font-light" onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Espaciador para el menú inferior móvil */}
      <div className="h-20 lg:hidden" />



      {/* Login Modal usando Dialog de shadcn/ui */}
      <Dialog open={modals.isLoginOpen} onOpenChange={handleLoginClose}>
        <DialogContent className="max-w-md">
          <LoginModal isOpen={modals.isLoginOpen} onClose={handleLoginClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};