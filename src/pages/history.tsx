import React from "react";
import { motion } from "framer-motion";
import { Info, Users, Heart, Sparkles, Award, ArrowRight, PackageSearch, Flower2, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

export const HistoryUs = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative z-10 pb-8  sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-serif font-bold text-primary-900 sm:text-5xl md:text-6xl">
                  <span className="block">Historia de Grema</span>
                  <span className="block text-primary-600">Amor, resiliencia y familia</span>
                </h1>
                <p className="mt-3 text-base text-primary-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Hola, soy <span className="font-semibold text-primary-900">Grettel Barrantes</span>, fundadora de Grema. Esta es una historia que nace del amor, la resiliencia y el trabajo en familia.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80"
            alt="Taller de bisutería"
          />
        </div>
      </div>

      {/* Nueva sección animada: Historia en bloques */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-6xl mx-auto px-0 sm:px-0 lg:px-0 w-full flex flex-col gap-16">
          {/* Bloque 1 */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80"
              alt="Grettel y su mamá creando"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <HandHeart className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Un inicio resiliente</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Todo comenzó en plena pandemia, cuando el mundo se detuvo y nosotras, como tantas otras personas, tuvimos que buscar una nueva forma de salir adelante. Junto a mi mamá, María Hortensia Pérez, comenzamos a crear bisutería artesanal desde casa. Lo que en un inicio fue un acto de creatividad y esperanza, se convirtió poco a poco en el corazón económico y emocional de nuestra familia.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Bloque 2 */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1600&q=80"
              alt="Manos creando bisutería"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-r-2xl md:rounded-l-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Flower2 className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Hecho a mano y con propósito</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Mi mamá y yo somos quienes diseñamos y elaboramos, pieza por pieza, con nuestras manos y con el alma. Cada creación lleva un pedacito de nosotras: del estilo que nos define, de la historia que nos acompaña y del amor que ponemos en cada detalle. Nada está hecho a máquina, todo está hecho con propósito.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Bloque 3 */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              alt="Familia Grema"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Un sueño familiar</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Y no estamos solas. Nuestra familia completa es parte de este sueño.<br />
                  <span className="block mt-2">
                    <span className="font-semibold text-primary-900">Dayana</span>, mi hermana, se encarga con paciencia y cariño del diseño de las etiquetas, los stickers y los empaques.<br />
                    <span className="font-semibold text-primary-900">Isa</span>, nuestra otra hermana, lleva la parte administrativa, controla los gastos, hace las fotografías y nos representa con fuerza y pasión en cada feria, proyecto y rincón donde Grema se da a conocer.<br />
                    <span className="font-semibold text-primary-900">Kristel, Domingo y Emanuel</span> también son parte esencial del equipo, apoyando, recomendando y entregando con calidez.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
          {/* Bloque 4 */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&q=80"
              alt="Accesorios Grema"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-r-2xl md:rounded-l-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Accesorios con historia</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Cada pieza que vendemos representa mucho más que un accesorio. Representa una historia de esfuerzo, de unión familiar y de sueños que se construyen con las manos, paso a paso.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Bloque 5 */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
              alt="Entrega y apoyo familiar"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Gracias a tu confianza</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Gracias a quienes confían en nosotras, hoy esta pequeña empresa es el sustento de nuestra familia. Cada compra que hacés no solo te lleva un pedazo de arte, sino que apoya directamente a una familia de mujeres luchadoras, artesanas, costarricenses que siguen soñando en grande.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Bloque 6 */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse items-stretch gap-0 w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
              alt="FIDEIMAS y sueños"
              className="w-full md:w-2/3 h-[420px] object-cover rounded-r-2xl md:rounded-l-none rounded-t-2xl md:rounded-t-none shadow-lg border-4 border-white"
              style={{ objectPosition: "center" }}
            />
            <div className="flex-1 flex items-center bg-primary-50 px-8 py-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-8 w-8 text-primary-500" />
                  <span className="font-serif font-bold text-primary-900 text-xl">Un sueño que crece</span>
                </div>
                <p className="text-primary-700 text-xl leading-relaxed">
                  Nos honra haber sido seleccionadas por FIDEIMAS para llevar nuestras creaciones a los aeropuertos internacionales de Costa Rica, y soñamos con seguir creciendo, llegar a más personas, hoteles, tiendas y corazones.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Cierre tipo carta */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-right mt-8 px-8 max-w-6xl mx-auto"
        >
          <p className="font-serif font-bold text-primary-900 text-xl">
            Gracias por estar aquí y por ser parte de este camino.<br />
            <span className="block mt-4">Con gratitud infinita,</span>
            <span className="block">Grettel</span>
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <div className="bg-primary-900 w-full">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between w-full">
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

