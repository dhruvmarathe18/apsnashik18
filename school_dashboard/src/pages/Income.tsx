import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { OtherIncome } from '@/types';
import { format, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Income: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useStore();

  const incomeTransactions = useMemo(() => {
    return transactions.filter((t): t is OtherIncome => t.type === 'other_income');
  }, [transactions]);

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    incomeTransactions.forEach((t) => {
      sources[t.incomeSource] = (sources[t.incomeSource] || 0) + t.amount;
    });
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [incomeTransactions]);

  const columns: Column<OtherIncome>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'incomeSource', header: 'Income Source' },
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

  const total = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Other Income</h1>
          <p className="text-muted-foreground">Track miscellaneous income sources</p>
        </div>
        <Button onClick={() => navigate('/add-entry')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{total.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{incomeTransactions.length} entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sourceData.map((source) => (
                <div key={source.name} className="flex justify-between">
                  <span>{source.name}</span>
                  <span className="font-medium">₹{source.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Income Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={incomeTransactions} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
