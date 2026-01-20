import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  GraduationCap,
  Bus,
  UserCog,
  Receipt,
  TrendingUp,
  FileText,
  Download,
  Upload,
  Settings,
  BookOpen,
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/add-entry', icon: PlusCircle, label: 'Add Entry' },
  { path: '/students', icon: Users, label: 'Students' },
  { path: '/fee-ledger', icon: BookOpen, label: 'Student Fee Ledger' },
  { path: '/fee-due-reports', icon: FileText, label: 'Fee Due Reports' },
  { path: '/fees', icon: GraduationCap, label: 'Fees Collection' },
  { path: '/transport', icon: Bus, label: 'Transport' },
  { path: '/salaries', icon: UserCog, label: 'Salaries' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/income', icon: TrendingUp, label: 'Other Income' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/export-import', icon: Download, label: 'Export/Import' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">School Finance</h1>
        <p className="text-sm text-muted-foreground">Tracker</p>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/students' && location.pathname.startsWith('/students'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
