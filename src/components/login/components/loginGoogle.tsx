
import { GoogleLogin } from '@react-oauth/google';
import { authService } from "@/services/authService";
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
}

const LoginGoogle: React.FC<LoginModalProps>  = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      await authService.loginGoogle(credentialResponse);

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