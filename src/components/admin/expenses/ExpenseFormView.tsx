import { useState, useEffect, useRef } from 'react';
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
  Upload,
  X
} from 'lucide-react';
import { Expense } from '@/types/expense';
import { useAppSelector } from '@/hooks/useAppSelector';
import { expenseService } from '@/services';
import { addExpense, updateExpense } from '@/store/slices/expensesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

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
    amount: '',
    subtotal: '',
    taxes: '',
    category: 'MATERIALS',
    paymentMethod: '',
    receipt: '',
    notes: '',
  });

  const user = useAppSelector((state) => state.user.currentUser.name || state.user.currentUser.email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        subtotal: expense.subtotal?.toString() || '',
        taxes: expense.taxes?.toString() || '',
        category: expense.category || 'MATERIALS',
        paymentMethod: expense.paymentMethod || '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        receipt: 'Solo se permiten archivos JPG, PNG o PDF'
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setErrors(prev => ({
        ...prev,
        receipt: 'El archivo no debe superar los 10MB'
      }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, receipt: '' }));
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'El método de pago es requerido';
    }

    if (formData.subtotal && (isNaN(Number(formData.subtotal)) || Number(formData.subtotal) < 0)) {
      newErrors.subtotal = 'El subtotal no puede ser negativo';
    }

    if (formData.taxes && (isNaN(Number(formData.taxes)) || Number(formData.taxes) < 0)) {
      newErrors.taxes = 'Los impuestos no pueden ser negativos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsUploading(true);

      let receiptUrl = formData.receipt;
      if (selectedFile) {
        const uploadResponse = await expenseService.uploadReceipt(formData.id, selectedFile) as any;
        receiptUrl = uploadResponse.url;
      }
      // Preparar datos para enviar
      const dataToSave = {
        ...formData,
        amount: Number(formData.amount),
        subtotal: Number(formData.subtotal),
        taxes: Number(formData.taxes),
        receipt: receiptUrl,
        userId: user
      };

      if (expense) {
        const updatedExpense = await expenseService.update(expense.id, dataToSave);

        dispatch(updateExpense(updatedExpense as Expense));
      } else {
        const createdExpense = await expenseService.create(dataToSave);
        dispatch(addExpense(createdExpense as Expense));
      }



    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Error al guardar el gasto. Por favor, intente nuevamente.'
      }));
    } finally {
      setIsUploading(false);

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
            disabled={isUploading}
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
        <Button
          onClick={handleSubmit}
          variant="gradient"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información principal */}
          <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
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
                  <Label htmlFor="amount">Monto Total *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                    <Input
                      id="amount"
                      type="text"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^(\d+(\.\d{0,2})?)?$/.test(value)) {
                          handleInputChange('amount', value);
                        }
                      }}
                      placeholder="0.00"
                      className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                      inputMode="decimal"
                      autoComplete="off"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                    <Input
                      id="subtotal"
                      type="text"
                      value={formData.subtotal}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^(\d+(\.\d{0,2})?)?$/.test(value)) {
                          handleInputChange('subtotal', value);
                        }
                      }}
                      placeholder="0.00"
                      className={`pl-10 ${errors.subtotal ? 'border-red-500' : ''}`}
                      inputMode="decimal"
                      autoComplete="off"
                    />
                  </div>
                  {errors.subtotal && <p className="text-sm text-red-500 mt-1">{errors.subtotal}</p>}
                </div>
                <div>
                  <Label htmlFor="taxes">Impuestos</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                    <Input
                      id="taxes"
                      type="text"
                      value={formData.taxes}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^(\d+(\.\d{0,2})?)?$/.test(value)) {
                          handleInputChange('taxes', value);
                        }
                      }}
                      placeholder="0.00"
                      className={`pl-10 ${errors.taxes ? 'border-red-500' : ''}`}
                      inputMode="decimal"
                      autoComplete="off"
                    />
                  </div>
                  {errors.taxes && <p className="text-sm text-red-500 mt-1">{errors.taxes}</p>}
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
          <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentMethod">Método de Pago *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                    <SelectItem value="CHECK">Cheque</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>}
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

              {/* Sección de carga de archivo */}
              <div>
                <Label>Subir Comprobante</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-8 w-8 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium text-primary-900">{selectedFile.name}</p>
                          <p className="text-xs text-primary-600">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.receipt ? 'border-red-300 bg-red-50' : 'border-primary-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                  >
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
                )}
                {errors.receipt && <p className="text-sm text-red-500 mt-1">{errors.receipt}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas adicionales */}
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
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

        {/* Error de envío */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ExpenseFormView;