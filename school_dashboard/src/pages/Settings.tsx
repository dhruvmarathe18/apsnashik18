import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppSettings } from '@/types';
import { Plus, X } from 'lucide-react';
import { seedTransactions, defaultSettings } from '@/utils/seedData';

export const Settings: React.FC = () => {
  const { settings, setSettings, loadDemoData, clearAllData, isDemoMode, toggleDemoMode } = useStore();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [newClass, setNewClass] = useState('');
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newBusRoute, setNewBusRoute] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newIncomeSource, setNewIncomeSource] = useState('');
  const [newPaymentMode, setNewPaymentMode] = useState('');

  const handleSave = async () => {
    await setSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const handleAddClass = () => {
    if (newClass && !localSettings.classes.includes(newClass)) {
      setLocalSettings({
        ...localSettings,
        classes: [...localSettings.classes, newClass],
      });
      setNewClass('');
    }
  };

  const handleRemoveClass = (classToRemove: string) => {
    setLocalSettings({
      ...localSettings,
      classes: localSettings.classes.filter((c) => c !== classToRemove),
    });
  };

  const handleAddBus = () => {
    if (newBusNumber && newBusRoute) {
      setLocalSettings({
        ...localSettings,
        buses: [
          ...localSettings.buses,
          { busNumber: newBusNumber, route: newBusRoute },
        ],
      });
      setNewBusNumber('');
      setNewBusRoute('');
    }
  };

  const handleRemoveBus = (busNumber: string) => {
    setLocalSettings({
      ...localSettings,
      buses: localSettings.buses.filter((b) => b.busNumber !== busNumber),
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !localSettings.expenseCategories.includes(newCategory as any)) {
      setLocalSettings({
        ...localSettings,
        expenseCategories: [...localSettings.expenseCategories, newCategory as any],
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setLocalSettings({
      ...localSettings,
      expenseCategories: localSettings.expenseCategories.filter((c) => c !== category),
    });
  };

  const handleAddIncomeSource = () => {
    if (newIncomeSource && !localSettings.incomeSources.includes(newIncomeSource as any)) {
      setLocalSettings({
        ...localSettings,
        incomeSources: [...localSettings.incomeSources, newIncomeSource as any],
      });
      setNewIncomeSource('');
    }
  };

  const handleRemoveIncomeSource = (source: string) => {
    setLocalSettings({
      ...localSettings,
      incomeSources: localSettings.incomeSources.filter((s) => s !== source),
    });
  };

  const handleAddPaymentMode = () => {
    if (newPaymentMode && !localSettings.paymentModes.includes(newPaymentMode as any)) {
      setLocalSettings({
        ...localSettings,
        paymentModes: [...localSettings.paymentModes, newPaymentMode as any],
      });
      setNewPaymentMode('');
    }
  };

  const handleRemovePaymentMode = (mode: string) => {
    setLocalSettings({
      ...localSettings,
      paymentModes: localSettings.paymentModes.filter((m) => m !== mode),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your school settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">School Name</label>
            <Input
              value={localSettings.schoolName}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, schoolName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Academic Year</label>
            <Input
              value={localSettings.academicYear}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, academicYear: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Academic Year Start Month</label>
            <Select
              value={String(localSettings.academicYearStartMonth || 4)}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  academicYearStartMonth: Number(e.target.value),
                })
              }
              options={[
                { value: '1', label: 'January' },
                { value: '2', label: 'February' },
                { value: '3', label: 'March' },
                { value: '4', label: 'April' },
                { value: '5', label: 'May' },
                { value: '6', label: 'June' },
                { value: '7', label: 'July' },
                { value: '8', label: 'August' },
                { value: '9', label: 'September' },
                { value: '10', label: 'October' },
                { value: '11', label: 'November' },
                { value: '12', label: 'December' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tuition Months Count</label>
            <Input
              type="number"
              value={localSettings.tuitionMonthsCount || 12}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  tuitionMonthsCount: Number(e.target.value) || 12,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <Input
              value={localSettings.currency}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, currency: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Enter class name"
              onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
            />
            <Button onClick={handleAddClass}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.classes.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md"
              >
                <span>{c}</span>
                <button
                  onClick={() => handleRemoveClass(c)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newBusNumber}
              onChange={(e) => setNewBusNumber(e.target.value)}
              placeholder="Bus Number"
            />
            <Input
              value={newBusRoute}
              onChange={(e) => setNewBusRoute(e.target.value)}
              placeholder="Route"
            />
          </div>
          <Button onClick={handleAddBus}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bus
          </Button>
          <div className="space-y-2">
            {localSettings.buses.map((bus) => (
              <div
                key={bus.busNumber}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div>
                  <span className="font-medium">{bus.busNumber}</span> - {bus.route}
                </div>
                <button
                  onClick={() => handleRemoveBus(bus.busNumber)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.expenseCategories.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md"
              >
                <span>{c}</span>
                <button
                  onClick={() => handleRemoveCategory(c)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newIncomeSource}
              onChange={(e) => setNewIncomeSource(e.target.value)}
              placeholder="Enter income source"
              onKeyPress={(e) => e.key === 'Enter' && handleAddIncomeSource()}
            />
            <Button onClick={handleAddIncomeSource}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.incomeSources.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md"
              >
                <span>{s}</span>
                <button
                  onClick={() => handleRemoveIncomeSource(s)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Modes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPaymentMode}
              onChange={(e) => setNewPaymentMode(e.target.value)}
              placeholder="Enter payment mode"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPaymentMode()}
            />
            <Button onClick={handleAddPaymentMode}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.paymentModes.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md"
              >
                <span>{m}</span>
                <button
                  onClick={() => handleRemovePaymentMode(m)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isDemoMode
              ? 'Demo mode is active. You can toggle it off to clear demo data.'
              : 'Load sample data to explore the app features.'}
          </p>
          <Button
            variant={isDemoMode ? 'destructive' : 'primary'}
            onClick={toggleDemoMode}
          >
            {isDemoMode ? 'Clear Demo Data' : 'Load Demo Data'}
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
