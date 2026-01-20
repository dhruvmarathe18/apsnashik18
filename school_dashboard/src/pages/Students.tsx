import React, { useState, useEffect, useMemo } from 'react';
import { useStudentStore } from '@/store/useStudentStore';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Student, FeePlan, StudentSchema, FeePlanSchema } from '@/models/student';
import { uuidv4 } from '@/utils/uuid';
import { Plus, Edit, Trash2, Eye, Search, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const { students, isLoading, loadStudents, addStudent, updateStudent, deleteStudent, searchStudents } = useStudentStore();
  const { settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [feePlanData, setFeePlanData] = useState<Partial<FeePlan>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    let result = searchTerm ? searchStudents(searchTerm) : students;
    if (filterClass) {
      result = result.filter((s) => s.className === filterClass);
    }
    if (filterStatus) {
      result = result.filter((s) => s.status === filterStatus);
    }
    return result;
  }, [students, searchTerm, filterClass, filterStatus, searchStudents]);

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
      // Load fee plan if exists
      // This would need to be fetched separately
    } else {
      setEditingStudent(null);
      setFormData({
        academicYear: settings.academicYear,
        status: 'Active',
        busOpted: false,
      });
      setFeePlanData({});
    }
    setStep(1);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({});
    setFeePlanData({});
    setStep(1);
    setErrors({});
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.admissionNo) newErrors.admissionNo = 'Required';
      if (!formData.fullName) newErrors.fullName = 'Required';
      if (!formData.className) newErrors.className = 'Required';
      if (!formData.academicYear) newErrors.academicYear = 'Required';
    } else if (stepNum === 2) {
      if (!formData.phonePrimary) newErrors.phonePrimary = 'Required';
    } else if (stepNum === 3) {
      // Class and bus details - no required fields beyond step 1
    } else if (stepNum === 4) {
      // Fee plan - optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      const now = new Date().toISOString();
      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          ...formData,
          updatedAt: now,
        } as Partial<Student>);
      } else {
        const student = await addStudent({
          ...formData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        } as Omit<Student, 'id' | 'createdAt' | 'updatedAt'>);

        // Add fee plan if provided
        if (feePlanData.tuitionFeeMonthly || feePlanData.annualFee) {
          const { addFeePlan } = useStudentStore.getState();
          await addFeePlan({
            studentId: student.id,
            tuitionFeeMonthly: feePlanData.tuitionFeeMonthly || 0,
            annualFee: feePlanData.annualFee || 0,
            examFee: feePlanData.examFee || 0,
            bookFee: feePlanData.bookFee || 0,
            uniformFee: feePlanData.uniformFee || 0,
            discount: feePlanData.discount || 0,
            miscFee: feePlanData.miscFee || 0,
            feeFrequency: feePlanData.feeFrequency || 'Monthly',
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      await deleteStudent(id);
    }
  };

  const columns: Column<Student>[] = [
    { key: 'admissionNo', header: 'Admission No' },
    { key: 'fullName', header: 'Name' },
    { key: 'className', header: 'Class' },
    { key: 'section', header: 'Section', render: (val) => val || '-' },
    { key: 'phonePrimary', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            val === 'Active'
              ? 'bg-green-100 text-green-800'
              : val === 'Inactive'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/students/${row.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
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
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Left', label: 'Left' },
              ]}
              className="w-[150px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filteredStudents} columns={columns} searchable={false} />
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 1: Student Basics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admission No *</label>
                  <Input
                    value={formData.admissionNo || ''}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    disabled={!!editingStudent}
                  />
                  {errors.admissionNo && (
                    <p className="text-sm text-red-600 mt-1">{errors.admissionNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Roll No</label>
                  <Input
                    value={formData.rollNo || ''}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <Select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    options={[
                      { value: '', label: 'Select' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <DatePicker
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class *</label>
                  <Select
                    value={formData.className || ''}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    options={[
                      { value: '', label: 'Select Class' },
                      ...settings.classes.map((c) => ({ value: c, label: c })),
                    ]}
                  />
                  {errors.className && (
                    <p className="text-sm text-red-600 mt-1">{errors.className}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <Input
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="A, B, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Academic Year *</label>
                  <Input
                    value={formData.academicYear || ''}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2024-2025"
                  />
                  {errors.academicYear && (
                    <p className="text-sm text-red-600 mt-1">{errors.academicYear}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 2: Parent & Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Father Name</label>
                  <Input
                    value={formData.fatherName || ''}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mother Name</label>
                  <Input
                    value={formData.motherName || ''}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guardian Name</label>
                  <Input
                    value={formData.guardianName || ''}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Phone *</label>
                  <Input
                    value={formData.phonePrimary || ''}
                    onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
                    type="tel"
                  />
                  {errors.phonePrimary && (
                    <p className="text-sm text-red-600 mt-1">{errors.phonePrimary}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Phone</label>
                  <Input
                    value={formData.phoneSecondary || ''}
                    onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                    type="tel"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  value={formData.addressLine1 || ''}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Address Line 1"
                />
                <Input
                  value={formData.addressLine2 || ''}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Address Line 2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                  <Input
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                  <Input
                    value={formData.pincode || ''}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 3: Class & Bus Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.busOpted || false}
                    onChange={(e) => setFormData({ ...formData, busOpted: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Bus Service Opted</label>
                </div>
                {formData.busOpted && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bus Route</label>
                      <Select
                        value={formData.busRouteId || ''}
                        onChange={(e) => setFormData({ ...formData, busRouteId: e.target.value })}
                        options={[
                          { value: '', label: 'Select Route' },
                          ...settings.buses.map((b) => ({
                            value: b.busNumber,
                            label: `${b.busNumber} - ${b.route}`,
                          })),
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Bus Fee</label>
                      <Input
                        type="number"
                        value={formData.busFeeMonthly || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            busFeeMonthly: Number(e.target.value) || undefined,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                      { value: 'Left', label: 'Left' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 4: Fee Plan Setup</h3>
              <p className="text-sm text-muted-foreground">
                Configure fee structure for this student (optional, can be set later)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Tuition Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.tuitionFeeMonthly || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        tuitionFeeMonthly: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.annualFee || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        annualFee: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Exam Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.examFee || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        examFee: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Book Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.bookFee || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        bookFee: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Uniform Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.uniformFee || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        uniformFee: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Misc Fee</label>
                  <Input
                    type="number"
                    value={feePlanData.miscFee || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        miscFee: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount</label>
                  <Input
                    type="number"
                    value={feePlanData.discount || ''}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        discount: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fee Frequency</label>
                  <Select
                    value={feePlanData.feeFrequency || 'Monthly'}
                    onChange={(e) =>
                      setFeePlanData({
                        ...feePlanData,
                        feeFrequency: e.target.value as any,
                      })
                    }
                    options={[
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Quarterly', label: 'Quarterly' },
                      { value: 'Yearly', label: 'Yearly' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 5: Review & Save</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Admission No:</span>
                  <span>{formData.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Class:</span>
                  <span>{formData.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{formData.phonePrimary}</span>
                </div>
                {feePlanData.tuitionFeeMonthly && (
                  <div className="flex justify-between">
                    <span className="font-medium">Monthly Tuition:</span>
                    <span>₹{feePlanData.tuitionFeeMonthly}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            {step < 5 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Save Student</Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
