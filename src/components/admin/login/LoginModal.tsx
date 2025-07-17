import React, { useEffect, useState } from "react";
import { Mail, Lock, LogIn, X } from "lucide-react";
import LoginGoogle from "@/components/login/components/loginGoogle";



interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary-foreground"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-64 h-32 mx-auto">
            <picture>
              <source srcSet="/Logo en negro.webp" type="image/webp" />
              <img
                src="/Logo en negro.png" // Ruta desde la carpeta public
                alt="Logo de la empresa"
                className="w-full h-full object-contain"
              />
            </picture>
          </div>

        </div>


        <div className="mt-6">
          <LoginGoogle onClose={onClose}/>
        </div>
        
      </div>
      
    </div>
  );
};

export default LoginModal;