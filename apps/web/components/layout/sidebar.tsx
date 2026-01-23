'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  FileText,
  CreditCard,
  BookOpen,
  Bus,
  Building,
  Briefcase,
  Package,
  MessageSquare,
  BarChart,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { name: 'Students', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Teachers', href: '/dashboard/teachers', icon: GraduationCap, roles: ['ADMIN', 'PRINCIPAL'] },
  { name: 'Classes', href: '/dashboard/classes', icon: School, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Examinations', href: '/dashboard/exams', icon: FileText, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Fee Management', href: '/dashboard/fees', icon: CreditCard, roles: ['ADMIN', 'ACCOUNTANT', 'PRINCIPAL'] },
  { name: 'Library', href: '/dashboard/library', icon: BookOpen, roles: ['ADMIN', 'LIBRARIAN', 'TEACHER'] },
  { name: 'Transport', href: '/dashboard/transport', icon: Bus, roles: ['ADMIN', 'TRANSPORT_MANAGER'] },
  { name: 'Hostel', href: '/dashboard/hostel', icon: Building, roles: ['ADMIN', 'HOSTEL_WARDEN'] },
  { name: 'HR & Payroll', href: '/dashboard/hr', icon: Briefcase, roles: ['ADMIN', 'PRINCIPAL'] },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package, roles: ['ADMIN'] },
  { name: 'Communication', href: '/dashboard/communication', icon: MessageSquare, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart, roles: ['ADMIN', 'PRINCIPAL'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'SUPER_ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = session?.user?.role || 'STUDENT';

  const filteredNavigation = navigation.filter(
    (item) => item.roles.includes(userRole) || item.roles.includes('ALL')
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">EduNexus</span>
          </Link>
        )}
        {collapsed && (
          <GraduationCap className="h-8 w-8 text-primary mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', collapsed && 'mx-auto')}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="space-y-1 p-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
