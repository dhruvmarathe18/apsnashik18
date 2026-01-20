import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { format, startOfMonth, endOfMonth, parseISO, isSameMonth, isSameDay } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Transaction } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Dashboard: React.FC = () => {
  const { transactions } = useStore();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const todayData = useMemo(() => {
    const todayTransactions = transactions.filter((t) => t.date === todayStr);
    const income = todayTransactions
      .filter((t) => ['fee_collection', 'bus_fee_collection', 'other_income'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = todayTransactions
      .filter((t) => ['bus_expense', 'salary', 'other_expense'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions, todayStr]);

  const monthData = useMemo(() => {
    const monthTransactions = transactions.filter((t) => {
      const tDate = parseISO(t.date);
      return isSameMonth(tDate, monthStart);
    });
    const income = monthTransactions
      .filter((t) => ['fee_collection', 'bus_fee_collection', 'other_income'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter((t) => ['bus_expense', 'salary', 'other_expense'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions, monthStart]);

  const dailyTrendData = useMemo(() => {
    const days: Record<string, { date: string; income: number; expense: number }> = {};
    transactions
      .filter((t) => {
        const tDate = parseISO(t.date);
        return isSameMonth(tDate, monthStart);
      })
      .forEach((t) => {
        if (!days[t.date]) {
          days[t.date] = { date: format(parseISO(t.date), 'MMM dd'), income: 0, expense: 0 };
        }
        const isIncome = ['fee_collection', 'bus_fee_collection', 'other_income'].includes(t.type);
        if (isIncome) {
          days[t.date].income += t.amount;
        } else {
          days[t.date].expense += t.amount;
        }
      });
    return Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, monthStart]);

  const expenseCategoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'other_expense')
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const classWiseFeeData = useMemo(() => {
    const classes: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'fee_collection')
      .forEach((t) => {
        classes[t.class] = (classes[t.class] || 0) + t.amount;
      });
    return Object.entries(classes).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [transactions]);

  const transactionColumns: Column<Transaction>[] = [
    { key: 'date', header: 'Date', render: (val) => format(parseISO(val), 'MMM dd, yyyy') },
    { key: 'type', header: 'Type', render: (val) => val.replace('_', ' ').toUpperCase() },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your school finances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayData.income.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayData.expense.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Net</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                todayData.net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{todayData.net.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month Net</CardTitle>
            <Receipt className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                monthData.net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{monthData.net.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Income: ₹{monthData.income.toLocaleString('en-IN')} | Expense: ₹
              {monthData.expense.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Trend (Current Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Class-wise Fee Collection</CardTitle>
          </CardHeader>
          <CardContent>
            {classWiseFeeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classWiseFeeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No fee collection data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={recentTransactions} columns={transactionColumns} />
        </CardContent>
      </Card>
    </div>
  );
};
