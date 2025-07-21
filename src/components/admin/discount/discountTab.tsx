
import { useEffect, useState } from "react";
import { DiscountForm } from "./discountForm";
import { DiscountsTable } from "./discountTable";
import { discountService } from "@/services";
import { Discount } from "@/types";

export function DiscountTab() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Cargar descuentos
  const loadDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await discountService.getAll();
      setDiscounts(data as Discount[]);
    } catch (err) {
      setError('Error al cargar los descuentos');
      console.error('Error loading discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nuevo descuento
  const handleAddDiscount = async (discountData: Omit<Discount, 'id'>) => {
    try {
      if (editingDiscount) {
        // Actualizar descuento existente
        const updatedDiscount = await discountService.update(editingDiscount.id.toString(), discountData);
        setDiscounts(prev => 
          prev.map(d => d.id === editingDiscount.id ? updatedDiscount as Discount : d)
        );
        setEditingDiscount(null);
      } else {
        // Crear nuevo descuento
        const newDiscount = await discountService.create(discountData);
        setDiscounts(prev => [...prev, newDiscount as Discount]);
      }
    } catch (err) {
      setError(editingDiscount ? 'Error al actualizar el descuento' : 'Error al crear el descuento');
      console.error('Error saving discount:', err);
    }
  };

  // Iniciar edición de descuento
  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingDiscount(null);
  };

  // Eliminar descuento
  const handleDeleteDiscount = async (id: number) => {
    try {
      await discountService.delete(id.toString());
      setDiscounts(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError('Error al eliminar el descuento');
      console.error('Error deleting discount:', err);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  return (
    <>
      
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando descuentos...</p>
          </div>
        ) : (
          <>
            <DiscountForm 
              onAdd={handleAddDiscount}
              editingDiscount={editingDiscount}
              onCancelEdit={handleCancelEdit}
            />
            <DiscountsTable 
              discounts={discounts} 
              onEdit={handleEditDiscount}
              onDelete={handleDeleteDiscount}
            />
          </>
        )}
    
    </>
  );
}