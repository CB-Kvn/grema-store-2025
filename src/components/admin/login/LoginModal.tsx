import React, { useEffect, useState } from "react";
import { Mail, Lock, LogIn, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import LoginGoogle from "@/components/login/components/loginGoogle";
import { useAuth } from "@/hooks/useAuth";


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
            <img
              src="/Logo en negro.png" // Ruta desde la carpeta public
              alt="Logo de la empresa"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-primary-foreground font-serif">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-sans">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary-600" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-sm font-sans"
                  placeholder="Correo electrónico"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-sm font-sans"
                  placeholder="Contraseña"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-destructive font-sans">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 font-sans"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-6">
          <LoginGoogle onClose={onClose}/>
        </div>
        
      </div>
      
    </div>
  );
};

export default LoginModal;