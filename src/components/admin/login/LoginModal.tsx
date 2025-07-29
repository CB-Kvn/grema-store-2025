import React, { useEffect, useState } from "react";
import { IKImage, IKContext } from 'imagekitio-react';
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
            <IKContext urlEndpoint="https://ik.imagekit.io/xj7y5uqcr">
              <IKImage
                path="/tr:w-250,q-80/Logos/Logo_en_negro.png"
                loading="lazy"
                lqip={{ active: true }}
                alt="Logo Grema"
                className="h-12 w-auto object-contain"
              />
            </IKContext>
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