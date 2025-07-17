import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/userService";
import { discountService } from "@/services/discountService";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  ShoppingCart, 
  Edit3, 
  Check, 
  X,
  Tag,
  Users,
  Loader2,
  Plus,
  Search,
  Percent,
  DollarSign,
  Clock
} from "lucide-react";

// Recibe users y funciones de cambio como props
export function UsersTable({ users, onUserTypeChange, onDiscountCodesChange }: {
  users: any[];
  onUserTypeChange?: (id: string, value: 'BUYER' | 'ADMIN') => void;
  onDiscountCodesChange?: (id: string, codes: string[]) => void;
}) {
  const [editingType, setEditingType] = useState<{ [id: string]: boolean }>({});
  const [loadingType, setLoadingType] = useState<{ [id: string]: boolean }>({});
  const [loadingCodes, setLoadingCodes] = useState<{ [id: string]: boolean }>({});
  const [userTypes, setUserTypes] = useState<{ [id: string]: 'BUYER' | 'ADMIN' }>({});
  const [userDiscountsDetails, setUserDiscountsDetails] = useState<{ [id: string]: any[] }>({});
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.id?.toLowerCase().includes(searchLower) ||
      userTypes[user.id]?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const types: any = {};
    const discountsDetails: any = {};
    
    users.forEach((u: any) => {
      types[u.id] = u.typeUser || 'BUYER';
      discountsDetails[u.id] = Array.isArray(u.discounts) ? u.discounts : [];
    });
    
    setUserTypes(types);
    setUserDiscountsDetails(discountsDetails);
  }, [users]);

  // Cargar detalles completos de los descuentos
  const loadDiscountDetails = async () => {
    try {
      const discounts = await discountService.getAll();
      setAvailableDiscounts(discounts);
      
      // Actualizar detalles de descuentos para cada usuario
      const updatedDetails: any = {};
      users.forEach((user) => {
        if (user.discounts && Array.isArray(user.discounts)) {
          updatedDetails[user.id] = user.discounts.map((discountId: string) => {
            const discountDetail = discounts.find((d: any) => d.id.toString() === discountId);
            return discountDetail || { id: discountId, name: 'Descuento no encontrado', type: 'UNKNOWN' };
          });
        } else {
          updatedDetails[user.id] = [];
        }
      });
      setUserDiscountsDetails(updatedDetails);
    } catch (error) {
      console.error('Error al cargar detalles de descuentos:', error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      loadDiscountDetails();
    }
  }, [users]);

  // Cargar descuentos disponibles
  const loadAvailableDiscounts = async () => {
    setLoadingDiscounts(true);
    try {
      const discounts = await discountService.getAll();
      setAvailableDiscounts(discounts);
    } catch (error) {
      console.error('Error al cargar descuentos:', error);
    } finally {
      setLoadingDiscounts(false);
    }
  };

  // Abrir modal para seleccionar descuentos
  const openDiscountModal = (userId: string) => {
    setCurrentUserId(userId);
    const userCurrentDiscounts = users.find(u => u.id === userId)?.discounts || [];
    setSelectedDiscounts(userCurrentDiscounts);
    setModalOpen(true);
    loadAvailableDiscounts();
  };

  // Guardar descuentos seleccionados
  const saveSelectedDiscounts = async () => {
    if (!currentUserId) return;
    
    try {
      setLoadingCodes((l) => ({ ...l, [currentUserId]: true }));
      
      // Actualizar usando el nuevo endpoint
      await userService.updateGoogleUser(currentUserId, {
        discounts: selectedDiscounts
      });
      
      // Actualizar detalles de descuentos
      const updatedDetails = selectedDiscounts.map((discountId) => {
        return availableDiscounts.find((d) => d.id.toString() === discountId) || 
               { id: discountId, name: 'Descuento no encontrado', type: 'UNKNOWN' };
      });
      setUserDiscountsDetails((prev) => ({ ...prev, [currentUserId]: updatedDetails }));
      
      // Llamar la función de callback para actualizar el estado del componente padre
      if (onDiscountCodesChange) {
        onDiscountCodesChange(currentUserId, selectedDiscounts);
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar códigos de descuento:', error);
    } finally {
      setLoadingCodes((l) => ({ ...l, [currentUserId]: false }));
    }
  };

  // Manejar selección de descuentos
  const handleDiscountToggle = (discountId: string) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountId) 
        ? prev.filter(id => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handleEditType = (id: string) => setEditingType((e) => ({ ...e, [id]: true }));
  const handleSaveType = async (id: string) => {
    try {
      setLoadingType((l) => ({ ...l, [id]: true }));
      setEditingType((e) => ({ ...e, [id]: false }));
      
      // Actualizar usando el nuevo endpoint
      await userService.updateGoogleUser(id, {
        typeUser: userTypes[id]
      });
      
      // Llamar la función de callback para actualizar el estado del componente padre
      if (onUserTypeChange) {
        onUserTypeChange(id, userTypes[id]);
      }
    } catch (error) {
      console.error('Error al actualizar tipo de usuario:', error);
      // Restaurar estado en caso de error
      setEditingType((e) => ({ ...e, [id]: true }));
    } finally {
      setLoadingType((l) => ({ ...l, [id]: false }));
    }
  };
  const handleCancelType = (id: string) => {
    setEditingType((e) => ({ ...e, [id]: false }));
    // Restaurar valor original
    setUserTypes((t) => ({ ...t, [id]: users.find(u => u.id === id)?.typeUser || 'BUYER' }));
  };
  const handleChangeType = (id: string, value: 'BUYER' | 'ADMIN') =>
    setUserTypes((t) => ({ ...t, [id]: value }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full border-primary-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
          <CardTitle className="flex items-center gap-3 text-primary-900">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-xl font-semibold">Gestión de Usuarios</span>
              <Badge variant="secondary" className="w-fit bg-primary-100 text-primary-700 font-medium">
                {filteredUsers.length} de {users.length} usuario{users.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardTitle>
          
          {/* Barra de búsqueda */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
            <Input
              placeholder="Buscar por nombre, email, ID o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-primary-200 focus:border-primary-400 focus:ring-primary-200 bg-white"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-primary-400 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No hay usuarios registrados</h3>
            <p className="text-primary-600 mb-6 max-w-md mx-auto">
              Cuando los usuarios se registren en tu tienda, aparecerán aquí y podrás gestionar sus permisos y códigos de descuento.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-primary-700">
                <strong>Tip:</strong> Los usuarios se crean automáticamente cuando se registran o inician sesión por primera vez.
              </p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-primary-600 mb-6 max-w-md mx-auto">
              No hay usuarios que coincidan con tu búsqueda "<strong>{searchTerm}</strong>".
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="border-primary-200 text-primary-600 hover:bg-primary-50"
            >
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((u: any) => (
            <Card key={u.id} className="overflow-hidden border-primary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-primary-25">
              {/* Header del usuario */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Avatar y información básica */}
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-primary-200 shadow-sm">
                      <AvatarImage src={u.avatar} alt={u.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-semibold text-lg">
                        {u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="font-semibold text-lg sm:text-xl text-primary-900 truncate">
                          {u.name || 'Sin nombre'}
                        </h3>
                        
                        {/* Controles de tipo de usuario */}
                        {editingType[u.id] ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Select
                              value={userTypes[u.id]}
                              onValueChange={(value) => handleChangeType(u.id, value as 'BUYER' | 'ADMIN')}
                            >
                              <SelectTrigger className="w-32 h-9 border-primary-200 focus:border-primary-400 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-primary-200">
                                <SelectItem value="BUYER">
                                  <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-primary-600" />
                                    Comprador
                                  </div>
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary-600" />
                                    Administrador
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveType(u.id)} 
                                disabled={loadingType[u.id]}
                                className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                              >
                                {loadingType[u.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleCancelType(u.id)} 
                                disabled={loadingType[u.id]}
                                className="h-9 px-3 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={userTypes[u.id] === 'ADMIN' ? 'default' : 'secondary'}
                              className={`flex items-center gap-1 px-3 py-1 font-medium ${
                                userTypes[u.id] === 'ADMIN' 
                                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800' 
                                  : 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 hover:from-primary-200 hover:to-primary-300'
                              }`}
                            >
                              {userTypes[u.id] === 'ADMIN' ? (
                                <Shield className="h-3 w-3" />
                              ) : (
                                <ShoppingCart className="h-3 w-3" />
                              )}
                              {userTypes[u.id] === 'ADMIN' ? 'Administrador' : 'Comprador'}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditType(u.id)}
                              className="h-8 px-2 text-primary-600 hover:bg-primary-100 hover:text-primary-700"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Información del usuario */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 text-sm">
                        <div className="flex items-center gap-2 text-primary-600 bg-primary-50 rounded-lg px-3 py-2 min-w-0">
                          <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                          <span className="truncate text-xs sm:text-sm">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-600 bg-primary-50 rounded-lg px-3 py-2 min-w-0">
                          <User className="h-4 w-4 text-primary-500 flex-shrink-0" />
                          <span className="truncate text-xs sm:text-sm">ID: {u.id}</span>
                        </div>
                        {u.createdAt && (
                          <div className="flex items-center gap-2 text-primary-600 bg-primary-50 rounded-lg px-3 py-2 md:col-span-2 xl:col-span-1 min-w-0">
                            <Calendar className="h-4 w-4 text-primary-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Registro: {formatDate(u.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-5 bg-primary-200" />
                
                {/* Sección de códigos de descuento */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary-100 rounded-md">
                      <Tag className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-primary-900">Códigos de descuento asignados</span>
                    {userDiscountsDetails[u.id] && userDiscountsDetails[u.id].length > 0 && (
                      <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
                        {userDiscountsDetails[u.id].length} activo{userDiscountsDetails[u.id].length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Lista detallada de descuentos */}
                  {userDiscountsDetails[u.id] && userDiscountsDetails[u.id].length > 0 ? (
                    <div className="space-y-3">
                      {userDiscountsDetails[u.id].map((discount: any, index: number) => (
                        <div key={index} className="bg-gradient-to-r from-primary-25 to-primary-50 border border-primary-200 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">

                                <div className="flex gap-1.5">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      discount.isActive !== false 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}
                                  >
                                    {discount.isActive !== false ? 'Activo' : 'Inactivo'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-primary-50 text-primary-700 border-primary-200">
                                    {discount.type === 'PERCENTAGE' ? (
                                      <div className="flex items-center gap-1">
                                        <Percent className="h-3 w-3" />
                                        Porcentaje
                                      </div>
                                    ) : discount.type === 'FIXED_AMOUNT' ? (
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Monto fijo
                                      </div>
                                    ) : discount.type === 'BUY_X_GET_Y' ? (
                                      <div className="flex items-center gap-1">
                                        <ShoppingCart className="h-3 w-3" />
                                        Compra X Lleva Y
                                      </div>
                                    ) : (
                                      'Tipo desconocido'
                                    )}
                                  </Badge>
                                </div>
                              </div>
                              
                              {discount.description && (
                                <p className="text-sm text-primary-600 mb-2 bg-white/60 rounded px-2 py-1 border border-primary-100">
                                  {discount.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-2 text-xs">
                                {/* Para tipo BUY_X_GET_Y solo mostrar cantidades */}
                                {discount.type === 'BUY_X_GET_Y' ? (
                                  <>
                                    {discount.minQuantity && (
                                      <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1 border border-blue-200 text-blue-700">
                                        <span className="font-medium">Compra mín:</span>
                                        <span className="font-semibold">{discount.minQuantity}</span>
                                      </div>
                                    )}
                                    
                                    {discount.maxQuantity && (
                                      <div className="flex items-center gap-1 bg-orange-50 rounded-full px-2 py-1 border border-orange-200 text-orange-700">
                                        <span className="font-medium">Recibe máx:</span>
                                        <span className="font-semibold">{discount.maxQuantity}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1 bg-primary-50 rounded-full px-2 py-1 border border-primary-200 text-primary-600">
                                      <span className="font-medium">ID:</span>
                                      <span className="font-semibold">{discount.id}</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Para otros tipos mostrar valor y demás información */}
                                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border border-primary-200">
                                      <span className="font-medium text-primary-700">Valor:</span>
                                      <span className="text-primary-900 font-semibold">
                                        {discount.value || 'N/A'}{discount.type === 'PERCENTAGE' ? '%' : ''}
                                      </span>
                                    </div>
                                    
                                    {discount.minQuantity && (
                                      <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1 border border-blue-200 text-blue-700">
                                        <span className="font-medium">Mín:</span>
                                        <span className="font-semibold">{discount.minQuantity}</span>
                                      </div>
                                    )}
                                    
                                    {discount.maxQuantity && (
                                      <div className="flex items-center gap-1 bg-orange-50 rounded-full px-2 py-1 border border-orange-200 text-orange-700">
                                        <span className="font-medium">Máx:</span>
                                        <span className="font-semibold">{discount.maxQuantity}</span>
                                      </div>
                                    )}
                                    
                                    {discount.createdAt && (
                                      <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 border border-gray-200 text-gray-600">
                                        <Clock className="h-3 w-3" />
                                        <span className="font-medium">Creado:</span>
                                        <span className="font-semibold">{formatDate(discount.createdAt)}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1 bg-primary-50 rounded-full px-2 py-1 border border-primary-200 text-primary-600">
                                      <span className="font-medium">ID:</span>
                                      <span className="font-semibold">{discount.id}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <Tag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Sin códigos asignados</p>
                      <p className="text-xs text-gray-500 mt-1">Este usuario no tiene descuentos activos</p>
                    </div>
                  )}
                  
                  {/* Botón para gestionar códigos */}
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => openDiscountModal(u.id)}
                      disabled={loadingCodes[u.id]}
                      className="h-9 px-3 sm:px-4 text-primary-600 hover:bg-primary-100 border border-primary-200 hover:border-primary-300 bg-white hover:text-primary-700 font-medium transition-all duration-200"
                    >
                      {loadingCodes[u.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      <span className="hidden sm:inline">Gestionar códigos</span>
                      <span className="sm:hidden">Gestionar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}
      </CardContent>
      
      {/* Modal para seleccionar descuentos */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-primary-200 pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-primary-900">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Tag className="h-5 w-5 text-primary-600" />
              </div>
              Gestionar Códigos de Descuento
            </DialogTitle>
            <p className="text-sm text-primary-600 mt-2">
              Selecciona los códigos de descuento que deseas asignar al usuario
            </p>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {loadingDiscounts ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                  <span className="text-lg text-primary-600 font-medium">Cargando descuentos...</span>
                  <p className="text-sm text-primary-500 mt-1">Por favor espera un momento</p>
                </div>
              </div>
            ) : (
              <>
                {/* Resumen de selección */}
                <div className="bg-primary-50 rounded-lg p-4 mb-4 border border-primary-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary-600 text-white font-medium">
                        {selectedDiscounts.length}
                      </Badge>
                      <span className="text-sm font-medium text-primary-900">
                        descuento{selectedDiscounts.length !== 1 ? 's' : ''} seleccionado{selectedDiscounts.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-primary-600">
                      Total disponibles: {availableDiscounts.length}
                    </div>
                  </div>
                </div>

                {/* Lista de descuentos */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {availableDiscounts.length === 0 ? (
                    <div className="text-center py-12">
                      <Tag className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-primary-900 mb-2">No hay descuentos disponibles</h3>
                      <p className="text-sm text-primary-600">Crea algunos descuentos primero para poder asignarlos a los usuarios.</p>
                    </div>
                  ) : (
                    availableDiscounts.map((discount) => (
                      <div key={discount.id} className="group">
                        <div className={`flex items-start space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md ${
                          selectedDiscounts.includes(discount.id.toString()) 
                            ? 'border-primary-300 bg-primary-50 shadow-sm' 
                            : 'border-primary-100 bg-white hover:border-primary-200 hover:bg-primary-25'
                        }`}>
                          <Checkbox
                            id={discount.id}
                            checked={selectedDiscounts.includes(discount.id.toString())}
                            onCheckedChange={() => handleDiscountToggle(discount.id.toString())}
                            className="mt-1 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                              <div className="flex items-center gap-3">
                                <label htmlFor={discount.id} className="font-semibold text-primary-900 cursor-pointer text-lg">
                                  {discount.name}
                                </label>
                                <div className="flex gap-2">
                                  <Badge variant={discount.isActive ? "default" : "secondary"} className={
                                    discount.isActive 
                                      ? "bg-green-100 text-green-800 border-green-200" 
                                      : "bg-gray-100 text-gray-600 border-gray-200"
                                  }>
                                    {discount.isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                  <Badge variant="outline" className="border-primary-200 text-primary-700 bg-primary-50 font-medium">
                                    {discount.type === 'PERCENTAGE' ? 'Porcentaje' : 
                                     discount.type === 'FIXED_AMOUNT' ? 'Monto fijo' : 
                                     discount.type === 'BUY_X_GET_Y' ? 'Compra X Lleva Y' : 'Desconocido'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                {discount.type === 'BUY_X_GET_Y' ? (
                                  <div>
                                    <div className="text-lg font-bold text-primary-600">
                                      Compra X
                                    </div>
                                    <div className="text-xs text-primary-500">Lleva Y</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-2xl font-bold text-primary-600">
                                      {discount.value}{discount.type === 'PERCENTAGE' ? '%' : ''}
                                    </div>
                                    <div className="text-xs text-primary-500">descuento</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {discount.description && (
                              <p className="text-sm text-primary-600 mb-3 bg-primary-25 rounded-lg p-3 border border-primary-100">
                                {discount.description}
                              </p>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {discount.minQuantity && (
                                <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 rounded-lg px-3 py-2 border border-blue-200">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="font-medium">
                                    {discount.type === 'BUY_X_GET_Y' ? 'Compra mín:' : 'Mín:'} {discount.minQuantity}
                                  </span>
                                </div>
                              )}
                              {discount.maxQuantity && (
                                <div className="flex items-center gap-2 text-xs bg-orange-50 text-orange-700 rounded-lg px-3 py-2 border border-orange-200">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="font-medium">
                                    {discount.type === 'BUY_X_GET_Y' ? 'Recibe máx:' : 'Máx:'} {discount.maxQuantity}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs bg-primary-50 text-primary-700 rounded-lg px-3 py-2 border border-primary-200">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span className="font-medium">ID: {discount.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Footer del modal */}
          <div className="border-t border-primary-200 pt-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="text-sm text-primary-600 order-2 sm:order-1">
                <span className="font-medium">{selectedDiscounts.length}</span> de <span className="font-medium">{availableDiscounts.length}</span> descuentos seleccionados
              </div>
              <div className="flex gap-3 order-1 sm:order-2">
                <Button 
                  variant="outline" 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 sm:flex-none border-primary-200 text-primary-600 hover:bg-primary-50 font-medium"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveSelectedDiscounts}
                  disabled={loadingCodes[currentUserId]}
                  className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 font-medium"
                >
                  {loadingCodes[currentUserId] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}