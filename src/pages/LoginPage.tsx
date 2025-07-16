import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginGoogle from "@/components/login/components/loginGoogle";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace this with your actual authentication logic
    if (email === "admin@example.com" && password === "password123") {
      navigate("/admin/inventory");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
   
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground font-serif">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-sans">
            Ingresa tus 
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-sans"
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
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-sans"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-muted rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-primary-foreground font-sans"
              >
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-destructive hover:text-destructive-foreground font-sans"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 font-sans"
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-muted-foreground font-sans">
            ¿No tienes una cuenta?{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary-foreground"
            >
              Regístrate
            </a>
          </p>
        </form>
        <LoginGoogle></LoginGoogle>
      </div>
    </div>
  );
};

export default LoginPage;