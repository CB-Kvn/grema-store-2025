import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export const Networking = () => {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col space-y-4">
      {/* Botón de Facebook */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#3b5998] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#344e86] transition-colors duration-300"
      >
        <FaFacebook size={24} />
      </a>

      {/* Botón de Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#e4405f] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#d32a4a] transition-colors duration-300"
      >
        <FaInstagram size={24} />
      </a>

      {/* Botón de TikTok */}
      <a
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#000000] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#333333] transition-colors duration-300"
      >
        <FaTiktok size={24} />
      </a>


      {/* Botón de WhatsApp */}
      <a
        href="https://api.whatsapp.com/send?phone=1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1da851] transition-colors duration-300"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
};

