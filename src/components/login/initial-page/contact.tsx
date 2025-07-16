import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";

// TikTok icon component since it's not available in lucide-react
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const ContactPage = () => {
  return (
    <div
      className="min-h-screen"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Hero Section */}
      <div className=" py-11 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary-900 sm:text-5xl">
              Contáctanos
            </h1>
            <p className="mt-4 text-xl text-primary-600">
              Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros
              canales de comunicación.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -m-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary-50 p-8 rounded-lg shadow-md flex flex-col items-center justify-center h-full border border-primary-600">
            <Phone className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2 text-center">
              Teléfono
            </h3>
            <p className="text-primary-600 text-center">+506 6194-1946</p>
          </div>

          <div className="bg-primary-50 p-8 rounded-lg shadow-md flex flex-col items-center justify-center h-full border border-primary-600">
            <MapPin className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2 text-center">
              Dirección
            </h3>
            <p className="text-primary-600 text-center">
              Cóbano, Los Mangos 100 metros norte y 75 metros oeste de la Escuela
              Los Mangos
            </p>
            <p className="text-primary-600 text-center">Puntarenas, Costa Rica</p>
          </div>

          <div className="bg-primary-50 p-8 rounded-lg shadow-md flex flex-col items-center justify-center h-full border border-primary-600">
            <Clock className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2 text-center">
              Horario
            </h3>
            <p className="text-primary-600 text-center">Lun - Sab: 9:00 am - 18:00</p>
            <p className="text-primary-600 text-center">Dom: Cerrado</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="bg-primary-50 p-8 rounded-lg shadow-md border border-primary-600">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
              Nuestro taller se encuentra en:
            </h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.070188151864!2d-85.1186498!3d9.6820249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNDAnNTUuMyJOIDg1wrAwNycwNy4xIlc!5e0!3m2!1sen!2sus!4v1718923456789&zoom=17"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-primary-50 p-8 rounded-lg shadow-md border border-primary-600">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
              Síguenos en redes sociales
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-white hover:bg-primary-100 transition-colors"
              >
                <Facebook className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-primary-900">Facebook</span>
              </a>
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-white hover:bg-primary-100 transition-colors"
              >
                <Instagram className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-primary-900">Instagram</span>
              </a>
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-white hover:bg-primary-100 transition-colors"
              >
                <TikTokIcon />
                <span className="text-primary-900 ml-3">TikTok</span>
              </a>
            </div>
            <div className="mt-8 text-center text-primary-600">
              <p>
                Síguenos para estar al día con nuestras últimas colecciones,
              </p>
              <p>eventos especiales y promociones exclusivas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
