import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Percent,
  Calendar,
  DollarSign,
  Package,
  Gift,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Discount } from '@/types';

interface DiscountListViewProps {
  discounts: Discount[];
  searchQuery: string;
  onViewDetails: (discount: Discount) => void;
  onEdit: (discount: Discount) => void;
  onDelete: (discountId: number) => void;
  onToggleStatus: (discount: Discount) => void;
}

const DiscountListView: React.FC<DiscountListViewProps> = ({
  discounts,
  searchQuery,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FIXED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BUY_X_GET_Y':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="h-3 w-3" />;
      case 'FIXED':
        return <DollarSign className="h-3 w-3" />;
      case 'BUY_X_GET_Y':
        return <Gift className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const isExpired = (endDate?: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const formatDiscountValue = (type: string, value: number) => {
    switch (type) {
      case 'PERCENTAGE':
        return `${value}%`;
      case 'FIXED':
        return `$${value.toFixed(2)}`;
      case 'BUY_X_GET_Y':
        return `${value} artículos`;
      default:
        return value.toString();
    }
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.id?.toString().includes(searchQuery) ||
    discount.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.value?.toString().includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredDiscounts.map((discount) => (
        <motion.div
          key={discount.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full hover:shadow-lg transition-all duration-200 border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-primary-900 flex items-center gap-2">
                    Descuento #{discount.id}
                    {isExpired(discount.endDate) && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Expirado
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-primary-600 mt-1">
                    Desde: {format(new Date(discount.startDate), 'dd/MM/yyyy')}
                  </p>
                  {discount.endDate && (
                    <p className="text-sm text-primary-600">
                      Hasta: {format(new Date(discount.endDate), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>
                <Badge className={`${getTypeColor(discount.type)} border flex items-center gap-1 ml-2`}>
                  {getTypeIcon(discount.type)}
                  {discount.type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary-600">Valor:</span>
                    <span className="font-bold text-lg text-primary-900">
                      {formatDiscountValue(discount.type, discount.value)}
                    </span>
                  </div>
                </div>
                
                {discount.minQuantity && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Package className="h-4 w-4 text-primary-500" />
                    <span>Mín: {discount.minQuantity} unidades</span>
                  </div>
                )}
                
                {discount.maxQuantity && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Package className="h-4 w-4 text-primary-500" />
                    <span>Máx: {discount.maxQuantity} unidades</span>
                  </div>
                )}

                {discount.items && discount.items.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Gift className="h-4 w-4 text-primary-500" />
                    <span>{discount.items.length} productos aplicables</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-primary-600">Estado:</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={discount.isActive}
                      onCheckedChange={() => onToggleStatus(discount)}
                    />
                    <span className={`text-sm font-medium ${discount.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {discount.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(discount)}
                    className="flex-1 h-8"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(discount)}
                    className="flex-1 h-8"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(discount.id)}
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {filteredDiscounts.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Percent className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            No se encontraron descuentos
          </h3>
          <p className="text-primary-600">
            {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Aún no hay descuentos registrados'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscountListView;
