import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, Award, Users, History, Star, Heart, ArrowRight } from 'lucide-react';

export const HistoryUs = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-serif font-bold text-primary-900 sm:text-5xl md:text-6xl">
                  <span className="block">Nuestra Historia de</span>
                  <span className="block text-primary-600">Excelencia y Pasión</span>
                </h1>
                <p className="mt-3 text-base text-primary-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Desde 1990, hemos estado creando joyas excepcionales que celebran los momentos más especiales de la vida.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80"
            alt="Taller de joyería"
          />
        </div>
      </div>

      {/* Historia Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <Diamond className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-primary-900 sm:text-4xl">
              Nuestra Historia
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-primary-600 lg:mx-auto">
              Tres décadas de dedicación a la artesanía y la excelencia en joyería.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <History className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-primary-900">Fundación</p>
                <p className="mt-2 ml-16 text-base text-primary-600">
                  Fundada en 1990 por artesanos apasionados con el sueño de crear joyas únicas y significativas.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-primary-900">Excelencia</p>
                <p className="mt-2 ml-16 text-base text-primary-600">
                  Reconocidos internacionalmente por nuestra artesanía excepcional y atención al detalle.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-primary-900">Equipo</p>
                <p className="mt-2 ml-16 text-base text-primary-600">
                  Un equipo de artesanos expertos dedicados a crear piezas únicas con pasión y precisión.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-primary-900">Compromiso</p>
                <p className="mt-2 ml-16 text-base text-primary-600">
                  Comprometidos con la sostenibilidad y la ética en cada paso de nuestro proceso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Misión y Visión */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">Nuestra Misión</h3>
              <p className="text-primary-600">
                Crear joyas excepcionales que celebren los momentos más importantes de la vida, combinando artesanía tradicional con diseño contemporáneo.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">Nuestra Visión</h3>
              <p className="text-primary-600">
                Ser reconocidos globalmente como líderes en joyería fina, estableciendo nuevos estándares de excelencia y sostenibilidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificaciones */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-primary-900">Certificaciones y Reconocimientos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Diamond className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-2">ISO 9001:2015</h3>
              <p className="text-primary-600">Certificación en Gestión de Calidad</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-2">Premio Nacional</h3>
              <p className="text-primary-600">Mejor Joyería Artesanal 2023</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-primary-900 mb-2">5 Estrellas</h3>
              <p className="text-primary-600">Calificación en Servicio al Cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para descubrir</span>
            <span className="block text-primary-300">nuestra colección?</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-full shadow">
              <Link
                to="/tienda"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-primary-900 bg-white hover:bg-primary-50"
              >
                Explorar Colección
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

