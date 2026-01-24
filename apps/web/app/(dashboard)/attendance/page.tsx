'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarCheck,
  FileText,
  TrendingUp,
  Users,
  ArrowRight,
  Check,
  X,
  Clock,
  BarChart3,
  UserCheck,
  Download,
  Bell,
} from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Mark, track, and analyze student attendance
        </p>
      </div>

      {/* Student Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance
          </CardTitle>
          <CardDescription>
            Manage and track student attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/attendance/mark">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CalendarCheck className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="mt-4">Mark Attendance</CardTitle>
                  <CardDescription>
                    Record daily attendance for students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <span>
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      Start Marking
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/attendance/reports">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="mt-4">Reports</CardTitle>
                  <CardDescription>
                    View detailed attendance reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <FileText className="mr-2 h-4 w-4" />
                      View Reports
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/attendance/trends">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="mt-4">Trends</CardTitle>
                  <CardDescription>
                    Analyze attendance patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Trends
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Teacher Attendance
          </CardTitle>
          <CardDescription>
            Manage and track staff attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/attendance/teachers/mark">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <UserCheck className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="mt-4">Mark Teacher Attendance</CardTitle>
                  <CardDescription>
                    Record daily attendance for teachers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <span>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Start Marking
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/attendance/teachers/reports">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="mt-4">Teacher Reports</CardTitle>
                  <CardDescription>
                    View staff attendance reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <FileText className="mr-2 h-4 w-4" />
                      View Reports
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>
              Essential attendance tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Multiple Status Options</p>
                <p className="text-sm text-muted-foreground">
                  Present, Absent, Late, Half-Day, Leave
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Quick Marking</p>
                <p className="text-sm text-muted-foreground">
                  Bulk mark with one click
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Edit Anytime</p>
                <p className="text-sm text-muted-foreground">
                  Update any previous records
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Time Tracking</p>
                <p className="text-sm text-muted-foreground">
                  In/Out times for teachers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>
              Detailed insights and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Comprehensive Reports</p>
                <p className="text-sm text-muted-foreground">
                  Overview, class-wise, defaulters
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Visual Trends</p>
                <p className="text-sm text-muted-foreground">
                  Charts and graphs for patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Performance Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Monthly trends and comparisons
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Individual Profiles</p>
                <p className="text-sm text-muted-foreground">
                  Attendance on student profiles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>
              Export and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">CSV Export</p>
                <p className="text-sm text-muted-foreground">
                  Download reports in Excel format
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify parents of absences
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Staff Attendance</p>
                <p className="text-sm text-muted-foreground">
                  Track teacher attendance too
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Date Range Filters</p>
                <p className="text-sm text-muted-foreground">
                  Custom period reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200 mb-1">
                Attendance System Active
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                The complete attendance management system is now active. You can mark daily attendance,
                view detailed reports, and track student attendance percentages with ease.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
