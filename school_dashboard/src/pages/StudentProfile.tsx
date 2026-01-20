import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '@/store/useStudentStore';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { calculateStudentLedger } from '@/utils/feeLedger';
import { FeeCollection } from '@/types';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Plus, Edit } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudentById, getFeePlanByStudentId, loadFeePlans } = useStudentStore();
  const { transactions, settings } = useStore();

  useEffect(() => {
    loadFeePlans();
  }, [loadFeePlans]);

  const student = useMemo(() => {
    return id ? getStudentById(id) : undefined;
  }, [id, getStudentById]);

  const feePlan = useMemo(() => {
    return student ? getFeePlanByStudentId(student.id) : undefined;
  }, [student, getFeePlanByStudentId]);

  const payments = useMemo(() => {
    if (!student) return [];
    return transactions.filter(
      (t): t is FeeCollection =>
        t.type === 'fee_collection' && t.studentId === student.id
    );
  }, [transactions, student]);

  const ledger = useMemo(() => {
    if (!student) return null;
    return calculateStudentLedger(student, feePlan || null, payments, settings);
  }, [student, feePlan, payments, settings]);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Student not found</p>
          <Button onClick={() => navigate('/students')} className="mt-4">
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const paymentColumns: Column<FeeCollection>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (val) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    { key: 'feeType', header: 'Fee Type' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => `₹${val.toLocaleString('en-IN')}`,
    },
    { key: 'paymentMode', header: 'Payment Mode' },
    { key: 'feeForMonth', header: 'For Month', render: (val) => val || '-' },
    { key: 'notes', header: 'Notes', render: (val) => val || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/students')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{student.fullName}</h1>
          <p className="text-muted-foreground">
            {student.admissionNo} • {student.className}
            {student.section && ` • Section ${student.section}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Admission No:</span> {student.admissionNo}
            </div>
            {student.rollNo && (
              <div>
                <span className="font-medium">Roll No:</span> {student.rollNo}
              </div>
            )}
            <div>
              <span className="font-medium">Class:</span> {student.className}
              {student.section && ` - ${student.section}`}
            </div>
            <div>
              <span className="font-medium">Academic Year:</span> {student.academicYear}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {student.phonePrimary}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span
                className={`px-2 py-1 rounded text-xs ${
                  student.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : student.status === 'Inactive'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {student.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fee Plan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {feePlan ? (
              <>
                <div>
                  <span className="font-medium">Monthly Tuition:</span> ₹
                  {feePlan.tuitionFeeMonthly.toLocaleString('en-IN')}
                </div>
                <div>
                  <span className="font-medium">Annual Fee:</span> ₹
                  {feePlan.annualFee.toLocaleString('en-IN')}
                </div>
                <div>
                  <span className="font-medium">Exam Fee:</span> ₹
                  {feePlan.examFee.toLocaleString('en-IN')}
                </div>
                <div>
                  <span className="font-medium">Book Fee:</span> ₹
                  {feePlan.bookFee.toLocaleString('en-IN')}
                </div>
                {feePlan.discount > 0 && (
                  <div>
                    <span className="font-medium">Discount:</span> ₹
                    {feePlan.discount.toLocaleString('en-IN')}
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No fee plan configured</p>
            )}
          </CardContent>
        </Card>

        {ledger && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fee Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Total Expected:</span> ₹
                {ledger.expected.total.toLocaleString('en-IN')}
              </div>
              <div>
                <span className="font-medium">Total Paid:</span> ₹
                {ledger.paid.total.toLocaleString('en-IN')}
              </div>
              <div>
                <span className="font-medium">Remaining:</span>{' '}
                <span
                  className={
                    ledger.remaining.total > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'
                  }
                >
                  ₹{ledger.remaining.total.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="font-medium">Paid:</span>{' '}
                <span className="font-bold">
                  {ledger.paidPercentage.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {ledger && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Fee Type</th>
                    <th className="text-right p-2">Expected</th>
                    <th className="text-right p-2">Paid</th>
                    <th className="text-right p-2">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Tuition</td>
                    <td className="p-2 text-right">₹{ledger.expected.tuition.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">₹{ledger.paid.tuition.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">
                      {ledger.remaining.tuition > 0 ? (
                        <span className="text-red-600">₹{ledger.remaining.tuition.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Annual</td>
                    <td className="p-2 text-right">₹{ledger.expected.annual.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">₹{ledger.paid.annual.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">
                      {ledger.remaining.annual > 0 ? (
                        <span className="text-red-600">₹{ledger.remaining.annual.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Exam</td>
                    <td className="p-2 text-right">₹{ledger.expected.exam.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">₹{ledger.paid.exam.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">
                      {ledger.remaining.exam > 0 ? (
                        <span className="text-red-600">₹{ledger.remaining.exam.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Books</td>
                    <td className="p-2 text-right">₹{ledger.expected.books.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">₹{ledger.paid.books.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">
                      {ledger.remaining.books > 0 ? (
                        <span className="text-red-600">₹{ledger.remaining.books.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Uniform</td>
                    <td className="p-2 text-right">₹{ledger.expected.uniform.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">₹{ledger.paid.uniform.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">
                      {ledger.remaining.uniform > 0 ? (
                        <span className="text-red-600">₹{ledger.remaining.uniform.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {ledger && ledger.monthlyTuition.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Tuition Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Month</th>
                    <th className="text-right p-2">Expected</th>
                    <th className="text-right p-2">Paid</th>
                    <th className="text-right p-2">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.monthlyTuition.map((month) => (
                    <tr key={month.month} className="border-b">
                      <td className="p-2">{format(parseISO(`${month.month}-01`), 'MMM yyyy')}</td>
                      <td className="p-2 text-right">₹{month.expected.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right">₹{month.paid.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right">
                        {month.remaining > 0 ? (
                          <span className="text-red-600">₹{month.remaining.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-green-600">₹0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Payment History</CardTitle>
          <Button onClick={() => navigate('/add-entry')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <DataTable data={payments} columns={paymentColumns} searchable={false} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No payments recorded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
