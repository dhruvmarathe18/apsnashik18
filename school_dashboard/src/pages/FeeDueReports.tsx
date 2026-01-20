import React, { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '@/store/useStudentStore';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateStudentLedger, calculateClassLedger, isDefaulter } from '@/utils/feeLedger';
import { FeeCollection } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, Printer } from 'lucide-react';
import { exportToExcel } from '@/utils/excel';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const FeeDueReports: React.FC = () => {
  const { students, loadStudents, loadFeePlans, feePlans } = useStudentStore();
  const { transactions, settings } = useStore();
  const [reportType, setReportType] = useState<'studentwise' | 'classwise' | 'defaulter'>('studentwise');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showOnlyDue, setShowOnlyDue] = useState(false);

  useEffect(() => {
    loadStudents();
    loadFeePlans();
  }, [loadStudents, loadFeePlans]);

  const studentPayments = useMemo(() => {
    const map = new Map<string, FeeCollection[]>();
    transactions
      .filter((t): t is FeeCollection => t.type === 'fee_collection' && !!t.studentId)
      .forEach((payment) => {
        const studentId = payment.studentId!;
        if (!map.has(studentId)) {
          map.set(studentId, []);
        }
        map.get(studentId)!.push(payment);
      });
    return map;
  }, [transactions]);

  const studentLedgers = useMemo(() => {
    return students.map((student) => {
      const plan = feePlans.find((p) => p.studentId === student.id) || null;
      const payments = studentPayments.get(student.id) || [];
      return calculateStudentLedger(student, plan, payments, settings);
    });
  }, [students, feePlans, studentPayments, settings]);

  const filteredStudentLedgers = useMemo(() => {
    return studentLedgers.filter((ledger) => {
      if (filterClass && ledger.student.className !== filterClass) return false;
      if (filterSection && ledger.student.section !== filterSection) return false;
      if (showOnlyDue && ledger.remaining.total <= 0) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (
          !ledger.student.fullName.toLowerCase().includes(q) &&
          !ledger.student.admissionNo.toLowerCase().includes(q) &&
          !ledger.student.phonePrimary.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [studentLedgers, filterClass, filterSection, showOnlyDue, searchTerm]);

  const classLedgers = useMemo(() => {
    const classes = [...new Set(students.map((s) => s.className))];
    return classes.map((className) =>
      calculateClassLedger(students, feePlans, Array.from(studentPayments.values()).flat(), className, settings)
    );
  }, [students, feePlans, studentPayments, settings]);

  const defaulterLedgers = useMemo(() => {
    return studentLedgers.filter((ledger) => isDefaulter(ledger, settings));
  }, [studentLedgers, settings]);

  const studentWiseColumns: Column<typeof filteredStudentLedgers[0]>[] = [
    { key: 'student', header: 'Admission No', render: (val) => val.admissionNo },
    { key: 'student', header: 'Student Name', render: (val) => val.fullName },
    { key: 'student', header: 'Class', render: (val) => `${val.className}${val.section ? ` - ${val.section}` : ''}` },
    {
      key: 'expected',
      header: 'Total Expected',
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
      header: '% Paid',
      render: (val) => `${val.toFixed(1)}%`,
    },
    { key: 'student', header: 'Phone', render: (val) => val.phonePrimary },
    {
      key: 'student',
      header: 'Bus Opted',
      render: (val) => (val.busOpted ? 'Yes' : 'No'),
    },
  ];

  const classWiseColumns: Column<typeof classLedgers[0]>[] = [
    { key: 'className', header: 'Class' },
    {
      key: 'totals',
      header: 'Total Expected',
      render: (val) => `₹${val.expected.toLocaleString('en-IN')}`,
    },
    {
      key: 'totals',
      header: 'Total Paid',
      render: (val) => `₹${val.paid.toLocaleString('en-IN')}`,
    },
    {
      key: 'totals',
      header: 'Total Remaining',
      render: (val) => (
        <span className={val.remaining > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
          ₹{val.remaining.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'totals',
      header: 'Paid %',
      render: (val) => `${val.paidPercentage.toFixed(1)}%`,
    },
    {
      key: 'totals',
      header: '# Students',
      render: (val) => val.studentCount,
    },
    {
      key: 'totals',
      header: '# With Dues',
      render: (val) => (
        <span className={val.dueStudentCount > 0 ? 'text-red-600' : ''}>
          {val.dueStudentCount}
        </span>
      ),
    },
  ];

  const chartData = useMemo(() => {
    return classLedgers.map((ledger) => ({
      name: ledger.className,
      paid: ledger.totals.paid,
      remaining: ledger.totals.remaining,
    }));
  }, [classLedgers]);

  const topDefaulterData = useMemo(() => {
    return defaulterLedgers
      .sort((a, b) => b.remaining.total - a.remaining.total)
      .slice(0, 10)
      .map((ledger) => ({
        name: ledger.student.fullName,
        amount: ledger.remaining.total,
      }));
  }, [defaulterLedgers]);

  const handleExport = async () => {
    // Export logic would go here
    alert('Export functionality will be implemented');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fee Due Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive fee due reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={reportType === 'studentwise' ? 'primary' : 'outline'}
              onClick={() => setReportType('studentwise')}
            >
              Student-wise Due Report
            </Button>
            <Button
              variant={reportType === 'classwise' ? 'primary' : 'outline'}
              onClick={() => setReportType('classwise')}
            >
              Class-wise Summary
            </Button>
            <Button
              variant={reportType === 'defaulter' ? 'primary' : 'outline'}
              onClick={() => setReportType('defaulter')}
            >
              Defaulter List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportType === 'studentwise' && (
            <div className="space-y-4">
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
                  <label className="text-sm">Dues only</label>
                </div>
              </div>
              <DataTable data={filteredStudentLedgers} columns={studentWiseColumns} searchable={false} />
            </div>
          )}

          {reportType === 'classwise' && (
            <div className="space-y-4">
              <DataTable data={classLedgers} columns={classWiseColumns} searchable={false} />
              {chartData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Class-wise Fee Collection</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                      <Legend />
                      <Bar dataKey="paid" fill="#00C49F" name="Paid" />
                      <Bar dataKey="remaining" fill="#FF8042" name="Remaining" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {reportType === 'defaulter' && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Showing {defaulterLedgers.length} defaulters based on configured thresholds
              </div>
              <DataTable
                data={defaulterLedgers}
                columns={studentWiseColumns}
                searchable={false}
              />
              {topDefaulterData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Top 10 Highest Due Students</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topDefaulterData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                      <Bar dataKey="amount" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
