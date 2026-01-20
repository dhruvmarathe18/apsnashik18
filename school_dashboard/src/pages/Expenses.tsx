import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { OtherExpense } from '@/types';
import { format, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useStore();

  const expenseTransactions = useMemo(() => {
    return transactions.filter((t): t is OtherExpense => t.type === 'other_expense');
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    expenseTransactions.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [expenseTransactions]);

  const columns: Column<OtherExpense>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
      sortable: true,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
    { key: 'notes', header: 'Notes', render: (val) => val || '-' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this entry?')) {
              deleteTransaction(row.id);
            }
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Other Expenses</h1>
          <p className="text-muted-foreground">Track miscellaneous expenses</p>
        </div>
        <Button onClick={() => navigate('/add-entry')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenseTransactions.length} entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Expense Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={expenseTransactions} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
