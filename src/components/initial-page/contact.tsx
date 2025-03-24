
import { 
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram 
} from 'lucide-react';

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
    <div className="min-h-screen bg-primary-50  mt-10">
      {/* Hero Section */}
      <div className=" py-16 sm:py-24 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary-900 sm:text-5xl">
              Contáctanos
            </h1>
            <p className="mt-4 text-xl text-primary-600">
              Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales de comunicación.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -m-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Phone className="h-8 w-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Teléfono</h3>
            <p className="text-primary-600">+506 2222-2222</p>
            <p className="text-primary-600">+506 8888-8888</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Mail className="h-8 w-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Email</h3>
            <p className="text-primary-600">info@joyasdelujo.com</p>
            <p className="text-primary-600">ventas@joyasdelujo.com</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MapPin className="h-8 w-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Dirección</h3>
            <p className="text-primary-600">Avenida Central</p>
            <p className="text-primary-600">San José, Costa Rica</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Clock className="h-8 w-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Horario</h3>
            <p className="text-primary-600">Lun - Vie: 9:00 - 18:00</p>
            <p className="text-primary-600">Sáb: 9:00 - 13:00</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
              Nuestra ubicación
            </h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.650373517218!2d-84.08499184999999!3d9.933517449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e342c50d15c5%3A0xe6746a6a9f11b882!2sSan%20Jos%C3%A9%20Province%2C%20San%20Jos%C3%A9%2C%20Costa%20Rica!5e0!3m2!1sen!2s!4v1635959562000!5m2!1sen!2s"
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
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
              Síguenos en redes sociales
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                <Facebook className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-primary-900">Facebook</span>
              </a>
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                <Instagram className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-primary-900">Instagram</span>
              </a>
              <a
                href="#"
                className="flex items-center p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                <TikTokIcon />
                <span className="text-primary-900 ml-3">TikTok</span>
              </a>
            </div>
            <div className="mt-8 text-center text-primary-600">
              <p>Síguenos para estar al día con nuestras últimas colecciones,</p>
              <p>eventos especiales y promociones exclusivas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;