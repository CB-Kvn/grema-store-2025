import { features } from "@/utils/about-us";
import Aos from "aos";
import "aos/dist/aos.css"; // Importar CSS de AOS
import { useEffect } from "react";

export const Info_Bussiness = () => {
  useEffect(() => {
    Aos.init({
      duration: 600,
      delay: 100,
    });
  }, []);

  return (
    <div className="py-28  " id="about-us">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* Título y logo */}
          <div className="flex flex-col items-center">
            <p
              className="mt-2 text-4xl font-serif font-bold sm:text-5xl"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              ¿Por qué comprar en
            </p>
            <div className="relative -mt-28">
              <img
                src="/Logo en negro.png" // Ruta desde la carpeta public
                alt="Logo de Joyas de Lujo" // Texto alternativo
                className="w-48 h-48 sm:w-96 sm:h-96 object-contain" // Tamaño más grande
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200" // Retraso para la animación
              />
            </div>
          </div>
        </div>

        {/* Lista de características */}
        <div className="mx-auto max-w-2xl  lg:max-w-4xl -my-14">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative pl-16"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={`${index * 200}`} // Retraso escalonado para cada elemento
              >
                <dt
                  className="text-base font-semibold leading-7"
                  style={{
                    fontFamily: "Quicksand, sans-serif", // Fuente Quicksand para títulos
                    color: "#4A3A42",
                  }}
                >
                  <div className="bg-[#9D557A] text-white absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd
                  className="mt-2 text-base leading-7"
                  style={{
                    fontFamily: "Poppins, sans-serif", // Fuente Poppins para textos
                    color: "#686e7d",
                  }}
                >
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};