import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addProduct, updateProduct, setProducts, setProductInventory } from "@/store/slices/productsSlice";
import { productService } from "@/services/productService";
import { warehouseService } from "@/services/warehouseService";
import { addWarehouseItems } from "@/store/slices/warehousesSlice";
import { useProductService } from "@/hooks/useProductService";
import { useGlobalDiscounts } from "@/hooks/useGlobalDiscounts";
import type { Product, WarehouseItem } from "@/types";

export function useProductTab() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [discount, setDiscount] = useState({
    isActive: false,
    type: "PERCENTAGE",
    value: 0,
    startDate: "",
    endDate: "",
    minQuantity: 0,
    maxQuantity: 0,
  });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const { deleteProduct } = useProductService();
  const { fetchGlobalDiscounts } = useGlobalDiscounts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "currentPage") {
        const newPage = parseInt(event.newValue || "1", 10);
        setCurrentPage(newPage);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const getByIdProducts = async (id: number) => {
    const response = await warehouseService.getByIdProducts(id) as WarehouseItem[];
    response.forEach(element => {
      dispatch(addWarehouseItems({ quantity: element.quantity, location: element.location, price: element.price }));
    });
  };

  const handleEdit = (product: Product) => {
    dispatch(setProductInventory(product));
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleInventoryManagement = (product: Product) => {
    getByIdProducts(product.id!);
    setSelectedProduct(product);
    setIsInventoryModalOpen(true);
  };

  const handleSubmit = (product: Product) => {
    if (product.id) {
      dispatch(updateProduct(product));
    } else {
      dispatch(addProduct({ ...product, id: Date.now() }));
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddStock = async (warehouseId: string, productId: number, data: { quantity: number; location: string; price: number }) => {
    await warehouseService.addStock(warehouseId, productId, data);
  };

  const handleInventorySubmit = (data: any) => {
    data.inventory.forEach(element => {
      handleAddStock(element.location, selectedProduct!.id!, { quantity: element.quantity, location: element.location, price: element.price });
    });
    setIsInventoryModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      dispatch(setProducts(products.filter((p) => p.id !== productId)));
    } catch {
      alert("No se pudo eliminar el producto.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getAll() as Product[];
      dispatch(setProducts(response));
      
      // Fetch global discounts when products are loaded
      fetchGlobalDiscounts();
    };
    fetchProducts();
  }, [fetchGlobalDiscounts]);

  return {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    isInventoryModalOpen,
    setIsInventoryModalOpen,
    isDiscountModalOpen,
    setIsDiscountModalOpen,
    selectedProduct,
    setSelectedProduct,
    discount,
    setDiscount,
    filteredProducts,
    setFilteredProducts,
    currentProducts,
    currentPage,
    handlePageChange,
    itemsPerPage,
    handleEdit,
    handleInventoryManagement,
    handleSubmit,
    handleInventorySubmit,
    handleDelete,
    warehouses,
    products,
  };
}