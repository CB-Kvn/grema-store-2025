import { useNavigate } from "react-router-dom";

export const LogoInitial = () => {
   const navigation = useNavigate()
  return (
    <>
      {/* Hero Section */}
      <div className=" py-8 sm:py-8" data-aos="fade-up"
              data-aos-duration="1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <div className="mb-4 sm:mb-6">
            <img
              src="https://res.cloudinary.com/denqtcsyy/image/upload/f_auto,q_auto/v1/images/h13dsdlzrls0y5iktl2z" // Ruta de la imagen en la carpeta public
              alt="Descripción de la imagen" // Texto alternativo para accesibilidad
              className="mx-auto" // Clases de estilo
            />
          </div> */}
          <button onClick={()=>navigation("/tienda")} className="bg-primary-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors shadow-md animate-pulse-custom">
            Explorar Colección
          </button>
        </div>
      </div>
    </>
  );
};
