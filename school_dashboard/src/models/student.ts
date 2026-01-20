import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string().uuid(),
  admissionNo: z.string().min(1, 'Admission number is required'),
  rollNo: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth: z.string().optional(),
  className: z.string().min(1, 'Class is required'),
  section: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  phonePrimary: z.string().min(1, 'Primary phone is required'),
  phoneSecondary: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  busOpted: z.boolean().default(false),
  busRouteId: z.string().optional(),
  busFeeMonthly: z.number().optional(),
  status: z.enum(['Active', 'Inactive', 'Left']).default('Active'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Student = z.infer<typeof StudentSchema>;

export const FeePlanSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  tuitionFeeMonthly: z.number().default(0),
  annualFee: z.number().default(0),
  examFee: z.number().default(0),
  bookFee: z.number().default(0),
  uniformFee: z.number().default(0),
  discount: z.number().default(0),
  miscFee: z.number().default(0),
  feeFrequency: z.enum(['Monthly', 'Quarterly', 'Yearly']).default('Monthly'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type FeePlan = z.infer<typeof FeePlanSchema>;

export interface StudentWithFeePlan extends Student {
  feePlan?: FeePlan;
}
