import { useState, useMemo, useEffect } from "react";
import { discountService } from "@/services";
import { Discount } from "@/types";

export type ViewMode = 'list' | 'details' | 'edit' | 'create';

export function useDiscountsTab() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  useEffect(() => {
    loadDiscounts();
  }, []);

  // Filtrar descuentos
  const filteredDiscounts = useMemo(() => {
    return discounts.filter(discount => {
      const matchesSearch = 
        discount.id?.toString().includes(searchQuery) ||
        discount.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discount.value?.toString().includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && discount.isActive) ||
        (statusFilter === 'inactive' && !discount.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchQuery, statusFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const activeDiscounts = discounts.filter(d => d.isActive).length;
    const expiredDiscounts = discounts.filter(d => {
      if (!d.endDate) return false;
      return new Date(d.endDate) < new Date();
    }).length;

    return {
      totalDiscounts: discounts.length,
      activeDiscounts,
      expiredDiscounts,
      totalDiscountValue: discounts.reduce((sum, d) => sum + (d.value || 0), 0),
      averageDiscount: discounts.length > 0 
        ? discounts.reduce((sum, d) => sum + (d.value || 0), 0) / discounts.length 
        : 0
    };
  }, [discounts]);

  // Navegación inline
  const handleViewDetails = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewMode('details');
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setViewMode('edit');
  };

  const handleCreateDiscount = () => {
    setSelectedDiscount(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDiscount(null);
  };

  // Gestión de descuentos
  const handleSubmit = async (discountData: Omit<Discount, 'id'>) => {
    try {
      if (viewMode === 'edit' && selectedDiscount) {
        const updatedDiscount = await discountService.update(
          selectedDiscount.id.toString(), 
          discountData
        );
        setDiscounts(prev => 
          prev.map(d => d.id === selectedDiscount.id ? updatedDiscount as Discount : d)
        );
      } else {
        const newDiscount = await discountService.create(discountData);
        setDiscounts(prev => [...prev, newDiscount as Discount]);
      }
      handleBackToList();
    } catch (error) {
      console.error('Error saving discount:', error);
      setError(viewMode === 'edit' ? 'Error al actualizar el descuento' : 'Error al crear el descuento');
    }
  };

  const handleDeleteDiscount = async (discountId: number) => {
    try {
      await discountService.delete(discountId.toString());
      setDiscounts(prev => prev.filter(d => d.id !== discountId));
      if (selectedDiscount && selectedDiscount.id === discountId) {
        handleBackToList();
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      setError('Error al eliminar el descuento');
    }
  };

  const handleToggleStatus = async (discount: Discount) => {
    try {
      const updatedData = { ...discount, isActive: !discount.isActive };
      const updatedDiscount = await discountService.update(
        discount.id.toString(),
        updatedData
      );
      setDiscounts(prev => 
        prev.map(d => d.id === discount.id ? updatedDiscount as Discount : d)
      );
    } catch (error) {
      console.error('Error toggling discount status:', error);
      setError('Error al cambiar el estado del descuento');
    }
  };

  return {
    // Data
    discounts: filteredDiscounts,
    allDiscounts: discounts,
    loading,
    error,
    stats,
    
    // UI State
    searchQuery,
    setSearchQuery,
    selectedDiscount,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    
    // Actions
    handleViewDetails,
    handleEditDiscount,
    handleCreateDiscount,
    handleBackToList,
    handleSubmit,
    handleDeleteDiscount,
    handleToggleStatus,
    loadDiscounts,
  };
}
