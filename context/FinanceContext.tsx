import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  categories: Category[];
  budgets: Record<string, number>;
  setBudget: (category: string, amount: number) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  currency: string;
  setCurrency: (code: string) => void;
  resetData: () => void;
}

const CATEGORIES: Category[] = [
  { name: 'Makanan', icon: 'Utensils', color: '#FF9500' },
  { name: 'Transportasi', icon: 'Car', color: '#5856D6' },
  { name: 'Hiburan', icon: 'Gamepad2', color: '#FF2D55' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: '#4CD964' },
  { name: 'Belanja', icon: 'ShoppingBag', color: '#FF3B30' },
  { name: 'Pendidikan', icon: 'GraduationCap', color: '#007AFF' },
  { name: 'Tagihan', icon: 'ReceiptText', color: '#AF52DE' },
  { name: 'Lainnya', icon: 'MoreHorizontal', color: '#8E8E93' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
  const [currency, setCurrency] = useState('IDR');
  const [budgets, setBudgets] = useState<Record<string, number>>({
    'Makanan': 2000000,
    'Transportasi': 500000,
    'Hiburan': 300000,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'Gaji Bulanan',
      amount: 10000000,
      type: 'income',
      category: 'Gaji',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Belanja Mingguan',
      amount: 500000,
      type: 'expense',
      category: 'Makanan',
      date: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Bayar Listrik',
      amount: 350000,
      type: 'expense',
      category: 'Tagihan',
      date: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Tiket Bioskop',
      amount: 100000,
      type: 'expense',
      category: 'Hiburan',
      date: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Obat Apotek',
      amount: 75000,
      type: 'expense',
      category: 'Kesehatan',
      date: new Date().toISOString(),
    },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const setBudget = (category: string, amount: number) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  const resetData = () => {
    setTransactions([]);
    setBudgets({});
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalBalance,
        totalIncome,
        totalExpenses,
        categories: CATEGORIES,
        budgets,
        setBudget,
        user,
        setUser,
        currency,
        setCurrency,
        resetData,
      }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
