import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { QuickEntry } from '@/pages/QuickEntry';
import { Students } from '@/pages/Students';
import { StudentProfile } from '@/pages/StudentProfile';
import { FeeLedger } from '@/pages/FeeLedger';
import { FeeDueReports } from '@/pages/FeeDueReports';
import { Fees } from '@/pages/Fees';
import { Transport } from '@/pages/Transport';
import { Salaries } from '@/pages/Salaries';
import { Expenses } from '@/pages/Expenses';
import { Income } from '@/pages/Income';
import { Reports } from '@/pages/Reports';
import { ExportImport } from '@/pages/ExportImport';
import { Settings } from '@/pages/Settings';
import { useStore } from '@/store/useStore';
import { useStudentStore } from '@/store/useStudentStore';
import './App.css';

function App() {
  const { loadData, isLoading } = useStore();
  const { loadStudents, loadFeePlans } = useStudentStore();

  useEffect(() => {
    loadData();
    loadStudents();
    loadFeePlans();
  }, [loadData, loadStudents, loadFeePlans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-entry" element={<QuickEntry />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/fee-ledger" element={<FeeLedger />} />
          <Route path="/fee-due-reports" element={<FeeDueReports />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/salaries" element={<Salaries />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/export-import" element={<ExportImport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
