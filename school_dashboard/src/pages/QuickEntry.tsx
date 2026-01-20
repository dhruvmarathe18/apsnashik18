import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useStudentStore } from '@/store/useStudentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Transaction, TransactionType, FeeType } from '@/types';
import { uuidv4 } from '@/utils/uuid';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const entryTypes: { value: TransactionType; label: string }[] = [
  { value: 'fee_collection', label: 'Fee Collection' },
  { value: 'bus_fee_collection', label: 'Bus Fee Collection' },
  { value: 'bus_expense', label: 'Bus Expense' },
  { value: 'salary', label: 'Salary' },
  { value: 'other_expense', label: 'Other Expense' },
  { value: 'other_income', label: 'Other Income' },
];

export const QuickEntry: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction, settings } = useStore();
  const { students, loadStudents, getStudentById } = useStudentStore();
  const [step, setStep] = useState(1);
  const [entryType, setEntryType] = useState<TransactionType | ''>('');
  const [formData, setFormData] = useState<any>({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    paymentMode: 'Cash',
    notes: '',
    studentId: '',
    admissionNo: '',
    feeForMonth: '',
  });

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const selectedStudent = useMemo(() => {
    if (formData.studentId) {
      return getStudentById(formData.studentId);
    }
    if (formData.admissionNo) {
      return students.find((s) => s.admissionNo === formData.admissionNo);
    }
    return null;
  }, [formData.studentId, formData.admissionNo, students, getStudentById]);

  useEffect(() => {
    if (selectedStudent && entryType === 'fee_collection') {
      setFormData((prev: any) => ({
        ...prev,
        class: selectedStudent.className,
        studentName: selectedStudent.fullName,
      }));
    }
  }, [selectedStudent, entryType]);

  const handleNext = () => {
    if (step === 1 && entryType) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!entryType) return;

    const baseTransaction = {
      id: uuidv4(),
      date: formData.date,
      amount: Number(formData.amount),
      paymentMode: formData.paymentMode,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    let transaction: Transaction;

    switch (entryType) {
      case 'fee_collection':
        transaction = {
          ...baseTransaction,
          type: 'fee_collection',
          studentId: formData.studentId || undefined,
          admissionNo: formData.admissionNo || undefined,
          class: formData.class || '',
          studentName: formData.studentName || undefined,
          feeType: (formData.feeType || 'Tuition') as FeeType,
          feeForMonth: formData.feeForMonth || undefined,
          status: formData.status || 'Paid',
        } as Transaction;
        break;
      case 'bus_fee_collection':
        transaction = {
          ...baseTransaction,
          type: 'bus_fee_collection',
          busNumber: formData.busNumber || '',
          busRoute: formData.busRoute || '',
          studentName: formData.studentName || undefined,
        } as Transaction;
        break;
      case 'bus_expense':
        transaction = {
          ...baseTransaction,
          type: 'bus_expense',
          busNumber: formData.busNumber || '',
          expenseType: formData.expenseType || 'Other',
          vendor: formData.vendor || undefined,
        } as Transaction;
        break;
      case 'salary':
        transaction = {
          ...baseTransaction,
          type: 'salary',
          employeeType: formData.employeeType || 'Teacher',
          employeeName: formData.employeeName || '',
          salaryMonth: formData.salaryMonth || '',
        } as Transaction;
        break;
      case 'other_expense':
        transaction = {
          ...baseTransaction,
          type: 'other_expense',
          category: formData.category || 'Misc',
        } as Transaction;
        break;
      case 'other_income':
        transaction = {
          ...baseTransaction,
          type: 'other_income',
          incomeSource: formData.incomeSource || 'Other',
        } as Transaction;
        break;
      default:
        return;
    }

    await addTransaction(transaction);
    navigate('/');
  };

  const renderFormFields = () => {
    if (!entryType) return null;

    switch (entryType) {
      case 'fee_collection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Search Student (Admission No)</label>
              <Input
                value={formData.admissionNo || ''}
                onChange={(e) => {
                  const admissionNo = e.target.value;
                  const student = students.find((s) => s.admissionNo === admissionNo);
                  setFormData({
                    ...formData,
                    admissionNo,
                    studentId: student?.id || '',
                    class: student?.className || formData.class || '',
                    studentName: student?.fullName || formData.studentName || '',
                  });
                }}
                placeholder="Enter admission number or leave blank for walk-in"
                list="students-list"
              />
              <datalist id="students-list">
                {students.slice(0, 50).map((s) => (
                  <option key={s.id} value={s.admissionNo}>
                    {s.fullName} - {s.className}
                  </option>
                ))}
              </datalist>
              {selectedStudent && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {selectedStudent.fullName} - {selectedStudent.className}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Class *</label>
              <Select
                value={formData.class || ''}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                options={settings.classes.map((c) => ({ value: c, label: c }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Student Name</label>
              <Input
                value={formData.studentName || ''}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Optional (for walk-in)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fee Type *</label>
              <Select
                value={formData.feeType || 'Tuition'}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                options={[
                  { value: 'Tuition', label: 'Tuition' },
                  { value: 'Exam', label: 'Exam' },
                  { value: 'Annual', label: 'Annual' },
                  { value: 'Books', label: 'Books' },
                  { value: 'Uniform', label: 'Uniform' },
                  { value: 'Other', label: 'Other' },
                ]}
                required
              />
            </div>
            {formData.feeType === 'Tuition' && (
              <div>
                <label className="block text-sm font-medium mb-2">Fee For Month (YYYY-MM)</label>
                <Input
                  type="month"
                  value={formData.feeForMonth || ''}
                  onChange={(e) => setFormData({ ...formData, feeForMonth: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                value={formData.status || 'Paid'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Pending', label: 'Pending' },
                ]}
              />
            </div>
          </>
        );
      case 'bus_fee_collection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Bus Number *</label>
              <Select
                value={formData.busNumber || ''}
                onChange={(e) => {
                  const bus = settings.buses.find((b) => b.busNumber === e.target.value);
                  setFormData({
                    ...formData,
                    busNumber: e.target.value,
                    busRoute: bus?.route || '',
                  });
                }}
                options={settings.buses.map((b) => ({ value: b.busNumber, label: b.busNumber }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Student Name</label>
              <Input
                value={formData.studentName || ''}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </>
        );
      case 'bus_expense':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Bus Number *</label>
              <Select
                value={formData.busNumber || ''}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                options={settings.buses.map((b) => ({ value: b.busNumber, label: b.busNumber }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expense Type *</label>
              <Select
                value={formData.expenseType || 'Other'}
                onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                options={[
                  { value: 'Diesel', label: 'Diesel' },
                  { value: 'Maintenance', label: 'Maintenance' },
                  { value: 'Driver Salary', label: 'Driver Salary' },
                  { value: 'Cleaner Salary', label: 'Cleaner Salary' },
                  { value: 'Toll', label: 'Toll' },
                  { value: 'Tyre', label: 'Tyre' },
                  { value: 'Repair', label: 'Repair' },
                  { value: 'Other', label: 'Other' },
                ]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vendor</label>
              <Input
                value={formData.vendor || ''}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </>
        );
      case 'salary':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Employee Type *</label>
              <Select
                value={formData.employeeType || 'Teacher'}
                onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
                options={[
                  { value: 'Teacher', label: 'Teacher' },
                  { value: 'Staff', label: 'Staff' },
                ]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employee Name *</label>
              <Input
                value={formData.employeeName || ''}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                placeholder="Enter employee name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salary Month *</label>
              <Input
                type="month"
                value={formData.salaryMonth || ''}
                onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })}
                required
              />
            </div>
          </>
        );
      case 'other_expense':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select
              value={formData.category || 'Misc'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={settings.expenseCategories.map((c) => ({ value: c, label: c }))}
              required
            />
          </div>
        );
      case 'other_income':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Income Source *</label>
            <Select
              value={formData.incomeSource || 'Other'}
              onChange={(e) => setFormData({ ...formData, incomeSource: e.target.value })}
              options={settings.incomeSources.map((s) => ({ value: s, label: s }))}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quick Entry</h1>
        <p className="text-muted-foreground">Add a new transaction quickly</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Step {step} of 3: {step === 1 ? 'Choose Entry Type' : step === 2 ? 'Enter Details' : 'Confirm'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entryTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setEntryType(type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      entryType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!entryType}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <DatePicker
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount *</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Mode *</label>
                  <Select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    options={settings.paymentModes.map((m) => ({ value: m, label: m }))}
                    required
                  />
                </div>
                {renderFormFields()}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!formData.amount || !formData.date}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Entry Type:</span>
                  <span>{entryTypes.find((t) => t.value === entryType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>₹{Number(formData.amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Mode:</span>
                  <span>{formData.paymentMode}</span>
                </div>
                {Object.entries(formData)
                  .filter(([key]) => !['date', 'amount', 'paymentMode', 'notes'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                {formData.notes && (
                  <div className="flex justify-between">
                    <span className="font-medium">Notes:</span>
                    <span>{formData.notes}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
