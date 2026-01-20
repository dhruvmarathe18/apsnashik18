import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useStudentStore } from '@/store/useStudentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { FeeCollection } from '@/types';
import { format, parseISO } from 'date-fns';
import { generateClassWiseFeeReport } from '@/utils/reports';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Fees: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useStore();
  const { getStudentById } = useStudentStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const feeTransactions = useMemo(() => {
    return transactions.filter((t): t is FeeCollection => t.type === 'fee_collection');
  }, [transactions]);

  const classWiseReport = useMemo(() => {
    return generateClassWiseFeeReport(transactions, selectedMonth || undefined);
  }, [transactions, selectedMonth]);

  const columns: Column<FeeCollection>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    {
      key: 'admissionNo',
      header: 'Admission No',
      render: (val, row) => {
        if (row.studentId) {
          const student = getStudentById(row.studentId);
          return student?.admissionNo || val || '-';
        }
        return val || '-';
      },
    },
    { key: 'class', header: 'Class' },
    {
      key: 'studentName',
      header: 'Student Name',
      render: (val, row) => {
        if (row.studentId) {
          const student = getStudentById(row.studentId);
          return student?.fullName || val || '-';
        }
        return val || '-';
      },
    },
    { key: 'feeType', header: 'Fee Type' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
      sortable: true,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
    { key: 'status', header: 'Status' },
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

  const total = feeTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fees Collection</h1>
          <p className="text-muted-foreground">Manage student fee collections</p>
        </div>
        <Button onClick={() => navigate('/add-entry')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Fee Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feeTransactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classWiseReport.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Class-wise Summary</CardTitle>
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
                  <th className="text-left p-2">Class</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {classWiseReport.map((report) => (
                  <tr key={report.class} className="border-b">
                    <td className="p-2 font-medium">{report.class}</td>
                    <td className="p-2 text-right">₹{report.total.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">{report.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Fee Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={feeTransactions} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
