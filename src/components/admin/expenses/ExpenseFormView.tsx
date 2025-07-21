import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save,
  Receipt,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Upload
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseFormViewProps {
  expense?: Expense | null;
  onBack: () => void;
  onSave: (expenseData: Partial<Expense>) => void;
}

const ExpenseFormView: React.FC<ExpenseFormViewProps> = ({
  expense,
  onBack,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'OTHER',
    paymentMethod: 'credit_card',
    receipt: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: expense.description || '',
        amount: expense.amount || 0,
        category: expense.category || 'OTHER',
        paymentMethod: expense.paymentMethod || 'credit_card',
        receipt: expense.receipt || '',
        notes: expense.notes || '',
      });
    }
  }, [expense]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
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
              {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
            </h2>
            <p className="text-primary-600">
              {expense ? `Modificando gasto "${expense.description}"` : 'Registrar un nuevo gasto'}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="description">Descripción *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el gasto..."
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Monto *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <Label htmlFor="date">Fecha *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MATERIALS">Materiales</SelectItem>
                    <SelectItem value="TOOLS">Herramientas</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="SALARIES">Salarios</SelectItem>
                    <SelectItem value="RENT">Alquiler</SelectItem>
                    <SelectItem value="SERVICES">Servicios</SelectItem>
                    <SelectItem value="OTHER">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                    <SelectItem value="check">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="receipt">URL del Recibo</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                  <Input
                    id="receipt"
                    value={formData.receipt}
                    onChange={(e) => handleInputChange('receipt', e.target.value)}
                    placeholder="https://..."
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-primary-600 mt-1">
                  URL del recibo digital o comprobante
                </p>
              </div>

              {/* Sección de carga de archivo (placeholder) */}
              <div className="border-2 border-dashed border-primary-200 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-primary-600 mb-2">
                  Subir recibo o comprobante
                </p>
                <Button type="button" variant="outline" size="sm">
                  Seleccionar archivo
                </Button>
                <p className="text-xs text-primary-500 mt-2">
                  PDF, JPG, PNG hasta 10MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas adicionales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionales sobre este gasto..."
              className="min-h-24"
            />
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
};

export default ExpenseFormView;
