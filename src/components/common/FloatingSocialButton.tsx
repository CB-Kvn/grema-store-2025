import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Instagram, Facebook, Twitter, Plus, X } from 'lucide-react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <MessageCircle className="w-5 h-5" />,
    href: "https://wa.me/50670707070", // Reemplaza con tu número de WhatsApp
    label: "WhatsApp",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    href: "https://instagram.com/tu-perfil", // Reemplaza con tu Instagram
    label: "Instagram",
    color: "bg-pink-500 hover:bg-pink-600"
  },
  {
    icon: <Facebook className="w-5 h-5" />,
    href: "https://facebook.com/tu-perfil", // Reemplaza con tu Facebook
    label: "Facebook",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    href: "https://twitter.com/tu-perfil", // Reemplaza con tu Twitter
    label: "Twitter",
    color: "bg-sky-500 hover:bg-sky-600"
  }
];

const FloatingSocialButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.2,
      },
    },
  };

  const mainButtonVariants = {
    open: { rotate: 45 },
    closed: { rotate: 0 },
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        className="flex flex-col-reverse items-center gap-3"
      >
        {/* Social Links */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={containerVariants}
              className="flex flex-col-reverse gap-3"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    ${social.color}
                    text-white rounded-full p-3 shadow-lg
                    backdrop-blur-sm
                    transform transition-all duration-200
                    hover:shadow-xl
                    group
                  `}
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                  
                  {/* Tooltip */}
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
                                 bg-gray-900 text-white text-xs px-2 py-1 rounded
                                 opacity-0 group-hover:opacity-100 transition-opacity
                                 whitespace-nowrap pointer-events-none">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          onClick={toggleMenu}
          variants={mainButtonVariants}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}
          whileTap={{ scale: 0.95 }}
          className="
            bg-primary-600 hover:bg-primary-700
            text-white rounded-full p-4 shadow-lg
            backdrop-blur-sm
            transform transition-all duration-300
            hover:shadow-xl
            focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50
          "
          aria-label={isOpen ? "Cerrar menú de redes sociales" : "Abrir menú de redes sociales"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingSocialButton;
