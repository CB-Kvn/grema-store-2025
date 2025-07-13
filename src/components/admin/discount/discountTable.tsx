import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Percent, 
  CircleDollarSign, 
  ShoppingCart, 
  Calendar,
  Package,
  Tag,
  Trash2
} from "lucide-react";
import { Discount } from "@/types";

// DiscountType puede ser un enum, aquí lo simulamos:
const discountTypes = [
  { value: "PERCENTAGE", label: "Porcentaje", icon: Percent, color: "bg-green-100 text-green-800 border-green-200" },
  { value: "FIXED", label: "Fijo (₡)", icon: CircleDollarSign, color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "BUY_X_GET_Y", label: "Lleva X y paga Y", icon: ShoppingCart, color: "bg-purple-100 text-purple-800 border-purple-200" }
];

export function DiscountsTable({ discounts, onEdit, onDelete }: {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete?: (id: number) => void;
}) {
  const getDiscountTypeInfo = (type: string) => {
    return discountTypes.find(dt => dt.value === type) || discountTypes[0];
  };

  const formatValue = (discount: Discount) => {
    if (discount.type === "PERCENTAGE") {
      return `${discount.value}%`;
    } else if (discount.type === "FIXED") {
      return `₡${Number(discount.value).toLocaleString('es-CR')}`;
    } else {
      return discount.value;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CR');
  };

  return (
    <Card className="border-primary-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary-900">
          <Tag className="h-5 w-5 text-primary-600" />
          Lista de Descuentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-primary-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-50 hover:bg-primary-50">
                <TableHead className="text-primary-700 font-medium">ID</TableHead>
                <TableHead className="text-primary-700 font-medium">Tipo</TableHead>
                <TableHead className="text-primary-700 font-medium">Valor</TableHead>
                <TableHead className="text-primary-700 font-medium">Fecha Inicio</TableHead>
                <TableHead className="text-primary-700 font-medium">Fecha Fin</TableHead>
                <TableHead className="text-primary-700 font-medium">Estado</TableHead>
                <TableHead className="text-primary-700 font-medium">Cant. Mín</TableHead>
                <TableHead className="text-primary-700 font-medium">Cant. Máx</TableHead>
                <TableHead className="text-primary-700 font-medium">Productos</TableHead>
                <TableHead className="text-primary-700 font-medium">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-8 w-8" />
                      <p>No hay descuentos registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((d) => {
                  const typeInfo = getDiscountTypeInfo(d.type);
                  const IconComponent = typeInfo.icon;
                  
                  return (
                    <TableRow key={d.id} className="hover:bg-primary-25">
                      {/* ID */}
                      <TableCell className="font-mono text-sm">
                        #{d.id}
                      </TableCell>

                      {/* Tipo */}
                      <TableCell>
                        <Badge variant="secondary" className={`${typeInfo.color} border`}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {typeInfo.label}
                        </Badge>
                      </TableCell>

                      {/* Valor */}
                      <TableCell>
                        <span className="font-medium">{formatValue(d)}</span>
                      </TableCell>

                      {/* Fecha Inicio */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(d.startDate)}
                        </div>
                      </TableCell>

                      {/* Fecha Fin */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(d.endDate)}
                        </div>
                      </TableCell>

                      {/* Estado */}
                      <TableCell>
                        <Badge variant={d.isActive ? "default" : "secondary"} className={
                          d.isActive 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }>
                          {d.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      {/* Cantidad Mínima */}
                      <TableCell>
                        <span className="text-sm">{d.minQuantity ?? "-"}</span>
                      </TableCell>

                      {/* Cantidad Máxima */}
                      <TableCell>
                        <span className="text-sm">{d.maxQuantity ?? "-"}</span>
                      </TableCell>

                      {/* Productos */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {Array.isArray(d.items) && d.items.length > 0 ? (
                            <Badge variant="outline" className="text-xs">
                              {d.items.length} productos
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Ninguno</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onEdit(d)}
                            className="hover:bg-primary-50 text-primary-600"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          {onDelete && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => onDelete(d.id)}
                              className="hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}