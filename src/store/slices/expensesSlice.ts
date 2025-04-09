import { Expense, RootState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface ExpensesState {
  items: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  loading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.items.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(expense => expense.id !== action.payload);
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  setExpenses,
  setLoading,
  setError,
} = expensesSlice.actions;

export const selectAllExpenses = (state: RootState) => state.expenses.items;
export const selectExpenseById = (state: RootState, id: string) => state.expenses.items.find(expense => expense.id === id);
export const selectExpensesByCategory = (state: RootState, category: Expense['category']) => state.expenses.items.filter(expense => expense.category === category);
export const selectLoading = (state: RootState) => state.expenses.loading;
export const selectError = (state: RootState) => state.expenses.error;

export default expensesSlice.reducer;