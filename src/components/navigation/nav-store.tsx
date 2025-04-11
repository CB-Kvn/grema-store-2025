import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import SearchBar from "@/components/navigation/search-bar";
import clsx from "clsx";
import { products_list } from "@/utils/categoriesMsg";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, User } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import LoginModal from "../LoginModal";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <ScrollLink
          activeClass="active"
          to={href!}
          spy={true}
          smooth={true}
          offset={50}
          duration={500}
        >
          <a
            className={clsx(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#f2e1ee] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </ScrollLink>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

export const Menu_Bar = ({ isOpen }: { isOpen: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const navigate = useNavigate(); // Hook para redirigir
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-30 "
        style={{ backgroundColor: "rgba(249, 242, 246)" }}
      >
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 z-30">
          <div className="relative flex h-16 items-center justify-between z-30">
            {/* Botón para menú móvil */}
            <button
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logos */}
            <Link to={"/"}>
              <div className="flex flex-shrink-0 items-center">
                {/* Logo para móviles */}
                <div className="navbar-center block sm:hidden">
                  <div className="w-52 h-16 bg-cover bg-center bg-no-repeat">
                    <img
                      src="/Logo en negro.png" // Ruta desde la carpeta public
                      alt="Logo de la empresa"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Logo para escritorio */}
                <div className="navbar-center hidden md:block">
                  <div className="w-64 h-24 my-2 bg-cover bg-center bg-no-repeat">
                    <img
                      src="/Logo en negro.png" // Ruta desde la carpeta public
                      alt="Logo de la empresa"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </Link>

            {/* Botones Navegación (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              <NavigationMenu className="bg-transparent">
                <NavigationMenuList>
                  <NavigationMenuItem className="bg-transparent">
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">
                      Conozcanos mejor
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-transparent">
                      <ul className="grid w-[450px] gap-3 p-4 md:w-[450px] md:grid-cols-2 lg:w-[450px]">
                        {/* Enlace a una nueva página */}
                        <li>
                          <Link
                            to="/sobre-nosotros"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#f2e1ee] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              Sobre Nosotros
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Descubre nuestra historia y misión.
                            </p>
                          </Link>
                        </li>

                        {/* Enlace a una nueva página */}
                        <li>
                          <Link
                            to="/nuestros-valores"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#f2e1ee] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              Nuestros Valores
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Conoce los principios que nos guían.
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="bg-transparent rounded-md">
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">
                      Tienda en Linea
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-transparent">
                      <ul className="grid w-[450px] gap-3 p-4 md:w-[450px] md:grid-cols-2 lg:w-[800px]">
                        {products_list.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Botón de Login */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Login
              </button>
            </div>

            {/* Barra de búsqueda y carrito (600px a 1024px) */}
            <div className="flex items-center space-x-4 z-30">
              {/* Barra de búsqueda - visible en sm y lg */}
              <div className="hidden sm:block">
                <SearchBar />
              </div>

              {/* Botón del carrito - visible en sm */}
              <div className="">
                <button
                  className="p-2 hover:bg-primary-50 rounded-full relative"
                  onClick={() => {
                    isOpen();
                  }}
                >
                  <ShoppingCart className="h-6 w-6 text-primary-600" />
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

              {/* Botón de login */}
              <div>
                <button
                  className="p-2 hover:bg-primary-50 rounded-full"
                  onClick={() => setIsLoginOpen(true)}
                >
                  <User className="h-6 w-6 text-primary-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg">
              <ul className="space-y-1 px-2 pb-3 pt-2">
                {/* Enlace a una nueva página */}
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

                {/* Enlace a una nueva página */}
                <li>
                  <Link
                    to="/nuestros-valores"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Nuestros Valores
                  </Link>
                </li>

                {/* Enlaces de productos con ScrollLink */}
                {products_list.map((item) => (
                  <li key={item.title}>
                    <ScrollLink
                      to={item.title.toLowerCase()}
                      smooth={true}
                      duration={500}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.title}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
