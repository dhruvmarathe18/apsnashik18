import React, { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '@/store/useStudentStore';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateStudentLedger } from '@/utils/feeLedger';
import { FeeCollection } from '@/types';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FeeLedger: React.FC = () => {
  const navigate = useNavigate();
  const { students, loadStudents, loadFeePlans, feePlans } = useStudentStore();
  const { transactions, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showOnlyDue, setShowOnlyDue] = useState(false);

  useEffect(() => {
    loadStudents();
    loadFeePlans();
  }, [loadStudents, loadFeePlans]);

  const ledgers = useMemo(() => {
    const studentPayments = new Map<string, FeeCollection[]>();
    transactions
      .filter((t): t is FeeCollection => t.type === 'fee_collection' && !!t.studentId)
      .forEach((payment) => {
        const studentId = payment.studentId!;
        if (!studentPayments.has(studentId)) {
          studentPayments.set(studentId, []);
        }
        studentPayments.get(studentId)!.push(payment);
      });

    return students
      .filter((s) => {
        if (filterClass && s.className !== filterClass) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          if (
            !s.fullName.toLowerCase().includes(q) &&
            !s.admissionNo.toLowerCase().includes(q) &&
            !s.phonePrimary.includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .map((student) => {
        const plan = feePlans.find((p) => p.studentId === student.id) || null;
        const payments = studentPayments.get(student.id) || [];
        return calculateStudentLedger(student, plan, payments, settings);
      })
      .filter((ledger) => {
        if (showOnlyDue) {
          return ledger.remaining.total > 0;
        }
        return true;
      });
  }, [students, feePlans, transactions, settings, searchTerm, filterClass, showOnlyDue]);

  const columns: Column<typeof ledgers[0]>[] = [
    {
      key: 'student',
      header: 'Student',
      render: (val) => (
        <div>
          <div className="font-medium">{val.fullName}</div>
          <div className="text-sm text-muted-foreground">{val.admissionNo}</div>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Class',
      render: (val) => `${val.className}${val.section ? ` - ${val.section}` : ''}`,
    },
    {
      key: 'expected',
      header: 'Expected',
      render: (val) => `₹${val.total.toLocaleString('en-IN')}`,
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (val) => `₹${val.total.toLocaleString('en-IN')}`,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      render: (val) => (
        <span className={val.total > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
          ₹{val.total.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'paidPercentage',
      header: 'Paid %',
      render: (val) => `${val.toFixed(1)}%`,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/students/${row.studentId}`)}
          className="text-primary hover:underline"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Fee Ledger</h1>
        <p className="text-muted-foreground">View fee status for all students</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, admission no, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              options={[
                { value: '', label: 'All Classes' },
                ...settings.classes.map((c) => ({ value: c, label: c })),
              ]}
              className="w-[150px]"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyDue}
                onChange={(e) => setShowOnlyDue(e.target.checked)}
                className="h-4 w-4"
              />
              <label className="text-sm">Show only with dues</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={ledgers} columns={columns} searchable={false} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledgers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {ledgers
                .reduce((sum, l) => sum + l.expected.total, 0)
                .toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹
              {ledgers
                .reduce((sum, l) => sum + l.remaining.total, 0)
                .toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
