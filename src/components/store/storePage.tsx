/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/hooks/useAppSelector";
import { Product, Category } from "@/types";
import { selectAllProducts } from "@/store/slices/productsSlice";
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
  const productos = useAppSelector(selectAllProducts);
  const seoData = getPageSEOData('store');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    categories: [],
    materials: [],
    isNew: false,
    isBestSeller: false,
    colors: [], // Ahora es grupo de color
  });

  // Breadcrumbs para la tienda
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/tienda', isActive: true }
  ];

  // Extraer categorías y materiales únicos de los productos
  const categories = Array.from(new Set(productos.map((p) => p.category)));
  const materials = Array.from(
    new Set(
      productos.flatMap((p) =>
        Array.isArray(p.details?.material)
          ? p.details.material
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
      const matchesSearch =
        (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category || '');
      const matchesMaterial =
        filters.materials.length === 0 ||
        (Array.isArray(product.details?.material) 
          ? product.details.material.some((m) => filters.materials.includes(m))
          : product.details?.material 
          ? filters.materials.includes(product.details.material)
          : false);
      const matchesPrice =
        (product.price || 0) >= filters.priceRange[0] &&
        (product.price || 0) <= filters.priceRange[1];
      const matchesNew = !filters.isNew || product.isNew;
      const matchesBestSeller = !filters.isBestSeller || product.isBestSeller;
      const matchesColor =
        filters.colors.length === 0 ||
        (Array.isArray(product.details?.color) &&
          product.details.color.some((c) =>
            filters.colors.includes(getColorGroup(c.hex || '') || "")
          ));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaterial &&
        matchesPrice &&
        matchesNew &&
        matchesBestSeller &&
        matchesColor
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "name-asc":
          return (a.name || '').localeCompare(b.name || '');
        case "name-desc":
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
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
      priceRange: [0, 5000],
      categories: [],
      materials: [],
      isNew: false,
      isBestSeller: false,
      colors: [],
    });
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-medium text-primary-900 mb-3">Rango de Precio</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="5000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange("priceRange", [
                filters.priceRange[0],
                Number(e.target.value),
              ])
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-primary-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-primary-900 mb-3">Categorías</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category || '')}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category || '']
                    : filters.categories.filter((c) => c !== category);
                  handleFilterChange("categories", newCategories);
                }}
                className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-primary-700 capitalize">
                {(category || '').replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h4 className="font-medium text-primary-900 mb-3">Materiales</h4>
        <div className="space-y-2">
          {materials.map((material) => (
            <label key={material} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={(e) => {
                  const newMaterials = e.target.checked
                    ? [...filters.materials, material]
                    : filters.materials.filter((m) => m !== material);
                  handleFilterChange("materials", newMaterials);
                }}
                className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-primary-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-medium text-primary-900 mb-3">Colores</h4>
        <div className="grid grid-cols-2 gap-2">
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
              className={`px-3 py-2 rounded-full border-2 text-sm font-medium
                ${filters.colors.includes(group as string)
                  ? "border-primary-600 bg-primary-100 text-primary-900"
                  : "border-primary-300 bg-white text-primary-600"}
              `}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full bg-primary-50 text-primary-600 px-4 py-2 rounded-full hover:bg-primary-100 transition-colors"
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
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden overflow-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-primary-900">Filtros</h3>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>
        <div className="p-4">
          <FilterContent />
        </div>
      </div>
    </>
  );

  const ProductListView = ({ product }: { product: Product }) => {
    const price = product.price || 0;
    const discountedPrice = product.discount
      ? price * (1 - (product.discount.value || 0) / 100)
      : price;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex gap-6">
        <div className="w-48 h-48">
          <img
            src={product.Images || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-medium text-primary-900">{product.name}</h3>
            <p className="text-primary-600 mt-1">{product.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary-900">
                ₡{discountedPrice.toLocaleString()}
              </span>
              {product.discount && (
                <span className="ml-2 text-sm line-through text-primary-400">
                  ₡{price.toLocaleString()}
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
              <span className="text-sm">SKU: {product.sku}</span>
            </div>
            <div className="flex items-center text-primary-600">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-sm">                {Array.isArray(product.details?.material)
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
  
  return (
    <div className="min-h-screen bg-white">
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
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className="my-2" />
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center">
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden p-2 hover:bg-primary-50 rounded-full"
              >
                <Filter className="h-6 w-6 text-primary-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">
                Filtros
              </h2>
              <FilterContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-primary-600">
                  {filteredProducts.length} productos encontrados
                </span>
              </div>
              <div className="flex items-center gap-4">
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
              filters.isBestSeller) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  {filters.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        handleFilterChange(
                          "categories",
                          filters.categories.filter((c) => c !== category)
                        )
                      }
                      className="flex items-center bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm hover:bg-primary-200"
                    >
                      {category}
                      <X className="h-4 w-4 ml-1" />
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
                      className="flex items-center bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm hover:bg-primary-200"
                    >
                      {material}
                      <X className="h-4 w-4 ml-1" />
                    </button>
                  ))}
                  {/* Mostrar grupos de colores seleccionados */}
                  {filters.colors.map((group) => (
                    <button
                      key={group}
                      onClick={() =>
                        handleFilterChange(
                          "colors",
                          filters.colors.filter((g) => g !== group)
                        )
                      }
                      className="flex items-center px-2 py-1 rounded-full bg-primary-100 hover:bg-primary-200"
                      title={group}
                    >
                      <span className="inline-block w-4 h-4 rounded-full border mr-2 bg-gradient-to-br from-white to-primary-200" />
                      <span className="text-primary-600 text-sm">{group}</span>
                      <X className="h-4 w-4 ml-1 text-primary-600" />
                    </button>
                  ))}
                  {filters.isNew && (
                    <button
                      onClick={() => handleFilterChange("isNew", false)}
                      className="flex items-center bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm hover:bg-primary-200"
                    >
                      Nuevos
                      <X className="h-4 w-4 ml-1" />
                    </button>
                  )}
                  {filters.isBestSeller && (
                    <button
                      onClick={() => handleFilterChange("isBestSeller", false)}
                      className="flex items-center bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm hover:bg-primary-200"
                    >
                      Más Vendidos
                      <X className="h-4 w-4 ml-1" />
                    </button>
                  )}
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
