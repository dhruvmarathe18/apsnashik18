import { create } from 'zustand';
import { Student, FeePlan } from '@/models/student';
import { db } from '@/services/database';
import { uuidv4 } from '@/utils/uuid';

interface StudentStoreState {
  students: Student[];
  feePlans: FeePlan[];
  isLoading: boolean;

  // Actions
  loadStudents: () => Promise<void>;
  loadFeePlans: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Student>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  getStudentByAdmissionNo: (admissionNo: string) => Student | undefined;
  addFeePlan: (feePlan: Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FeePlan>;
  updateFeePlan: (id: string, updates: Partial<FeePlan>) => Promise<void>;
  getFeePlanByStudentId: (studentId: string) => FeePlan | undefined;
  deleteFeePlan: (id: string) => Promise<void>;
  searchStudents: (query: string) => Student[];
}

export const useStudentStore = create<StudentStoreState>((set, get) => ({
  students: [],
  feePlans: [],
  isLoading: true,

  loadStudents: async () => {
    set({ isLoading: true });
    try {
      const students = await db.students.toArray();
      set({ students, isLoading: false });
    } catch (error) {
      console.error('Error loading students:', error);
      set({ isLoading: false });
    }
  },

  loadFeePlans: async () => {
    try {
      const feePlans = await db.feePlans.toArray();
      set({ feePlans });
    } catch (error) {
      console.error('Error loading fee plans:', error);
    }
  },

  addStudent: async (studentData) => {
    const now = new Date().toISOString();
    const student: Student = {
      ...studentData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.students.add(student);
    const students = await db.students.toArray();
    set({ students });
    return student;
  },

  updateStudent: async (id, updates) => {
    await db.students.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    const students = await db.students.toArray();
    set({ students });
  },

  deleteStudent: async (id) => {
    await db.students.delete(id);
    // Also delete associated fee plan
    const feePlan = get().feePlans.find((p) => p.studentId === id);
    if (feePlan) {
      await db.feePlans.delete(feePlan.id);
      const feePlans = await db.feePlans.toArray();
      set({ feePlans });
    }
    const students = await db.students.toArray();
    set({ students });
  },

  getStudentById: (id) => {
    return get().students.find((s) => s.id === id);
  },

  getStudentByAdmissionNo: (admissionNo) => {
    return get().students.find((s) => s.admissionNo === admissionNo);
  },

  addFeePlan: async (feePlanData) => {
    const now = new Date().toISOString();
    const feePlan: FeePlan = {
      ...feePlanData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.feePlans.add(feePlan);
    const feePlans = await db.feePlans.toArray();
    set({ feePlans });
    return feePlan;
  },

  updateFeePlan: async (id, updates) => {
    await db.feePlans.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    const feePlans = await db.feePlans.toArray();
    set({ feePlans });
  },

  getFeePlanByStudentId: (studentId) => {
    return get().feePlans.find((p) => p.studentId === studentId);
  },

  deleteFeePlan: async (id) => {
    await db.feePlans.delete(id);
    const feePlans = await db.feePlans.toArray();
    set({ feePlans });
  },

  searchStudents: (query) => {
    const q = query.toLowerCase();
    return get().students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.phonePrimary.includes(q) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q))
    );
  },
}));
