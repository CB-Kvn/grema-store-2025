import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Banner } from '@/types';
import { Edit, Trash2, Eye, Power, PowerOff, Calendar, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function BannerTable({ banners, onEdit, onDelete, onUpdateStatus }: BannerTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Activo', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactivo', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      scheduled: { label: 'Programado', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDateValid = (banner: Banner) => {
    const now = new Date();
    const startDate = new Date(banner.dateInit);
    const endDate = new Date(banner.dateEnd);
    return now >= startDate && now <= endDate;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting banner:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatusId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } catch (error) {
      console.error('Error updating banner status:', error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (banners.length === 0) {
    return (
      <Card className="bg-white shadow-sm border border-primary-100">
        <CardContent className="py-8">
          <div className="text-center text-primary-500">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-50 text-primary-400" />
            <p className="text-lg font-medium text-primary-700">No hay banners creados</p>
            <p className="text-sm text-primary-600">Crea tu primer banner usando el formulario de arriba</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-primary-100">
      <CardHeader className="border-b border-primary-100 bg-primary-50/30">
        <CardTitle className="flex items-center gap-2 text-primary-900">
          <Eye className="h-5 w-5 text-primary-600" />
          Lista de Banners ({banners.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-50">
                <TableHead className="text-primary-700 font-semibold">Imagen</TableHead>
                <TableHead className="text-primary-700 font-semibold">Nombre</TableHead>
                <TableHead className="text-primary-700 font-semibold">Estado</TableHead>
                <TableHead className="text-primary-700 font-semibold">Fecha Inicio</TableHead>
                <TableHead className="text-primary-700 font-semibold">Fecha Fin</TableHead>
                <TableHead className="text-primary-700 font-semibold">Vigencia</TableHead>
                <TableHead className="text-primary-700 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id} className="border-b border-primary-100 hover:bg-primary-25">
                  {/* Imagen */}
                  <TableCell>
                    <div className="w-16 h-10 rounded overflow-hidden border border-primary-200">
                      <img
                        src={banner.imageUrl}
                        alt={banner.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2NCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyOCAyNEwzNiAxNkw0MCAyMFYzMkgyNFYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                  </TableCell>

                  {/* Nombre */}
                  <TableCell className="font-medium">
                    <div className="max-w-[200px] truncate text-primary-900" title={banner.name}>
                      {banner.name}
                    </div>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <div className="flex items-center gap-2" data-tour="banner-status">
                      {getStatusBadge(banner.status)}
                      <Select
                        value={banner.status}
                        onValueChange={(value) => handleStatusChange(banner.id, value)}
                        disabled={updatingStatusId === banner.id}
                      >
                        <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-primary-100">
                          {updatingStatusId === banner.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                          ) : (
                            <Power className="h-4 w-4 text-primary-600" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="scheduled">Programado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  {/* Fecha Inicio */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary-500" />
                      <span className="text-primary-700">{formatDate(banner.dateInit)}</span>
                    </div>
                  </TableCell>

                  {/* Fecha Fin */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary-500" />
                      <span className="text-primary-700">{formatDate(banner.dateEnd)}</span>
                    </div>
                  </TableCell>

                  {/* Vigencia */}
                  <TableCell>
                    {isDateValid(banner) ? (
                      <Badge className="bg-green-100 text-green-800">
                        Vigente
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Expirado
                      </Badge>
                    )}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Editar */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(banner)}
                        className="h-8 w-8 p-0 border-primary-300 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                        title="Editar banner"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Eliminar */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                            title="Eliminar banner"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>¿Eliminar banner?</DialogTitle>
                            <DialogDescription>
                              Esta acción no se puede deshacer. El banner "{banner.name}" será eliminado permanentemente.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50">Cancelar</Button>
                            <Button
                              onClick={() => handleDelete(banner.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={deletingId === banner.id}
                            >
                              {deletingId === banner.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Eliminando...
                                </>
                              ) : (
                                'Eliminar'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}