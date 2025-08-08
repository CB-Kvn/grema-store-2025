import React, { useState } from "react";
import { IKImage, IKContext } from 'imagekitio-react';
import { Mail, Lock, LogIn, X, UserPlus } from "lucide-react";
import LoginGoogle from "@/components/login/components/loginGoogle";
import { authService } from "@/services/authService";
import { useNavigate } from 'react-router-dom';
import { useAuthGoogleContext } from '@/context/ContextAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/userSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/Alert";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthGoogleContext();
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      dispatch(loginStart());
      const response = await authService.login(email, password);
      
      // Actualizar el estado de Redux
      dispatch(loginSuccess(response.data.user));
      
      // Mantener el contexto existente para compatibilidad
      login(response.data.user);
      
      if (response.data.user?.typeUser === "ADMIN") {
        navigate('/admin/inventory');
      } else {
        navigate('/tienda');
      }
      onClose();
    } catch (error: any) {
      console.error('Login con email falló', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      dispatch(loginFailure('Error al iniciar sesión'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await authService.register({
        email,
        password,
        name
      });
      
      // Cambiar a la vista de login después del registro exitoso
      setIsLogin(true);
      setError("");
      // Mensaje de éxito
      alert("Registro exitoso. Por favor inicia sesión.");
    } catch (error: any) {
      console.error('Registro falló', error);
      setError(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full border border-primary-200 shadow-lg relative bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-2 relative bg-gradient-to-r from-primary-50 to-white">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50"
        >
          <X className="h-5 w-5" />
        </Button> */}
        
        <div className="flex justify-center mb-2">
          <div className="w-48 h-24">
            <IKContext urlEndpoint="https://ik.imagekit.io/xj7y5uqcr">
              <IKImage
                path="/tr:w-250,q-80/Logos/Logo_en_negro.png"
                loading="lazy"
                lqip={{ active: true }}
                alt="Logo Grema"
                className="h-16 w-auto object-contain"
              />
            </IKContext>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <Tabs defaultValue={isLogin ? "login" : "register"} className="w-full" onValueChange={(value) => setIsLogin(value === "login")}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary-100/50 p-1 rounded-lg">
            <TabsTrigger value="login" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm transition-all duration-200">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm transition-all duration-200">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border border-red-200 text-red-800 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-primary-800">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-primary-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-primary-200 focus-visible:ring-primary-400 focus-visible:border-primary-400 transition-all duration-200 hover:border-primary-300"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-primary-800">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-primary-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-primary-200 focus-visible:ring-primary-400 focus-visible:border-primary-400 transition-all duration-200 hover:border-primary-300"
                    placeholder="********"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white mt-2 transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]"
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-primary-800">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-4 w-4 text-primary-500" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 border-primary-200 focus-visible:ring-primary-400 focus-visible:border-primary-400 transition-all duration-200 hover:border-primary-300"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-email" className="block text-sm font-medium text-primary-800">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-primary-500" />
                  </div>
                  <Input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-primary-200 focus-visible:ring-primary-400 focus-visible:border-primary-400"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="block text-sm font-medium text-primary-800">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-primary-500" />
                  </div>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-primary-200 focus-visible:ring-primary-400 focus-visible:border-primary-400"
                    placeholder="********"
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white mt-2 transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]"
              >
                {loading ? 'Cargando...' : 'Registrarse'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-primary-600 font-medium">O continúa con</span>
          </div>
        </div>

        <div className="mt-6 transition-all duration-300 hover:opacity-95">
          <LoginGoogle onClose={onClose}/>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginModal;