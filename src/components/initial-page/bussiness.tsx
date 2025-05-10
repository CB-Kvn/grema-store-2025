import { features } from "@/utils/about-us";
import Aos from "aos";
import "aos/dist/aos.css"; 
import { useEffect } from "react";

export const Info_Bussiness = () => {
  useEffect(() => {
    Aos.init({
      duration: 600,
      delay: 100,
    });
  }, []);

  return (
    <div className="pb-14" id="about-us">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* Título y logo */}
          <div className="flex flex-col items-center">
            <p
              className="mt-2 text-3xl font-serif font-bold sm:text-4xl lg:text-5xl text-[#4A3A42]"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              ¿Por qué comprar en
            </p>
            <div className="relative -mt-10 xs:-mt-16 sm:-mt-16">
              <img
                src="/Logo en negro.png" // Ruta desde la carpeta public
                alt="Logo de Joyas de Lujo" // Texto alternativo
                className="w-36 h-36 sm:w-56 sm:h-56 md:h-64 md:w-64 lg:w-64 lg:h-64 object-contain"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              />
            </div>
          </div>
        </div>

        {/* Lista de características */}
        <div className="mx-auto max-w-2xl lg:max-w-4xl -my-10 sm:-my-14">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative pl-16"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={`${index * 200}`}
              >
                <dt
                  className="text-base font-semibold leading-7"
                  style={{
                    fontFamily: "Quicksand, sans-serif",
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
                  className="mt-2 text-sm sm:text-base leading-6 sm:leading-7"
                  style={{
                    fontFamily: "Poppins, sans-serif",
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