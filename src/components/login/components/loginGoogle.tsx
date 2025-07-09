import { GoogleLogin } from '@react-oauth/google';
import { authService } from "@/services/authService";
import { useNavigate } from 'react-router-dom';
import { useAuthGoogleContext } from '@/context/ContextAuth';


interface LoginModalProps {
  onClose: () => void;
}

const LoginGoogle: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuthGoogleContext();
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const loginGoogle = await authService.loginGoogle(credentialResponse);
      console.log('Login exitoso con Google', loginGoogle);
      login(loginGoogle.user as any);
      if (loginGoogle.user?.typeUser === "ADMIN") {
        navigate('/admin/inventory');
      } else {
        navigate('/tienda');
      }
      onClose();
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