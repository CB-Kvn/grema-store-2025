import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  Plus
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
  const [discountCodes, setDiscountCodes] = useState<{ [id: string]: string }>({});
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);

  useEffect(() => {
    const types: any = {};
    const codes: any = {};
    
    users.forEach((u: any) => {
      types[u.id] = u.typeUser || 'BUYER';
      codes[u.id] = Array.isArray(u.discounts) ? u.discounts.join(', ') : '';
    });
    
    setUserTypes(types);
    setDiscountCodes(codes);
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
      
      // Actualizar el estado local
      setDiscountCodes((c) => ({ ...c, [currentUserId]: selectedDiscounts.join(', ') }));
      
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
    <Card className="w-full border-primary-100">
      <CardHeader className="bg-primary-50">
        <CardTitle className="flex items-center gap-2 text-primary-900">
          <Users className="h-5 w-5 text-primary-600" />
          Gestión de Usuarios ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          {users.map((u: any) => (
            <Card key={u.id} className="p-4 hover:shadow-md transition-shadow border-primary-100 hover:border-primary-200 mt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary-100">
                    <AvatarImage src={u.avatar} alt={u.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg text-primary-900">{u.name || 'Sin nombre'}</h3>
                      {editingType[u.id] ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={userTypes[u.id]}
                            onValueChange={(value) => handleChangeType(u.id, value as 'BUYER' | 'ADMIN')}
                          >
                            <SelectTrigger className="w-28 h-8 border-primary-200 focus:border-primary-400">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-primary-200">
                              <SelectItem value="BUYER">
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className="h-4 w-4 text-primary-600" />
                                  BUYER
                                </div>
                              </SelectItem>
                              <SelectItem value="ADMIN">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary-600" />
                                  ADMIN
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveType(u.id)} 
                            disabled={loadingType[u.id]}
                            className="h-8 px-2 bg-primary-600 hover:bg-primary-700"
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
                            className="h-8 px-2 border-primary-200 text-primary-600 hover:bg-primary-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={userTypes[u.id] === 'ADMIN' ? 'default' : 'secondary'}
                            className={`flex items-center gap-1 ${
                              userTypes[u.id] === 'ADMIN' 
                                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            }`}
                          >
                            {userTypes[u.id] === 'ADMIN' ? (
                              <Shield className="h-3 w-3" />
                            ) : (
                              <ShoppingCart className="h-3 w-3" />
                            )}
                            {userTypes[u.id]}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditType(u.id)}
                            className="h-8 px-2 text-primary-600 hover:bg-primary-50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-primary-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-primary-400" />
                        {u.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-primary-400" />
                        ID: {u.id}
                      </div>
                      {u.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-primary-400" />
                          {formatDate(u.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4 bg-primary-100" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-900">Códigos de descuento:</span>
                </div>
                
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {discountCodes[u.id] ? (
                      discountCodes[u.id].split(',').map((code, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-primary-200 text-primary-700">
                          {code.trim()}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs text-primary-400 border-primary-200">
                        Sin códigos
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => openDiscountModal(u.id)}
                    disabled={loadingCodes[u.id]}
                    className="h-8 px-2 text-primary-600 hover:bg-primary-50"
                  >
                    {loadingCodes[u.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      
      {/* Modal para seleccionar descuentos */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Descuentos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingDiscounts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <span className="ml-2 text-primary-600">Cargando descuentos...</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableDiscounts.map((discount) => (
                  <div key={discount.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-primary-50">
                    <Checkbox
                      id={discount.id}
                      checked={selectedDiscounts.includes(discount.id.toString())}
                      onCheckedChange={() => handleDiscountToggle(discount.id.toString())}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label htmlFor={discount.id} className="font-medium text-primary-900 cursor-pointer">
                          {discount.name}
                        </label>
                        <Badge variant={discount.isActive ? "default" : "secondary"}>
                          {discount.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge variant="outline">{discount.type}</Badge>
                      </div>
                      <p className="text-sm text-primary-600 mt-1">{discount.description}</p>
                      <div className="flex items-center gap-4 text-xs text-primary-500 mt-2">
                        <span>Valor: {discount.value}{discount.type === 'PERCENTAGE' ? '%' : ''}</span>
                        {discount.minQuantity && <span>Mín: {discount.minQuantity}</span>}
                        {discount.maxQuantity && <span>Máx: {discount.maxQuantity}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-primary-600">
                {selectedDiscounts.length} descuento(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setModalOpen(false)}
                  className="border-primary-200 text-primary-600 hover:bg-primary-50"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveSelectedDiscounts}
                  disabled={loadingCodes[currentUserId]}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {loadingCodes[currentUserId] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}