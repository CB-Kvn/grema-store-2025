
export const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-primary-700 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Columna 1: Sobre Joyas de Lujo */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Sobre Joyas de Lujo
              </h3>
              <p className="text-sm sm:text-base text-primary-200">
                Creando piezas atemporales de elegancia desde 1990. Cada pieza
                cuenta una historia única.
              </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Tienda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Servicio al Cliente */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Servicio al Cliente
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Política de Envíos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Devoluciones y Cambios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Guía de Tallas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Instrucciones de Cuidado
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 4: Imagen a la derecha */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-center items-center">
              <img
                src="https://res.cloudinary.com/denqtcsyy/image/upload/f_auto,q_auto/v1/images/f0bqluptggwdvpa0yrru" // Ruta de la imagen
                alt="Imagen decorativa" // Texto alternativo
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-lg" // Estilos de la imagen
              />
            </div>
          </div>

          {/* Derechos de autor */}
          <div className="border-t border-primary-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-sm sm:text-base text-primary-200">
            <p>&copy; 2024 Code-Brain. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
