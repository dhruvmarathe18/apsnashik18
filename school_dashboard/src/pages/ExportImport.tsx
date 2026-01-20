import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useStudentStore } from '@/store/useStudentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { exportToExcel, importFromExcel } from '@/utils/excel';
import { db } from '@/services/database';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { Toast, ToastType } from '@/components/ui/Toast';

export const ExportImport: React.FC = () => {
  const { transactions, settings, loadData } = useStore();
  const { students, feePlans, loadStudents, loadFeePlans } = useStudentStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadStudents();
    loadFeePlans();
  }, [loadStudents, loadFeePlans]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = async () => {
    try {
      await exportToExcel(transactions, settings, students, feePlans);
      // Backup date tracking can be added if needed
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
      console.error(error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { transactions: importedTransactions } = await importFromExcel(file);
      
      if (confirm(`Import ${importedTransactions.length} transactions? This will replace all existing data.`)) {
        await db.transactions.bulkPut(importedTransactions);
        await loadData();
        showToast(`Successfully imported ${importedTransactions.length} transactions!`, 'success');
      }
    } catch (error) {
      showToast('Failed to import data. Please check the file format.', 'error');
      console.error(error);
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleAppendImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { transactions: importedTransactions } = await importFromExcel(file);
      
      // Merge with existing transactions
      const existingIds = new Set(transactions.map((t) => t.id));
      const newTransactions = importedTransactions.filter((t) => !existingIds.has(t.id));
      
      if (newTransactions.length === 0) {
        showToast('No new transactions to import. All entries already exist.', 'info');
        return;
      }

      if (confirm(`Append ${newTransactions.length} new transactions?`)) {
        const merged = [...transactions, ...newTransactions];
        await db.transactions.bulkPut(merged);
        await loadData();
        showToast(`Successfully appended ${newTransactions.length} transactions!`, 'success');
      }
    } catch (error) {
      showToast('Failed to import data. Please check the file format.', 'error');
      console.error(error);
    }
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export / Import</h1>
        <p className="text-muted-foreground">Backup and restore your financial data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export all your financial data to an Excel file. The file will contain multiple sheets
              for different transaction types.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <div className="text-xs text-muted-foreground">
              <p>Total transactions: {transactions.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import data from an Excel file. Make sure the file format matches the export format.
            </p>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-2">Replace All Data</label>
                <div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file-replace"
                  />
                  <label htmlFor="import-file-replace">
                    <Button variant="outline" className="w-full cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File (Replace)
                    </Button>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Append New Data</label>
                <div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleAppendImport}
                    className="hidden"
                    id="import-file-append"
                  />
                  <label htmlFor="import-file-append">
                    <Button variant="outline" className="w-full cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File (Append)
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Always backup your data before importing</li>
            <li>The export file contains multiple sheets for different transaction types</li>
            <li>When replacing data, all existing transactions will be deleted</li>
            <li>When appending, duplicate entries (by ID) will be skipped</li>
            <li>Make sure the Excel file format matches the export format</li>
          </ul>
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
