import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Salary } from '@/types';
import { format, parseISO } from 'date-fns';
import { generateSalaryReport } from '@/utils/reports';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Salaries: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const salaryTransactions = useMemo(() => {
    return transactions.filter((t): t is Salary => t.type === 'salary');
  }, [transactions]);

  const salaryReports = useMemo(() => {
    return generateSalaryReport(transactions, selectedMonth || undefined);
  }, [transactions, selectedMonth]);

  const columns: Column<Salary>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'employeeType', header: 'Type' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'salaryMonth', header: 'Salary Month' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
      sortable: true,
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

  const total = salaryTransactions.reduce((sum, t) => sum + t.amount, 0);
  const teachersTotal = salaryTransactions
    .filter((t) => t.employeeType === 'Teacher')
    .reduce((sum, t) => sum + t.amount, 0);
  const staffTotal = salaryTransactions
    .filter((t) => t.employeeType === 'Staff')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Salaries</h1>
          <p className="text-muted-foreground">Manage teacher and staff salaries</p>
        </div>
        <Button onClick={() => navigate('/add-entry')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Salary Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Salaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{teachersTotal.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {salaryTransactions.filter((t) => t.employeeType === 'Teacher').length} employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{staffTotal.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {salaryTransactions.filter((t) => t.employeeType === 'Staff').length} employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaryTransactions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Monthly Summary</CardTitle>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Teachers</th>
                  <th className="text-right p-2">Staff</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {salaryReports.map((report) => (
                  <tr key={report.month} className="border-b">
                    <td className="p-2 font-medium">{report.month}</td>
                    <td className="p-2 text-right">
                      ₹{report.teachers.total.toLocaleString('en-IN')} ({report.teachers.count})
                    </td>
                    <td className="p-2 text-right">
                      ₹{report.staff.total.toLocaleString('en-IN')} ({report.staff.count})
                    </td>
                    <td className="p-2 text-right font-medium">
                      ₹{report.total.toLocaleString('en-IN')}
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
          <CardTitle>All Salary Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={salaryTransactions} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
