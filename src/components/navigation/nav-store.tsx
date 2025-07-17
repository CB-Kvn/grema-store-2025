import { Store, ShoppingCart, User, Info, Menu, Package } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SearchBar from "./search-bar";
import LoginModal from "../admin/login/LoginModal";
import { useAuthGoogleContext } from "@/context/ContextAuth";
import { LCPLogo } from "@/components/common/Logo";

export const Menu_Bar = ({ isOpen }: { isOpen: () => void }) => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { user, logout } = useAuthGoogleContext(); // <--- Usa el hook aquí
  const navigate = useNavigate();

  // Verifica si la URL contiene la palabra "tienda"
  const isTiendaPage = location.pathname.includes("tienda");

  useEffect(() => {
    console.log("Usuario autenticado:", user);
  }, [user]);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-primary-600 bg-opacity-50 backdrop-blur-md shadow-md border-b border-primary-700">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          {/* NAVBAR */}
          <div className="relative flex h-16 items-center justify-between">
            {/* --- IZQUIERDA: LOGO SIEMPRE VISIBLE --- */}
            <Link to={"/"}>
              <div className="flex flex-shrink-0 items-center">
                <LCPLogo
                  variant="black"
                  className="w-32 h-12 sm:w-48 sm:h-16 lg:w-64 lg:h-20 object-contain"
                />
              </div>
            </Link>

            {/* --- BTN HAMBURGUESA Y BUSQUEDA SOLO EN SM Y MD, ALINEADOS A LA DERECHA --- */}
            <div className="flex-1 flex md:hidden justify-end gap-2">
              {/* Botón de búsqueda */}
              <SearchBar />
              {/* Botón hamburguesa */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 hover:bg-primary-50 rounded-full"
                    aria-label="Abrir menú de navegación"
                  >
                    <Menu className="h-6 w-6 text-primary-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="flex flex-col gap-2 p-4 items-start">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                      <LCPLogo
                        variant="black"
                        className="w-32 h-12 object-contain"
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-primary-900 px-6 py-4 text-lg font-light"
                      onClick={() => navigate("/tienda")}
                    >
                      <Store className="mr-2 h-6 w-6 text-primary-600" /> Tienda
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-primary-900 px-6 py-4 text-lg font-light"
                      onClick={() => navigate("/nuestros-valores")}
                    >
                      <Info className="mr-2 h-6 w-6 text-primary-600" /> Sobre Nosotros
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-primary-900 px-6 py-4 text-lg font-light"
                      onClick={() => navigate("/tracking")}
                    >
                      <Package className="mr-2 h-6 w-6 text-primary-600" /> Rastreo
                    </Button>
                    {/* --- Sheet lateral (menú hamburguesa) --- */}
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-primary-900 px-6 py-4 text-lg font-light"
                      onClick={() => navigate("/admin/inventory")}
                      // Solo muestra si es admin
                      style={{ display: user?.typeUser === "ADMIN" ? "flex" : "none" }}
                    >
                      <User className="mr-2 h-6 w-6 text-primary-600" /> Administración
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* --- CENTRO: BOTONES SOLO EN LG+ --- */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex gap-4">
                <Button variant="ghost" className="text-primary-900 px-6 py-3 text-lg font-light" onClick={() => navigate("/tienda")}>
                  <Store className="mr-2 h-6 w-6 text-primary-600" /> Tienda
                </Button>
                <Button variant="ghost" className="text-primary-900 px-6 py-3 text-lg font-light" onClick={() => navigate("/sobre-nosotros")}>
                  <Info className="mr-2 h-6 w-6 text-primary-600" /> Sobre Nosotros
                </Button>
                <Button variant="ghost" className="text-primary-900 px-6 py-3 text-lg font-light" onClick={() => navigate("/tracking")}>
                  <Package className="mr-2 h-6 w-6 text-primary-600" /> Rastreo
                </Button>
                {user?.typeUser === "ADMIN" && (
                  <Button variant="ghost" className="text-primary-900 px-6 py-3 text-lg font-light" onClick={() => navigate("/admin/inventory")}>
                    <User className="mr-2 h-6 w-6 text-primary-600" /> Administración
                  </Button>
                )}
              </div>
            </div>

            {/* --- DERECHA: ACCIONES --- */}
            <div className="flex items-center gap-4">
              {/* Acciones: búsqueda, carrito, usuario */}
              <div className="flex items-center space-x-2">
                <div className="hidden md:block">
                  <SearchBar />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={isOpen} 
                  className="relative p-3 hover:bg-primary-50 rounded-full"
                  aria-label="Abrir carrito de compras"
                >
                  <ShoppingCart className="h-12 w-12 text-primary-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                      {cartItems.reduce((total: number, item: any) => total + item.quantity, 0)}
                    </span>
                  )}
                </Button>
                {!user && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsLoginOpen(true)} 
                    className="p-3 hover:bg-primary-50 rounded-full"
                    aria-label="Iniciar sesión"
                  >
                    <User className="h-10 w-10 text-primary-600" />
                  </Button>
                )}
                {user && (
                  <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer w-10 h-10">
                        {!showFallback && (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                            onError={() => setShowFallback(true)}
                          />
                        )}
                        {showFallback && (
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0) : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    {/* --- Menú de usuario (Dropdown) --- */}
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-primary-900 text-lg py-3 font-light" onClick={() => navigate("/tienda")}>Tienda</DropdownMenuItem>
                      <DropdownMenuItem className="text-primary-900 text-lg py-3 font-light" onClick={() => navigate("/tracking")}>Rastreo</DropdownMenuItem>
                      {user?.typeUser === "ADMIN" && (
                        <DropdownMenuItem className="text-primary-900 text-lg py-3 font-light" onClick={() => navigate("/admin/inventory")}>Administrar</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-primary-900 text-lg py-3 font-light" onClick={() => { 
                        logout(); 
                        setShowUserMenu(false); 
                        navigate("/");
                      }}>Salir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú inferior móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-600 md:hidden shadow-lg">
        <div className="flex justify-around items-center py-3">
          <Link to="/tienda" className="flex flex-col items-center text-white hover:text-primary-200">
            <Store className="h-8 w-8" />
            <span className="text-sm font-light">Tienda</span>
          </Link>
          <Link to="/tracking" className="flex flex-col items-center text-white hover:text-primary-200">
            <Package className="h-8 w-8" />
            <span className="text-sm font-light">Rastreo</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={isOpen} 
            className="flex flex-col items-center text-white hover:text-primary-200"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="h-10 w-10" />
            <span className="text-sm font-light">Carrito</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsLoginOpen(true)} className="flex flex-col items-center text-white hover:text-primary-200">
            <User className="h-8 w-8" />
            <span className="text-sm font-light">Login</span>
          </Button>
        </div>
      </div>



      {/* Login Modal usando Dialog de shadcn/ui */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md">
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};