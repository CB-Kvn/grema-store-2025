import { Link } from "react-router-dom";
import {
  Shield,
  Gem,
  Leaf,
  HandHeart,
  Users,
  Scale,
  ArrowRight,
  Diamond,
} from "lucide-react";
import { values } from "@/utils/valores";

export const ValuesPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Diamond className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-primary-900 sm:text-5xl">
              Nuestros Valores
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-600">
              Los principios que guían cada aspecto de nuestro trabajo y definen
              quiénes somos.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-primary-50 rounded-lg p-8 transform transition-transform hover:scale-105"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-primary-900 text-center">
                  {value.title}
                </h3>
                <p className="mt-4 text-primary-600 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="bg-primary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white sm:text-4xl">
                Nuestro Compromiso con la Calidad
              </h2>
              <p className="mt-4 text-lg text-primary-300">
                Cada pieza que creamos es un testimonio de nuestro compromiso
                con la excelencia. Utilizamos solo los mejores materiales y
                aplicamos técnicas artesanales perfeccionadas a lo largo de
                generaciones.
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Gem className="h-6 w-6 text-primary-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">
                      Materiales de Primera Calidad
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-primary-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">
                      Artesanos Expertos
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">
                      Garantía de Autenticidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                className="rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80"
                alt="Artesano trabajando"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Leaf className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-primary-900">
              Compromiso con la Sostenibilidad
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-600">
              Trabajamos activamente para minimizar nuestro impacto ambiental y
              promover prácticas sostenibles.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-primary-900">
                Materiales Sostenibles
              </h3>
              <p className="mt-2 text-primary-600">
                Utilizamos materiales reciclados y de origen ético cuando es
                posible.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <HandHeart className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-primary-900">
                Comercio Justo
              </h3>
              <p className="mt-2 text-primary-600">
                Aseguramos condiciones justas para todos nuestros colaboradores.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Scale className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-primary-900">
                Transparencia
              </h3>
              <p className="mt-2 text-primary-600">
                Compartimos abiertamente nuestros procesos y prácticas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Quieres conocer más sobre</span>
            <span className="block text-primary-300">nuestro trabajo?</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-full shadow">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-primary-900 bg-white hover:bg-primary-50"
                aria-label="Conocer más sobre nuestra historia y valores"
              >
                Conoce Nuestra Historia
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

