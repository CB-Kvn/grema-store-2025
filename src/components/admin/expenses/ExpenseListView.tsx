import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { Expense } from '@/types/expense';

interface ExpenseListViewProps {
  expenses: Expense[];
  searchQuery: string;
  onViewDetails: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseListView: React.FC<ExpenseListViewProps> = ({
  expenses,
  searchQuery,
  onViewDetails,
  onEdit,
  onDelete,
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-3 w-3" />;
      default:
        return <DollarSign className="h-3 w-3" />;
    }
  };

  const filteredExpenses = expenses.filter((expense: any) =>
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.amount?.toString().includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExpenses.map((expense: any) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-primary-900 line-clamp-2">
                    {expense.description}
                  </CardTitle>
                  <p className="text-sm text-primary-600 mt-1">
                    {format(new Date(expense.date), 'dd/MM/yyyy')}
                  </p>
                </div>
                <Badge className={`${getCategoryColor(expense.category)} border flex items-center gap-1 ml-2`}>
                  <Receipt className="h-3 w-3" />
                  {expense.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary-500" />
                    <span className="font-bold text-lg text-primary-900">
                      ${expense.amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    {getPaymentMethodIcon(expense.paymentMethod)}
                    <span className="capitalize">{expense.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {expense.receipt && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <FileText className="h-4 w-4 text-primary-500" />
                    <span>Recibo disponible</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(expense)}
                  className="flex-1 h-8"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(expense)}
                  className="flex-1 h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {filteredExpenses.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Receipt className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            No se encontraron gastos
          </h3>
          <p className="text-primary-600">
            {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Aún no hay gastos registrados'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseListView;
