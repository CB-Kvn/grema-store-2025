import { useEffect, useState } from "react";
import { BannerForm } from "./BannerForm";
import { BannerTable } from "./BannerTable";
import { bannerService } from "@/services";
import { Banner } from "@/types";

export function BannerTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Cargar banners
  const loadBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bannerService.getAll();
      setBanners(data);
    } catch (err) {
      setError('Error al cargar los banners');
      console.error('Error loading banners:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar o actualizar banner
  const handleAddBanner = async (bannerData: Omit<Banner, 'id'>) => {
    try {
      if (editingBanner) {
        // Actualizar banner existente
        const updatedBanner = await bannerService.update(editingBanner.id, bannerData);
        setBanners(prev => 
          prev.map(b => b.id === editingBanner.id ? updatedBanner : b)
        );
        setEditingBanner(null);
      } else {
        // Crear nuevo banner
        const newBanner = await bannerService.create(bannerData);
        setBanners(prev => [...prev, newBanner]);
      }
    } catch (err) {
      setError(editingBanner ? 'Error al actualizar el banner' : 'Error al crear el banner');
      console.error('Error saving banner:', err);
      throw err; // Re-throw para que el formulario maneje el error
    }
  };

  // Iniciar edición de banner
  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingBanner(null);
  };

  // Eliminar banner
  const handleDeleteBanner = async (id: string) => {
    try {
      await bannerService.delete(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError('Error al eliminar el banner');
      console.error('Error deleting banner:', err);
      throw err; // Re-throw para que la tabla maneje el error
    }
  };

  // Actualizar estado del banner
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updatedBanner = await bannerService.updateStatus(id, status);
      setBanners(prev => 
        prev.map(b => b.id === id ? updatedBanner : b)
      );
    } catch (err) {
      setError('Error al actualizar el estado del banner');
      console.error('Error updating banner status:', err);
      throw err; // Re-throw para que la tabla maneje el error
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  return (
    <div className="space-y-6 bg-primary-10/30 min-h-screen" data-tour="banners-header">
      {/* Mensaje de error global */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6" data-tour="banner-form">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            {editingBanner ? 'Editar Banner' : 'Crear Nuevo Banner'}
          </h3>
          <p className="text-sm text-primary-600">
            {editingBanner ? 'Modifica los datos del banner seleccionado' : 'Completa la información para crear un nuevo banner'}
          </p>
        </div>
        <BannerForm 
        onAdd={handleAddBanner}
        editingBanner={editingBanner}
        onCancelEdit={handleCancelEdit}
        />
      </div>
      
      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100" data-tour="banners-table">
        <div className="p-6 border-b border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">Lista de Banners</h3>
          <p className="text-sm text-primary-600">Gestiona todos los banners del sistema</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <p className="text-primary-600 font-medium">Cargando banners...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <BannerTable 
            banners={banners} 
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}