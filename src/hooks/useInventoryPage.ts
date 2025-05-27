import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setWarehouse } from "@/store/slices/warehousesSlice";
import { warehouseService } from "@/services/warehouseService";
import { Warehouse } from "@/types/warehouse";

export function useInventoryPage() {
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await warehouseService.getAll();
        dispatch(setWarehouse(response as Warehouse[]));
      } catch (error) {
        console.error('Error al obtener los almacenes:', error);
      }
    };

    fetchWarehouses();
  }, [dispatch]);

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };
}