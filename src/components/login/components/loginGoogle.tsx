
import { GoogleLogin } from '@react-oauth/google';
import { authService } from "@/services/authService";
import { useNavigate } from 'react-router-dom';
import { useAuthGoogle } from '@/hooks/useAuthGoogle';


interface LoginModalProps {
  onClose: () => void;
}

const LoginGoogle: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuthGoogle();
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const loginGoogle = await authService.loginGoogle(credentialResponse);
      console.log('Login exitoso con Google', loginGoogle);
      login(loginGoogle.user as any); // Guarda en localStorage y estado global del hook
      // Aquí haces el fetch a /me o rediriges a una página protegida
      navigate('/admin/inventory');
      onClose(); // Cierra el modal después del login exitoso
    } catch (error) {
      console.error('Login con Google falló', error);
    }
  };
  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Falló el login')} />
    </div>
  );
};

export default LoginGoogle;