import api from '@/services/api';
import { authService } from '@/services/authService';
import { useEffect, useState } from 'react';


export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Evita múltiples llamados si ya hay un usuario
    const fetchUser = async () => {
      try {
        const response = await authService.authUser() // Asegúrate que esta ruta devuelva los datos del usuario si la cookie es válida
        setUser(response);
      } catch (error) {
        setUser(null); // Por si no hay sesión válida
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // ← se ejecuta solo 1 vez

  return { user, loading };
};