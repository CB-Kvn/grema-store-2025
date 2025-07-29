import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HandHeart, Users, Sparkles, Award, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

// Nuevo componente para mostrar familia
function FamilyBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-primary-50 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8 px-8 py-10 my-8"
    >
      <Users className="h-14 w-14 text-primary-500 mb-4 md:mb-0" />
      <div className="flex-1">
        <h3 className="font-serif font-bold text-primary-900 text-2xl mb-2">
          Un sueño familiar
        </h3>
        <p className="text-primary-700 text-lg leading-relaxed">
          Y no estamos solas. Nuestra familia completa es parte de este sueño.
          <br />
          <span className="block mt-2">
            <span className="font-semibold text-primary-900">Dayana</span>, mi hermana, se encarga con paciencia y cariño del diseño de las etiquetas, los stickers y los empaques.<br />
            <span className="font-semibold text-primary-900">Isa</span>, nuestra otra hermana, lleva la parte administrativa, controla los gastos, hace las fotografías y nos representa con fuerza y pasión en cada feria, proyecto y rincón donde Grema se da a conocer.<br />
            <span className="font-semibold text-primary-900">Kristel, Domingo y Emanuel</span> también son parte esencial del equipo, apoyando, recomendando y entregando con calidez.
          </span>
        </p>
      </div>
    </motion.div>
  );
}

// Nuevo componente para mostrar accesorios con historia
function HistoryBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-primary-100 rounded-xl shadow flex flex-col items-center text-center px-6 py-8"
    >
      <Sparkles className="h-12 w-12 text-primary-500 mb-4" />
      <h3 className="font-serif font-bold text-primary-900 text-xl mb-2">
        Accesorios con historia
      </h3>
      <p className="text-primary-700 text-base leading-relaxed">
        Cada pieza que vendemos representa mucho más que un accesorio. Representa una historia de esfuerzo, de unión familiar y de sueños que se construyen con las manos, paso a paso.
      </p>
    </motion.div>
  );
}

// Nuevo componente para mostrar agradecimiento
function ThanksBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="bg-primary-100 rounded-xl shadow flex flex-col items-center text-center px-6 py-8"
    >
      <HandHeart className="h-12 w-12 text-primary-500 mb-4" />
      <h3 className="font-serif font-bold text-primary-900 text-xl mb-2">
        Gracias a tu confianza
      </h3>
      <p className="text-primary-700 text-base leading-relaxed">
        Gracias a quienes confían en nosotras, hoy esta pequeña empresa es el sustento de nuestra familia. Cada compra que hacés no solo te lleva un pedazo de arte, sino que apoya directamente a una familia de mujeres luchadoras, artesanas, costarricenses que siguen soñando en grande.
      </p>
    </motion.div>
  );
}

// Nuevo componente para mostrar logros y sueños
function AwardBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="bg-primary-100 rounded-xl shadow flex flex-col items-center text-center px-6 py-8"
    >
      <Award className="h-12 w-12 text-primary-500 mb-4" />
      <h3 className="font-serif font-bold text-primary-900 text-xl mb-2">
        Un sueño que crece
      </h3>
      <p className="text-primary-700 text-base leading-relaxed">
        Nos honra haber sido seleccionadas por FIDEIMAS para llevar nuestras creaciones a los aeropuertos internacionales de Costa Rica, y soñamos con seguir creciendo, llegar a más personas, hoteles, tiendas y corazones.
      </p>
    </motion.div>
  );
}

// Primer mosaico vertical (estructura tipo L)
function VerticalMosaicL({ images }: { images: string[] }) {
  return (
    <div className="w-full lg:w-[340px] h-[420px] grid grid-cols-2 grid-rows-2 gap-3">
      <img
        src={images[0]}
        alt="Mosaico 1"
        className="row-span-2 rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
      <img
        src={images[1]}
        alt="Mosaico 2"
        className="rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
      <img
        src={images[2]}
        alt="Mosaico 3"
        className="rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
    </div>
  );
}

// Segundo mosaico vertical (estructura tipo escalera)
function VerticalMosaicStairs({ images }: { images: string[] }) {
  return (
    <div className="w-full lg:w-[340px] h-[420px] grid grid-cols-2 grid-rows-2 gap-3">
      <img
        src={images[0]}
        alt="Mosaico 1"
        className="col-span-2 rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
      <img
        src={images[1]}
        alt="Mosaico 2"
        className="rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
      <img
        src={images[2]}
        alt="Mosaico 3"
        className="rounded-xl shadow-lg object-cover w-full h-full"
        style={{ objectPosition: "center" }}
      />
    </div>
  );
}

export default function AboutUs() {
  // Breadcrumbs para about-us
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Sobre Nosotros', url: '/sobre-nosotros', isActive: true }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-2 py-8 md:px-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      </div>
      
      {/* Hero */}
      <section className="w-[80vw] max-w-6xl px-0 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-0">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col justify-center items-start px-8 py-8 min-h-[340px] bg-white"
        >
          <Badge className="mb-4 px-6 py-3 bg-primary-100 text-primary-700 text-base rounded-full shadow">
            Sobre Nosotras
          </Badge>
          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-primary-900 mb-6">
            Historia de Grema
          </h1>
          <p className="text-lg text-primary-700 mb-8 max-w-xl">
            Hola, soy{" "}
            <span className="font-semibold text-primary-900">
              Grettel Barrantes
            </span>
            , fundadora de Grema, y esta es una historia que nace del amor, la
            resiliencia y el trabajo en familia.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 py-4 text-base shadow-lg">
            <Link to="/tienda">Ver Colección</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center items-center min-h-[360px] bg-white w-full"
        >
          {/* Imagen original, no mosaico */}
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80"
            alt="Bisutería artesanal"
            className="rounded-2xl shadow-lg border-4 border-primary-100 w-full h-[360px] object-cover"
            style={{ objectPosition: "center" }}
          />
        </motion.div>
      </section>

      {/* Separador */}
      <Separator className="my-0 w-[80vw] max-w-6xl" />

      {/* Historia en bloques animados */}
      <section className="w-[80vw] max-w-6xl px-0 py-0 flex flex-col gap-0">
        {/* Primer bloque con mosaico tipo L */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row items-stretch w-full min-h-[420px] mb-8"
        >
          <VerticalMosaicL
            images={[
              "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
            ]}
          />
          <div className="flex-1 flex items-center bg-white px-10 py-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HandHeart className="h-8 w-8 text-primary-500" />
                <span className="font-serif font-bold text-primary-900 text-xl">
                  Un inicio resiliente
                </span>
              </div>
              <p className="text-primary-700 text-lg leading-relaxed">
                Todo comenzó en plena pandemia, cuando el mundo se detuvo y nosotras, como tantas otras personas, tuvimos que buscar una nueva forma de salir adelante. Junto a mi mamá, María Hortensia Pérez, comenzamos a crear bisutería artesanal desde casa. Lo que en un inicio fue un acto de creatividad y esperanza, se convirtió poco a poco en el corazón económico y emocional de nuestra familia.
              </p>
            </div>
          </div>
        </motion.div>
        {/* Segundo bloque con mosaico tipo escalera */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row-reverse items-stretch w-full min-h-[420px] mb-8"
        >
          <VerticalMosaicStairs
            images={[
              "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
            ]}
          />
          <div className="flex-1 flex items-center bg-white px-10 py-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Flower2 className="h-8 w-8 text-primary-500" />
                <span className="font-serif font-bold text-primary-900 text-xl">
                  Hecho a mano y con propósito
                </span>
              </div>
              <p className="text-primary-700 text-lg leading-relaxed">
                Mi mamá y yo somos quienes diseñamos y elaboramos, pieza por pieza, con nuestras manos y con el alma. Cada creación lleva un pedacito de nosotras: del estilo que nos define, de la historia que nos acompaña y del amor que ponemos en cada detalle. Nada está hecho a máquina, todo está hecho con propósito.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid de bloques informativos */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <HistoryBlock />
          <ThanksBlock />
          <AwardBlock />
        </div>
      </section>

      {/* Cierre tipo carta */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-[80vw] max-w-6xl flex justify-end mt-16 px-0"
      >
        <div className="bg-primary-50 border-l-4 border-primary-300 rounded-r-2xl shadow-lg max-w-xl p-8 ml-auto">
          <p className="font-serif font-bold text-primary-900 text-2xl mb-2">
            Gracias por estar aquí y por ser parte de este camino.
          </p>
          <p className="text-primary-700 text-lg mt-4">
            <span className="block font-serif italic text-primary-800">Con gratitud infinita,</span>
            <span className="block font-serif text-primary-900 text-xl">Grettel</span>
          </p>
        </div>
      </motion.div>

      {/* CTA final */}
      <section className="w-[80vw] max-w-6xl px-0 py-16 flex flex-col md:flex-row items-center justify-between bg-white border-2 border-primary-200 mt-20 rounded-3xl shadow-xl gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex flex-col items-start px-10"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-900 mb-4">
            Cada compra apoya a una familia de mujeres artesanas costarricenses
          </h3>
          <p className="text-primary-700 text-lg mb-6 max-w-xl">
            ¡Descubre la delicadeza y el amor en cada pieza! Tu apoyo impulsa el trabajo, los sueños y la creatividad de mujeres que crean con el corazón.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-4 text-base font-bold shadow bg-primary-900 text-white hover:bg-primary-800 transition-all duration-200"
          >
            <Link to="/tienda">Comprar ahora</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 flex justify-center items-center"
        >
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
            alt="Accesorios Grema"
            className="rounded-2xl shadow-lg w-[320px] h-[220px] object-cover border-2 border-primary-100"
          />
        </motion.div>
      </section>
    </div>
  );
}