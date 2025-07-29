import { features } from "@/utils/about-us";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { IKImage, IKContext } from 'imagekitio-react';

export const Info_Bussiness = () => {
  useEffect(() => {
    Aos.init({
      duration: 600,
      delay: 100,
    });
  }, []);

  return (
    <div className="" id="about-us">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* Título y logo */}
          <div className="flex flex-col items-center mb-2">
            <p
              className="mt-2 text-3xl font-serif font-bold sm:text-4xl lg:text-5xl text-primary-900 tracking-tight"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              ¿Por qué comprar en
            </p>
            <div className="relative xs:mt-2 sm:mt-6 flex justify-center">
              <IKContext urlEndpoint="https://ik.imagekit.io/xj7y5uqcr">
              <IKImage
                path="/tr:w-500,q-80/Logos/Logo_en_negro.png"
                  loading="lazy"
                  lqip={{ active: true }}
                  alt="Logo Grema"
                  className="h-20 w-auto object-contain"
                />
              </IKContext>
            </div>
          </div>
        </div>

        {/* Lista de características */}
        <div className="mx-auto max-w-2xl lg:max-w-4xl mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 lg:gap-y-16" role="list" aria-label="Características de nuestros productos">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative flex flex-col items-center text-center pl-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-lg py-7 px-6 hover:shadow-xl hover:scale-105 transition-all duration-300 transform active:scale-95 border border-primary-200"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={`${index * 180}`}
                role="listitem"
              >
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white flex h-12 w-12 items-center justify-center rounded-xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300">
                  <feature.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold leading-7"
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                    color: "#4A3A42",
                  }}
                >
                  {feature.name}
                </h3>
                <p
                  className="mt-3 text-base leading-7"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#686e7d",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};