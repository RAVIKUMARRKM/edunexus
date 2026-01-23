'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendancePercentage: number;
  totalFeeCollected: number;
  totalPendingFees: number;
}

interface Activity {
  type: string;
  title: string;
  description: string;
  time: string;
}

interface ChartData {
  attendanceTrend: Array<{ date: string; present: number; absent: number }>;
  feeCollection: Array<{ month: string; collected: number; pending: number }>;
  classDistribution: Array<{ class: string; students: number }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/charts'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setActivities(statsData.recentActivities || []);
      }

      if (chartsRes.ok) {
        const chartsData = await chartsRes.json();
        setChartData(chartsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active students in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active teaching staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.attendancePercentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Student attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalFeeCollected?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month's collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.attendanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Present"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Absent"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Collection (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.feeCollection || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/students/new">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
              <Link href="/attendance">
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </Link>
              <Link href="/communication/notices/new">
                <Button className="w-full" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notice
                </Button>
              </Link>
              <Link href="/fees">
                <Button className="w-full" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Collect Fee
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Pending Tasks
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">Pending Fee Approvals</span>
                  <Badge variant="warning">3</Badge>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">Leave Requests</span>
                  <Badge variant="warning">5</Badge>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
