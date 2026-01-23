'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Bus,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Receipt,
  TrendingUp,
  UserCog,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  ImageIcon
} from 'lucide-react'
import { ModeToggle } from '@/components/ui/ModeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('adminAuth')
      if (authToken !== 'true') {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Organized navigation with sections
  const navigationSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Students & Fees',
      items: [
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Fees Collection', href: '/admin/fees', icon: GraduationCap },
        { name: 'Fee Ledger', href: '/admin/fee-ledger', icon: BookOpen },
        { name: 'Fee Due Reports', href: '/admin/fee-due-reports', icon: FileText },
      ]
    },
    {
      title: 'Financial',
      items: [
        { name: 'Expenses', href: '/admin/expenses', icon: Receipt },
        { name: 'Other Income', href: '/admin/income', icon: TrendingUp },
        { name: 'Salaries', href: '/admin/salaries', icon: UserCog },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
      ]
    },
    {
      title: 'Transport',
      items: [
        { name: 'Transport', href: '/admin/transport', icon: Bus },
        { name: 'Bus Management', href: '/admin/bus', icon: Bus },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Media', href: '/admin/media', icon: ImageIcon },
        { name: 'Export/Import', href: '/admin/export-import', icon: Download },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('loginTime')
    router.push('/admin/login')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') || 'Admin' : 'Admin'

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`fixed inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Mobile Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-border/20 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img
                  src="/images/aps.jpg"
                  alt="APS Nashik"
                  className="w-8 h-8 rounded"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">APS Admin</span>
                <span className="text-xs text-white/80">School Management</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6 min-h-0">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                              : 'text-text hover:bg-surface-3 hover:text-text'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Footer - Fixed at bottom */}
          <div className="border-t border-border/60 p-4 bg-muted/30 flex-shrink-0">
            <div className="px-3 py-2 mb-3">
              <p className="text-xs text-text-muted mb-1">Logged in as</p>
              <p className="text-sm font-medium text-text truncate">{adminEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
      }`}>
        <div className="flex flex-col h-full bg-surface-1 border-r border-border/20 shadow-sm relative">
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 z-10 w-6 h-6 bg-surface border-2 border-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-muted hover:border-primary transition-all duration-200 group"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            )}
          </button>

          {/* Desktop Header - Fixed */}
          <div className={`flex h-20 items-center border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 flex-shrink-0 ${
            sidebarCollapsed ? 'px-4 justify-center' : 'px-6'
          }`}>
            {sidebarCollapsed ? (
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <img
                  src="/images/aps.jpg"
                  alt="APS Nashik"
                  className="w-8 h-8 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <img
                    src="/images/aps.jpg"
                    alt="APS Nashik"
                    className="w-10 h-10 rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold text-white block">APS Admin</span>
                  <span className="text-xs text-white/80">School Management</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 py-6 min-h-0" style={{ paddingLeft: sidebarCollapsed ? '0.5rem' : '1rem', paddingRight: sidebarCollapsed ? '0.5rem' : '1rem' }}>
            <div className="space-y-6">
              {navigationSections.map((section) => (
                <div key={section.title}>
                  {!sidebarCollapsed && (
                    <h3 className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 transition-opacity duration-300">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          title={sidebarCollapsed ? item.name : ''}
                          className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                            sidebarCollapsed ? 'justify-center' : ''
                          } ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 transform scale-[1.02]'
                              : 'text-text hover:bg-muted/60 hover:text-text hover:translate-x-1'
                          }`}
                        >
                          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                              sidebarCollapsed ? '' : 'mr-3'
                            } ${
                              isActive 
                                ? 'text-white' 
                                : 'text-text-muted group-hover:text-primary'
                            }`} />
                            {!sidebarCollapsed && (
                              <span className="font-medium transition-opacity duration-300">{item.name}</span>
                            )}
                          </div>
                          {!sidebarCollapsed && isActive && <ChevronRight className="w-4 h-4 text-white" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Desktop Footer - Fixed at bottom */}
          <div className={`border-t border-border/20 bg-surface-2/50 transition-all duration-300 flex-shrink-0 ${
            sidebarCollapsed ? 'p-3' : 'p-4'
          }`}>
            {!sidebarCollapsed && (
              <div className="px-3 py-2 mb-3 rounded-lg bg-card border border-border/60 transition-opacity duration-300">
                <p className="text-xs text-text-muted mb-1">Logged in as</p>
                <p className="text-sm font-semibold text-text truncate">{adminEmail}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Logout' : ''}
              className={`flex items-center justify-center py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 border border-destructive/20 hover:border-destructive/40 ${
                sidebarCollapsed ? 'w-full px-0' : 'w-full px-3'
              }`}
            >
              <LogOut className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-border/20 bg-surface-1/95 backdrop-blur-sm px-3 sm:px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-x-2">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-text lg:hidden hover:bg-surface-3 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="hidden lg:flex -m-2.5 p-2.5 text-text hover:bg-muted/60 rounded-lg transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border/60" />
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden md:block text-xs sm:text-sm text-text font-medium">
                  Welcome, <span className="text-primary">{adminEmail.split('@')[0]}</span>
                </span>
                <ModeToggle />
                <Link
                  href="/"
                  className="text-xs sm:text-sm text-primary hover:opacity-80 flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-surface-3 transition-colors font-medium"
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View Site</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
