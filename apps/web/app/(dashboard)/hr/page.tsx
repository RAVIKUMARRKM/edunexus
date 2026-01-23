'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  pendingLeaves: number;
  monthlySalary: number;
}

export default function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    activeStaff: 0,
    pendingLeaves: 0,
    monthlySalary: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [staffRes, leaveRes] = await Promise.all([
        fetch('/api/hr/staff'),
        fetch('/api/hr/leave?status=PENDING'),
      ]);

      const staff = await staffRes.json();
      const leaves = await leaveRes.json();

      const activeStaff = staff.filter((s: any) => s.status === 'ACTIVE');
      const totalSalary = activeStaff.reduce(
        (sum: number, s: any) => sum + parseFloat(s.basicSalary),
        0
      );

      setStats({
        totalStaff: staff.length,
        activeStaff: activeStaff.length,
        pendingLeaves: leaves.length,
        monthlySalary: totalSalary,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'text-yellow-500',
    },
    {
      title: 'Monthly Salary',
      value: `₹${stats.monthlySalary.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HR & Payroll Dashboard</h1>
        <p className="text-gray-500">Manage staff, leave requests, and payroll</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/hr/staff"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Manage Staff</div>
              <div className="text-sm text-gray-500">View and manage staff members</div>
            </a>
            <a
              href="/hr/leave"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Leave Requests</div>
              <div className="text-sm text-gray-500">Approve or reject leave requests</div>
            </a>
            <a
              href="/hr/payroll"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Payroll Processing</div>
              <div className="text-sm text-gray-500">Process monthly salaries</div>
            </a>
            <a
              href="/hr/departments"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Departments</div>
              <div className="text-sm text-gray-500">Manage departments</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Recent leave requests and payroll activities will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
