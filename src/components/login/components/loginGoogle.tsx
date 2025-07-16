import { GoogleLogin } from '@react-oauth/google';
import { authService } from "@/services/authService";
import { useNavigate } from 'react-router-dom';
import { useAuthGoogleContext } from '@/context/ContextAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/userSlice';


interface LoginModalProps {
  onClose: () => void;
}

const LoginGoogle: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuthGoogleContext();
  const dispatch = useAppDispatch();
  
  const handleSuccess = async (credentialResponse: any) => {
    try {
      dispatch(loginStart());
      const loginGoogle = await authService.loginGoogle(credentialResponse);
      console.log('Login exitoso con Google', loginGoogle);
      
      // Actualizar el estado de Redux
      dispatch(loginSuccess(loginGoogle.user));
      
      // Mantener el contexto existente para compatibilidad
      login(loginGoogle.user as any);
      
      if (loginGoogle.user?.typeUser === "ADMIN") {
        navigate('/admin/inventory');
      } else {
        navigate('/tienda');
      }
      onClose();
    } catch (error) {
      console.error('Login con Google falló', error);
      dispatch(loginFailure('Error al iniciar sesión con Google'));
    }
  };
  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Falló el login')} />
    </div>
  );
};

export default LoginGoogle;