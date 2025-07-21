import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Expense } from '@/types/expense';

interface ExpenseDetailsViewProps {
  expense: Expense;
  onBack: () => void;
  onEdit: () => void;
}

const ExpenseDetailsView: React.FC<ExpenseDetailsViewProps> = ({
  expense,
  onBack,
  onEdit,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'office':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'marketing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'travel':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'utilities':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'equipment':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary-900">
              Detalle del Gasto
            </h2>
            <p className="text-primary-600">
              Registrado el {format(new Date(expense.date), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getCategoryColor(expense.category)} border text-sm px-3 py-1`}>
            {expense.category}
          </Badge>
          <Button onClick={onEdit} className="bg-primary-600 hover:bg-primary-700">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Información del Gasto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary-600">Descripción</label>
              <p className="text-primary-900 font-medium text-lg">
                {expense.description}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Monto</label>
              <p className="text-primary-900 font-bold text-2xl flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                ${expense.amount.toFixed(2)}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Fecha</label>
              <p className="text-primary-900 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(expense.date), 'dd/MM/yyyy')}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Categoría</label>
              <Badge className={`${getCategoryColor(expense.category)} mt-1`}>
                {expense.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Información de pago y recibo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pago y Documentación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary-600">Método de Pago</label>
              <p className="text-primary-900 flex items-center gap-2 capitalize">
                <CreditCard className="h-4 w-4" />
                {expense.paymentMethod.replace('_', ' ')}
              </p>
            </div>
            
            {expense.receipt && (
              <div>
                <label className="text-sm font-medium text-primary-600">Recibo</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(expense.receipt, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Recibo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = expense.receipt!;
                      link.download = `recibo-${expense.id}.pdf`;
                      link.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-primary-600">ID del Gasto</label>
              <p className="text-primary-900 font-mono text-sm">{expense.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Fechas del Sistema</label>
              <div className="space-y-1 text-sm text-primary-700">
                <p>Creado: {format(new Date(expense.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                <p>Actualizado: {format(new Date(expense.updatedAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles adicionales */}
      {(expense as any).notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
              {(expense as any).notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resumen del periodo */}
      <Card>
        <CardHeader>
          <CardTitle>Contexto del Periodo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600">Mes de este gasto</p>
              <p className="text-lg font-bold text-primary-900">
                {format(new Date(expense.date), 'MMMM yyyy')}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600">Categoría: {expense.category}</p>
              <p className="text-lg font-bold text-secondary-900">
                ${expense.amount.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <p className="text-sm text-accent-600">Método de pago</p>
              <p className="text-lg font-bold text-accent-900 capitalize">
                {expense.paymentMethod.replace('_', ' ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpenseDetailsView;
