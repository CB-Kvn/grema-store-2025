/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Product, Category } from "@/types";
import { selectAllProducts, setProducts, setLoading, setError, selectLoading, Product as ProductSlice } from "@/store/slices/productsSlice";
import { productService } from "@/services/productService";
import { SEOHead } from "@/components/common/SEOHead";
import { getPageSEOData } from "@/utils/seo";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CategorySEO } from "./CategorySEO";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../product/ProductCard";

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";
type ViewMode = "grid" | "list";

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  materials: string[];
  isNew: boolean;
  isBestSeller: boolean;
  colors: string[]; // Ahora es grupo de color
}

const ITEMS_PER_PAGE = 9;

// Definición de grupos de colores por rango de hue
const COLOR_GROUPS = [
  { name: "Rojo", hueMin: 340, hueMax: 20 },
  { name: "Naranja", hueMin: 21, hueMax: 45 },
  { name: "Amarillo", hueMin: 46, hueMax: 70 },
  { name: "Verde", hueMin: 71, hueMax: 160 },
  { name: "Cyan", hueMin: 161, hueMax: 200 },
  { name: "Azul", hueMin: 201, hueMax: 260 },
  { name: "Violeta", hueMin: 261, hueMax: 320 },
  { name: "Rosa", hueMin: 321, hueMax: 339 },
  { name: "Negro/Gris", isGray: true },
  { name: "Blanco", isWhite: true },
];

function getColorGroup(hex: string): string | null {
  let r = 0, g = 0, b = 0;
  if (!hex) return null;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = (60 * ((g - b) / (max - min)) + 360) % 360;
  } else if (max === g) {
    h = (60 * ((b - r) / (max - min)) + 120) % 360;
  } else if (max === b) {
    h = (60 * ((r - g) / (max - min)) + 240) % 360;
  }

  if (l > 0.95) return "Blanco";
  if (l < 0.15 || (max - min < 0.05 && l < 0.8)) return "Negro/Gris";

  for (const group of COLOR_GROUPS) {
    if (group.isGray && (l < 0.15 || (max - min < 0.05 && l < 0.8))) return group.name;
    if (group.isWhite && l > 0.95) return group.name;
    if (group.hueMin !== undefined && group.hueMax !== undefined) {
      if (group.hueMin > group.hueMax) {
        if (h >= group.hueMin || h <= group.hueMax) return group.name;
      } else {
        if (h >= group.hueMin && h <= group.hueMax) return group.name;
      }
    }
  }
  return null;
}

interface ShopPageProps {
  addToCart: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ addToCart }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productos = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectLoading);
  const seoData = getPageSEOData('store');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 150000],
    categories: [],
    materials: [],
    isNew: false,
    isBestSeller: false,
    colors: [], // Ahora es grupo de color
  });

  // Cargar productos si el estado está vacío
  useEffect(() => {
    const loadProducts = async () => {
      if (productos.length === 0) {
        try {
          dispatch(setLoading(true));
          const productsData = await productService.getAll();
          dispatch(setProducts(productsData as ProductSlice[]));
        } catch (error) {
          console.error('Error al cargar productos:', error);
          dispatch(setError('Error al cargar los productos'));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    loadProducts();
  }, [dispatch, productos.length]);

  // Breadcrumbs para la tienda
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/tienda', isActive: true }
  ];

  // Extraer categorías y materiales únicos de los productos
  const categories = Array.from(new Set(productos.map((p) => p.category).filter(Boolean)));
  const materials = Array.from(
    new Set(
      productos.flatMap((p) =>
        Array.isArray(p.details?.material)
          ? p.details.material.filter(Boolean)
          : p.details?.material
          ? [p.details.material]
          : []
      ).filter(Boolean)
    )
  );

  // Obtener los grupos de color presentes en los productos
  const colorGroupsInProducts = Array.from(
    new Set(
      productos
        .flatMap((p) =>
          Array.isArray(p.details?.color) ? p.details.color : []
        )
        .map((c) => getColorGroup(c.hex || ''))
        .filter(Boolean)
    )
  );

  // Filtrar y ordenar productos
  const filteredProducts = productos
    .filter((product) => {
      // Búsqueda por texto
      const matchesSearch = searchQuery === "" || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filtro por categoría
      const matchesCategory = filters.categories.length === 0 ||
        (product.category && filters.categories.includes(product.category));
      
      // Filtro por material
      const matchesMaterial = filters.materials.length === 0 ||
        (product.details?.material && (
          Array.isArray(product.details.material) 
            ? product.details.material.some((m) => filters.materials.includes(m))
            : filters.materials.includes(product.details.material)
        ));
      
      // Filtro por precio - usar el precio del producto desde WarehouseItem
      let productPrice = 0;
      if ((product as any).WarehouseItem && Array.isArray((product as any).WarehouseItem) && (product as any).WarehouseItem.length > 0) {
        const warehouseItem = (product as any).WarehouseItem[0];
        productPrice = warehouseItem.price || 0;
      } else {
        productPrice = product.price || 0;
      }
      const matchesPrice = productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];
      
      // Filtro por productos nuevos
      const matchesNew = !filters.isNew || product.isNew === true;
      
      // Filtro por más vendidos
      const matchesBestSeller = !filters.isBestSeller || product.isBestSeller === true;
      
      // Filtro por color
      const matchesColor = filters.colors.length === 0 ||
        (product.details?.color && Array.isArray(product.details.color) &&
          product.details.color.some((c) => {
            const colorGroup = getColorGroup(c.hex || '');
            return colorGroup && filters.colors.includes(colorGroup);
          }));

      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice && matchesNew && matchesBestSeller && matchesColor;
    })
    .sort((a, b) => {
      // Obtener precios para ordenamiento desde WarehouseItem
      let priceA = 0;
      let priceB = 0;
      
      if ((a as any).WarehouseItem && Array.isArray((a as any).WarehouseItem) && (a as any).WarehouseItem.length > 0) {
        priceA = (a as any).WarehouseItem[0].price || 0;
      } else {
        priceA = a.price || 0;
      }
      
      if ((b as any).WarehouseItem && Array.isArray((b as any).WarehouseItem) && (b as any).WarehouseItem.length > 0) {
        priceB = (b as any).WarehouseItem[0].price || 0;
      } else {
        priceB = b.price || 0;
      }

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
        case "name-desc":
          return (b.name || '').localeCompare(a.name || '', 'es', { sensitivity: 'base' });
        case "featured":
        default:
          // Ordenar por: productos nuevos primero, luego más vendidos, luego por nombre
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
      }
    });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-full ${
              currentPage === i
                ? "bg-primary-600 text-white"
                : "text-primary-600 hover:bg-primary-50"
            }`}
          >
            {i}
          </button>
        );
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-1 rounded-full text-primary-600 hover:bg-primary-50 disabled:text-primary-300 disabled:hover:bg-transparent"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-full text-primary-600 hover:bg-primary-50 disabled:text-primary-300 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-full text-primary-600 hover:bg-primary-50 disabled:text-primary-300 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-full text-primary-600 hover:bg-primary-50 disabled:text-primary-300 disabled:hover:bg-transparent"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 150000],
      categories: [],
      materials: [],
      isNew: false,
      isBestSeller: false,
      colors: [],
    });
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div className="bg-primary-25 rounded-xl p-4 border border-primary-100">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Rango de Precio
        </h4>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="150000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  filters.priceRange[0],
                  Number(e.target.value),
                ])
              }
              className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(filters.priceRange[1] / 150000) * 100}%, #e5e7eb ${(filters.priceRange[1] / 150000) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="bg-white px-3 py-1 rounded-full border border-primary-200">
              <span className="text-sm font-medium text-primary-700">₡{filters.priceRange[0].toLocaleString()}</span>
            </div>
            <div className="bg-primary-600 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-white">₡{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-primary-25 rounded-xl p-4 border border-primary-100">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Categorías
        </h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center group cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category || '')}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, category || '']
                      : filters.categories.filter((c) => c !== category);
                    handleFilterChange("categories", newCategories);
                  }}
                  className="w-4 h-4 rounded border-2 border-primary-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0"
                />
              </div>
              <span className="ml-3 text-primary-700 capitalize group-hover:text-primary-900 transition-colors font-medium">
                {(category || '').replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="bg-primary-25 rounded-xl p-4 border border-primary-100">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Materiales
        </h4>
        <div className="space-y-3">
          {materials.map((material) => (
            <label key={material} className="flex items-center group cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material)}
                  onChange={(e) => {
                    const newMaterials = e.target.checked
                      ? [...filters.materials, material]
                      : filters.materials.filter((m) => m !== material);
                    handleFilterChange("materials", newMaterials);
                  }}
                  className="w-4 h-4 rounded border-2 border-primary-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0"
                />
              </div>
              <span className="ml-3 text-primary-700 group-hover:text-primary-900 transition-colors font-medium">
                {material}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-primary-25 rounded-xl p-4 border border-primary-100">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Colores
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {colorGroupsInProducts.map((group) => (
            <button
              key={group as string}
              type="button"
              onClick={() => {
                const newGroups = filters.colors.includes(group as string)
                  ? filters.colors.filter((g) => g !== group)
                  : [...filters.colors, group as string];
                handleFilterChange("colors", newGroups);
              }}
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:shadow-md
                ${filters.colors.includes(group as string)
                  ? "border-primary-600 bg-primary-100 text-primary-900 shadow-sm"
                  : "border-primary-200 bg-white text-primary-600 hover:border-primary-300 hover:bg-primary-50"}
              `}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div className="bg-primary-25 rounded-xl p-4 border border-primary-100">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Filtros Especiales
        </h4>
        <div className="space-y-3">
          <label className="flex items-center group cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={(e) => handleFilterChange("isNew", e.target.checked)}
                className="w-4 h-4 rounded border-2 border-primary-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0"
              />
            </div>
            <span className="ml-3 text-primary-700 group-hover:text-primary-900 transition-colors font-medium">
              Productos Nuevos
            </span>
          </label>
          <label className="flex items-center group cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.isBestSeller}
                onChange={(e) => handleFilterChange("isBestSeller", e.target.checked)}
                className="w-4 h-4 rounded border-2 border-primary-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0"
              />
            </div>
            <span className="ml-3 text-primary-700 group-hover:text-primary-900 transition-colors font-medium">
              Más Vendidos
            </span>
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
      >
        Limpiar Filtros
      </button>
    </div>
  );

  const FilterDrawer = () => (
    <>
      {/* Mobile Filter Drawer Backdrop */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterDrawerOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden overflow-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-primary-100 p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary-900">Filtros</h3>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-2 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-primary-600" />
          </button>
        </div>
        <div className="p-6">
          <FilterContent />
        </div>
      </div>
    </>
  );

  const ProductListView = ({ product }: { product: Product }) => {
    // Debug: ver la estructura del producto
    console.log('Product data:', product);
    console.log('Product price:', product.price);
    console.log('Product WarehouseItem:', (product as any).WarehouseItem);
    console.log('Product discount:', product.discount);
    
    // Intentar obtener el precio de diferentes maneras
    const getPrice = () => {
      // Intentar acceder al precio desde WarehouseItem[0].price
      if ((product as any).WarehouseItem && Array.isArray((product as any).WarehouseItem) && (product as any).WarehouseItem.length > 0) {
        const warehouseItem = (product as any).WarehouseItem[0];
        if (warehouseItem.price && warehouseItem.price > 0) return warehouseItem.price;
      }
      
      // Fallback a las propiedades originales
      if (product.price && product.price > 0) return product.price;
      if ((product as any).precio && (product as any).precio > 0) return (product as any).precio;
      if ((product as any).Price && (product as any).Price > 0) return (product as any).Price;
      if ((product as any).cost && (product as any).cost > 0) return (product as any).cost;
      if ((product as any).value && (product as any).value > 0) return (product as any).value;
      
      // Si no encuentra precio, devolver 0
      return 0;
    };
    
    const price = getPrice();
    const discountedPrice = product.discount
      ? price * (1 - (product.discount.value || 0) / 100)
      : price;

    // Obtener la imagen correcta del producto
    const getProductImage = () => {
      // Si Images es un string (URL directa)
      if (typeof product.Images === 'string' && product.Images) {
        return product.Images;
      }
      
      // Si Images es un array y tiene elementos
      if (product.Images && typeof product.Images === 'object') {
        const images = product.Images as any;
        if (Array.isArray(images) && images.length > 0) {
          const firstImage = images[0];
          // Si el primer elemento es un objeto con url
          if (typeof firstImage === 'object' && firstImage?.url) {
            return Array.isArray(firstImage.url) ? firstImage.url[0] : firstImage.url;
          }
          // Si el primer elemento es una URL directa
          if (typeof firstImage === 'string') {
            return firstImage;
          }
        }
      }
      
      // Imagen por defecto - usando una imagen base64 o una alternativa
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM2OC4zNjk2IDQwIDYyLjAxMDkgNDIuNjMzOSA1Ny4zMjIzIDQ3LjMyMjNDNTIuNjMzOSA1Mi4wMTA5IDUwIDU4LjM2OTYgNTAgNjVDNTAgNzEuNjMwNCA1Mi42MzM5IDc3Ljk4OTEgNTcuMzIyMyA4Mi42Nzc3QzYyLjAxMDkgODcuMzY2MSA2OC4zNjk2IDkwIDc1IDkwQzgxLjYzMDQgOTAgODcuOTg5MSA4Ny4zNjYxIDkyLjY3NzcgODIuNjc3N0M5Ny4zNjYxIDc3Ljk4OTEgMTAwIDcxLjYzMDQgMTAwIDY1QzEwMCA1OC4zNjk2IDk3LjM2NjEgNTIuMDEwOSA5Mi42Nzc3IDQ3LjMyMjNDODcuOTg5MSA0Mi42MzM5IDgxLjYzMDQgNDAgNzUgNDBaTTc1IDgwQzcwLjg1NzggODAgNjcuMDY0IDc4LjM2NDEgNjQuMzkzNCA3NS42MDY2QzYxLjcyMjggNzIuODQ5MSA2MCA2OS4wMjEyIDYwIDY1QzYwIDYwLjk3ODggNjEuNzIyOCA1Ny4xNTA5IDY0LjM5MzQgNTQuMzkzNEM2Ny4wNjQgNTEuNjM1OSA3MC44NTc4IDUwIDc1IDUwQzc5LjE0MjIgNTAgODIuOTM2IDUxLjYzNTkgODUuNjA2NiA1NC4zOTM0Qzg4LjI3NzIgNTcuMTUwOSA5MCA2MC45Nzg4IDkwIDY1QzkwIDY5LjAyMTIgODguMjc3MiA3Mi44NDkxIDg1LjYwNjYgNzUuNjA2NkM4Mi45MzYgNzguMzY0MSA3OS4xNDIyIDgwIDc1IDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIwIDExMEgzMFYxMDBMMTAwIDcwTDEyMCAxMTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex gap-6">
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={getProductImage()}
            alt={product.name || 'Producto'}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM2OC4zNjk2IDQwIDYyLjAxMDkgNDIuNjMzOSA1Ny4zMjIzIDQ3LjMyMjNDNTIuNjMzOSA1Mi4wMTA5IDUwIDU4LjM2OTYgNTAgNjVDNTAgNzEuNjMwNCA1Mi42MzM5IDc3Ljk4OTEgNTcuMzIyMyA4Mi42Nzc3QzYyLjAxMDkgODcuMzY2MSA2OC4zNjk2IDkwIDc1IDkwQzgxLjYzMDQgOTAgODcuOTg5MSA4Ny4zNjYxIDkyLjY3NzcgODIuNjc3N0M5Ny4zNjYxIDc3Ljk4OTEgMTAwIDcxLjYzMDQgMTAwIDY1QzEwMCA1OC4zNjk2IDk3LjM2NjEgNTIuMDEwOSA5Mi42Nzc3IDQ3LjMyMjNDODcuOTg5MSA0Mi42MzM5IDgxLjYzMDQgNDAgNzUgNDBaTTc1IDgwQzcwLjg1NzggODAgNjcuMDY0IDc4LjM2NDEgNjQuMzkzNCA3NS42MDY2QzYxLjcyMjggNzIuODQ5MSA2MCA2OS4wMjEyIDYwIDY1QzYwIDYwLjk3ODggNjEuNzIyOCA1Ny4xNTA5IDY0LjM5MzQgNTQuMzkzNEM2Ny4wNjQgNTEuNjM1OSA3MC44NTc4IDUwIDc1IDUwQzc5LjE0MjIgNTAgODIuOTM2IDUxLjYzNTkgODUuNjA2NiA1NC4zOTM0Qzg4LjI3NzIgNTcuMTUwOSA5MCA2MC45Nzg4IDkwIDY1QzkwIDY5LjAyMTIgODguMjc3MiA3Mi44NDkxIDg1LjYwNjYgNzUuNjA2NkM4Mi45MzYgNzguMzY0MSA3OS4xNDIyIDgwIDc1IDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIwIDExMEgzMFYxMDBMMTAwIDcwTDEyMCAxMTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
            }}
          />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-medium text-primary-900">{product.name || 'Producto sin nombre'}</h3>
            <p className="text-primary-600 mt-1">{product.description || 'Sin descripción'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary-900">
                ₡{discountedPrice.toLocaleString()}
              </span>
              {product.discount && discountedPrice !== price && (
                <span className="ml-2 text-sm line-through text-primary-400">
                  ₡{price.toLocaleString()}
                </span>
              )}
              {price === 0 && (
                <span className="ml-2 text-sm text-red-500">
                  (Sin precio definido)
                </span>
              )}
            </div>
            {product.isNew && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Nuevo
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                Más Vendido
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-primary-600">
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-sm">SKU: {product.sku || 'N/A'}</span>
            </div>
            <div className="flex items-center text-primary-600">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {Array.isArray(product.details?.material)
                  ? product.details.material.join(", ")
                  : product.details?.material || "N/A"}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/producto/${product.id}`)}
            className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    );
  };

  // Determinar la categoría actual para SEO
  const currentCategory = filters.categories.length === 1 ? filters.categories[0] : 'all';
  
  // Mostrar loading mientras se cargan los productos
  if (loading && productos.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Cargando productos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-transparent">
      {/* SEO Head */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage={seoData.ogImage}
        type={seoData.type}
      />

      {/* Category SEO específico */}
      <CategorySEO
        category={currentCategory as Category}
        productCount={filteredProducts.length}
        subcategories={categories.filter(Boolean) as string[]}
      />

      {/* Header */}

      {/* Navigation Bar */}
      <nav className="shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className="my-2" />
          
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden relative p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Filter className="h-6 w-6" />
              {(filters.categories.length > 0 || filters.materials.length > 0 || filters.colors.length > 0 || filters.isNew || filters.isBestSeller) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.categories.length + filters.materials.length + filters.colors.length + (filters.isNew ? 1 : 0) + (filters.isBestSeller ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary-900">
                    Filtros
                  </h2>
                  <div className="h-px bg-primary-200 flex-1 ml-4"></div>
                </div>
                
                {/* Product Count */}
                <div className="text-center mb-6">
                  <span className="text-primary-600 font-medium">
                    {filteredProducts.length} de {productos.length} productos
                    {searchQuery && ` para "${searchQuery}"`}
                  </span>
                </div>
                
                <FilterContent />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-4xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-primary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm placeholder-primary-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-primary-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
                <div className="flex items-center gap-2 border border-primary-200 rounded-full p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full ${
                      viewMode === "grid"
                        ? "bg-primary-100 text-primary-600"
                        : "text-primary-400 hover:text-primary-600"
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full ${
                      viewMode === "list"
                        ? "bg-primary-100 text-primary-600"
                        : "text-primary-400 hover:text-primary-600"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 ||
              filters.materials.length > 0 ||
              filters.colors.length > 0 ||
              filters.isNew ||
              filters.isBestSeller ||
              searchQuery !== "") && (
              <div className="mb-6">
                <div className="bg-primary-25 border border-primary-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-primary-900">Filtros Activos</h3>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Limpiar todos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        Búsqueda: "{searchQuery}"
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    )}
                    {filters.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() =>
                          handleFilterChange(
                            "categories",
                            filters.categories.filter((c) => c !== category)
                          )
                        }
                        className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                      >
                        {category}
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    ))}
                    {filters.materials.map((material) => (
                      <button
                        key={material}
                        onClick={() =>
                          handleFilterChange(
                            "materials",
                            filters.materials.filter((m) => m !== material)
                          )
                        }
                        className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                      >
                        {material}
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    ))}
                    {filters.colors.map((group) => (
                      <button
                        key={group}
                        onClick={() =>
                          handleFilterChange(
                            "colors",
                            filters.colors.filter((g) => g !== group)
                          )
                        }
                        className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                      >
                        <span className="inline-block w-3 h-3 rounded-full border mr-1.5 bg-gradient-to-br from-white to-primary-300" />
                        {group}
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    ))}
                    {filters.isNew && (
                      <button
                        onClick={() => handleFilterChange("isNew", false)}
                        className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        Nuevos
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    )}
                    {filters.isBestSeller && (
                      <button
                        onClick={() => handleFilterChange("isBestSeller", false)}
                        className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
                      >
                        Más Vendidos
                        <X className="h-3 w-3 ml-1.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <SlidersHorizontal className="h-12 w-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-primary-600">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addToCart(product)}
                      onClick={() => { navigate(`/producto/${product.id}`); return null; }}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedProducts.map((product) => (
                    <ProductListView key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer />
    </div>
  );
};
