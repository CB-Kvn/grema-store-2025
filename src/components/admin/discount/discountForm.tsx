import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarDays, 
  Percent, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Plus, 
  X, 
  Search,
  Tag,
  Clock,
  CircleDollarSign,
  Edit2
} from "lucide-react";
import { Discount } from "@/types";

const discountTypes = [
  { value: "PERCENTAGE", label: "Porcentaje", icon: Percent },
  { value: "FIXED", label: "Fijo (₡)", icon: CircleDollarSign },
  { value: "BUY_X_GET_Y", label: "Lleva X y paga Y", icon: ShoppingCart },
];

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  sku: string;
  Images: Array<{
    id: number;
    url: string[];
    state: boolean;
    productId: number;
  }>;
}

interface ProductSelectorProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
}

function ProductSelector({ selectedProducts, onProductsChange }: ProductSelectorProps) {
  const products = useSelector((state: any) => state.products?.items || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    if (isSelected) {
      onProductsChange(selectedProducts.filter(p => p.id !== product.id));
    } else {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: number) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <div className="space-y-3">
      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <Badge key={product.id} variant="secondary" className="bg-primary-100 text-primary-800 border-primary-200">
              {product.name}
              <button
                onClick={() => removeProduct(product.id)}
                className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Product Selector Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-primary-200 hover:bg-primary-50">
            <Plus className="h-4 w-4 mr-2" />
            Seleccionar Productos
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-600" />
              Seleccionar Productos
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Products List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No se encontraron productos</p>
                    {searchQuery && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Intenta con otros términos de búsqueda
                      </p>
                    )}
                  </div>
                ) : (
                  filteredProducts.map((product: Product) => {
                    const isSelected = selectedProducts.some(p => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                        }`}
                        onClick={() => handleProductToggle(product)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleProductToggle(product)}
                        />
                        
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.Images?.[0]?.url?.[0] ? (
                            <img
                              src={product.Images[0].url[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-primary-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {product.sku}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Summary */}
            <div className="border-t pt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedProducts.length} productos seleccionados
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Confirmar Selección
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DiscountForm({ 
  onAdd, 
  editingDiscount, 
  onCancelEdit 
}: { 
  onAdd: (discount: Omit<Discount, 'id'>) => void;
  editingDiscount?: Discount | null;
  onCancelEdit?: () => void;
}) {
  const products = useSelector((state: any) => state.products?.items || []);
  const [form, setForm] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    isActive: true,
    minQuantity: "",
    maxQuantity: "",
    selectedProducts: [] as Product[],
  });

  // Cargar datos del descuento cuando se está editando
  useEffect(() => {
    if (editingDiscount) {
      // Buscar los productos seleccionados
      const selectedProducts = editingDiscount.items 
        ? products.filter((p: Product) => editingDiscount.items?.includes(p.id))
        : [];

      setForm({
        type: editingDiscount.type,
        value: editingDiscount.value.toString(),
        startDate: editingDiscount.startDate.split('T')[0], // Extraer solo la fecha
        endDate: editingDiscount.endDate ? editingDiscount.endDate.split('T')[0] : "",
        isActive: editingDiscount.isActive,
        minQuantity: editingDiscount.minQuantity?.toString() || "",
        maxQuantity: editingDiscount.maxQuantity?.toString() || "",
        selectedProducts: selectedProducts,
      });
    }
  }, [editingDiscount, products]);

  // Limpiar formulario cuando se cancela la edición
  useEffect(() => {
    if (!editingDiscount) {
      setForm({
        type: "PERCENTAGE",
        value: "",
        startDate: "",
        endDate: "",
        isActive: true,
        minQuantity: "",
        maxQuantity: "",
        selectedProducts: [],
      });
    }
  }, [editingDiscount]);

  // Format currency for display
  const formatCurrency = (value: string) => {
    if (!value || form.type !== "FIXED") return value;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return numValue.toLocaleString('es-CR');
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      
      // When changing discount type, clear fields that are not needed
      if (field === "type") {
        if (value === "PERCENTAGE") {
          // For percentage discounts, clear quantities and set as active
          newForm.minQuantity = "";
          newForm.maxQuantity = "";
          newForm.isActive = true;
        }
      }
      
      return newForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.value || !form.startDate) return;
    
    // For percentage discounts, require end date
    if (form.type === "PERCENTAGE" && !form.endDate) return;
    
    onAdd({
      type: form.type as 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y',
      value: parseFloat(form.value),
      minQuantity: form.type === "PERCENTAGE" ? undefined : (form.minQuantity ? parseInt(form.minQuantity) : undefined),
      maxQuantity: form.type === "PERCENTAGE" ? undefined : (form.maxQuantity ? parseInt(form.maxQuantity) : undefined),
      items: form.selectedProducts.map(p => p.id),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      isActive: form.type === "PERCENTAGE" ? true : form.isActive, // Always active for percentage discounts
    });
    
    setForm({
      type: "PERCENTAGE",
      value: "",
      startDate: "",
      endDate: "",
      isActive: true,
      minQuantity: "",
      maxQuantity: "",
      selectedProducts: [],
    });
  };

  const selectedDiscountType = discountTypes.find(type => type.value === form.type);
  const IconComponent = selectedDiscountType?.icon || Tag;

  return (
    <Card className="border-primary-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary-900">
          {editingDiscount ? (
            <>
              <Edit2 className="h-5 w-5 text-primary-600" />
              Editar Descuento #{editingDiscount.id}
            </>
          ) : (
            <>
              <Tag className="h-5 w-5 text-primary-600" />
              Crear Nuevo Descuento
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-primary-700">
                Tipo de descuento
              </Label>
              <Select value={form.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger className="border-primary-200 focus:border-primary-500">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {selectedDiscountType?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {discountTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium text-primary-700">
                {form.type === "PERCENTAGE" 
                  ? "Porcentaje de descuento" 
                  : form.type === "FIXED" 
                    ? "Monto de descuento (₡)" 
                    : "Valor del descuento"
                }
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  value={form.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  required
                  placeholder={
                    form.type === "PERCENTAGE" 
                      ? "Ej: 15" 
                      : form.type === "FIXED" 
                        ? "Ej: 5000" 
                        : "Ej: 10"
                  }
                  className="border-primary-200 focus:border-primary-500 pl-8"
                  max={form.type === "PERCENTAGE" ? "100" : undefined}
                  min="0"
                  step={form.type === "FIXED" ? "100" : "1"}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {form.type === "PERCENTAGE" ? (
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  ) : form.type === "FIXED" ? (
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {form.type === "FIXED" && (
                <p className="text-xs text-muted-foreground">
                  Ingrese el monto en colones costarricenses
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-primary-700">
                Fecha de inicio
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                  className="border-primary-200 focus:border-primary-500 pl-8"
                />
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-primary-700">
                {form.type === "PERCENTAGE" ? "Fecha de fin" : "Fecha de fin (opcional)"}
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required={form.type === "PERCENTAGE"}
                  className="border-primary-200 focus:border-primary-500 pl-8"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Fields only for non-percentage discounts */}
            {form.type !== "PERCENTAGE" && (
              <>
                {/* Active Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary-700">Estado</Label>
                  <div className="flex items-center space-x-2 h-9">
                    <Checkbox
                      id="isActive"
                      checked={form.isActive}
                      onCheckedChange={(checked) => handleChange("isActive", checked)}
                    />
                    <Label htmlFor="isActive" className="text-sm text-primary-700">
                      Descuento activo
                    </Label>
                  </div>
                </div>

                {/* Min Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="minQuantity" className="text-sm font-medium text-primary-700">
                    Cantidad mínima
                  </Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={form.minQuantity}
                    onChange={(e) => handleChange("minQuantity", e.target.value)}
                    placeholder="Ej: 1"
                    className="border-primary-200 focus:border-primary-500"
                  />
                </div>

                {/* Max Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="maxQuantity" className="text-sm font-medium text-primary-700">
                    Cantidad máxima
                  </Label>
                  <Input
                    id="maxQuantity"
                    type="number"
                    value={form.maxQuantity}
                    onChange={(e) => handleChange("maxQuantity", e.target.value)}
                    placeholder="Ej: 10"
                    className="border-primary-200 focus:border-primary-500"
                  />
                </div>
              </>
            )}

            {/* Additional fields for FIXED discounts */}
            {form.type === "FIXED" && (
              <div className="col-span-full">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDollarSign className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Descuento Fijo en Colones</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Este descuento restará exactamente ₡{formatCurrency(form.value)} del total de la compra de los productos seleccionados.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Product Selection */}
          <div>
            <ProductSelector
              selectedProducts={form.selectedProducts}
              onProductsChange={(products) => handleChange("selectedProducts", products)}
            />
          </div>

          <Separator className="my-6" />

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            {editingDiscount && onCancelEdit && (
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancelEdit}
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8"
            >
              {editingDiscount ? (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Actualizar Descuento
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Descuento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}