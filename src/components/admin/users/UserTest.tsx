import React from 'react';
import { useAuth } from '@/hooks/useAuthUser';
import { userService } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, ShoppingCart } from 'lucide-react';

export const UserTest: React.FC = () => {
  const { user, isAuthenticated, loading, error, isAdmin, isBuyer } = useAuth();

  const handleGetUsers = async () => {
    try {
      const users = await userService.getUsers();
      console.log('Users fetched:', users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sistema de Autenticación - Prueba
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Estado de autenticación */}
          <div className="space-y-2">
            <h3 className="font-semibold">Estado de Autenticación:</h3>
            <div className="flex gap-2">
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Autenticado" : "No autenticado"}
              </Badge>
              {loading && (
                <Badge variant="outline">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Cargando...
                </Badge>
              )}
            </div>
          </div>

          {/* Información del usuario */}
          {user && (
            <div className="space-y-2">
              <h3 className="font-semibold">Información del Usuario:</h3>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nombre:</strong> {user.displayName}</p>
                <p><strong>Foto:</strong> {user.photoURL}</p>
                <div className="flex gap-2 items-center">
                  <strong>Tipo:</strong> 
                  <Badge variant={user.typeUser === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.typeUser === 'ADMIN' ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <ShoppingCart className="w-3 h-3 mr-1" />
                    )}
                    {user.typeUser}
                  </Badge>
                </div>
                <p><strong>Código de descuento:</strong> {user.discountCode || 'No asignado'}</p>
                <p><strong>Descuento:</strong> {user.discount || 0}%</p>
                <p><strong>Activo:</strong> {user.isActive ? 'Sí' : 'No'}</p>
              </div>
            </div>
          )}

          {/* Helpers de rol */}
          <div className="space-y-2">
            <h3 className="font-semibold">Helpers de Rol:</h3>
            <div className="flex gap-2">
              <Badge variant={isAdmin ? "default" : "outline"}>
                {isAdmin ? "Es Admin" : "No es Admin"}
              </Badge>
              <Badge variant={isBuyer ? "default" : "outline"}>
                {isBuyer ? "Es Comprador" : "No es Comprador"}
              </Badge>
            </div>
          </div>

          {/* Errores */}
          {error && (
            <div className="space-y-2">
              <h3 className="font-semibold text-red-600">Error:</h3>
              <p className="text-red-500 bg-red-50 p-2 rounded">{error}</p>
            </div>
          )}

          {/* Botón de prueba */}
          <div className="pt-4">
            <Button onClick={handleGetUsers} className="w-full">
              Probar obtener usuarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
