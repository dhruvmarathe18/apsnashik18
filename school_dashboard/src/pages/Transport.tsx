import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { BusFeeCollection, BusExpense } from '@/types';
import { format, parseISO } from 'date-fns';
import { generateTransportReport } from '@/utils/reports';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Transport: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction, settings } = useStore();
  const [selectedBus, setSelectedBus] = useState<string>('');

  const busFeeTransactions = useMemo(() => {
    return transactions.filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection');
  }, [transactions]);

  const busExpenseTransactions = useMemo(() => {
    return transactions.filter((t): t is BusExpense => t.type === 'bus_expense');
  }, [transactions]);

  const transportReports = useMemo(() => {
    return generateTransportReport(transactions, selectedBus || undefined);
  }, [transactions, selectedBus]);

  const busFeeColumns: Column<BusFeeCollection>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'busNumber', header: 'Bus Number' },
    { key: 'busRoute', header: 'Route' },
    { key: 'studentName', header: 'Student Name', render: (val) => val || '-' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
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

  const busExpenseColumns: Column<BusExpense>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'busNumber', header: 'Bus Number' },
    { key: 'expenseType', header: 'Expense Type' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
    { key: 'vendor', header: 'Vendor', render: (val) => val || '-' },
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

  const totalBusFees = busFeeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBusExpenses = busExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transport</h1>
          <p className="text-muted-foreground">Manage bus fees and expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/add-entry')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bus Fee
          </Button>
          <Button onClick={() => navigate('/add-entry')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bus Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Bus Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totalBusFees.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Bus Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{totalBusExpenses.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalBusFees - totalBusExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{(totalBusFees - totalBusExpenses).toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bus-wise Summary</CardTitle>
            <Select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              options={[
                { value: '', label: 'All Buses' },
                ...settings.buses.map((b) => ({ value: b.busNumber, label: b.busNumber })),
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Bus Number</th>
                  <th className="text-left p-2">Route</th>
                  <th className="text-right p-2">Fee Collection</th>
                  <th className="text-right p-2">Expenses</th>
                  <th className="text-right p-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {transportReports.map((report) => (
                  <tr key={report.busNumber} className="border-b">
                    <td className="p-2 font-medium">{report.busNumber}</td>
                    <td className="p-2">{report.busRoute}</td>
                    <td className="p-2 text-right text-green-600">
                      ₹{report.feeCollection.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      ₹{report.expenses.total.toLocaleString('en-IN')}
                    </td>
                    <td
                      className={`p-2 text-right font-medium ${
                        report.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ₹{report.net.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bus Fee Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={busFeeTransactions} columns={busFeeColumns} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bus Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={busExpenseTransactions} columns={busExpenseColumns} />
        </CardContent>
      </Card>
    </div>
  );
};
