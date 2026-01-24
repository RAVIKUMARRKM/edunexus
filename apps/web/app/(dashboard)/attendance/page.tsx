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

      {/* Quick Actions */}
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
                Record daily attendance for students by class and section
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
              <CardTitle className="mt-4">Attendance Reports</CardTitle>
              <CardDescription>
                View detailed reports and analytics on student attendance
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
          <Link href="/attendance/reports">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="mt-4">Low Attendance</CardTitle>
              <CardDescription>
                Identify students with attendance below threshold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Defaulters
                </span>
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Features</CardTitle>
            <CardDescription>
              Comprehensive attendance tracking system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Multiple Status Options</p>
                <p className="text-sm text-muted-foreground">
                  Mark as Present, Absent, Late, Half-Day, or Leave
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Quick Marking</p>
                <p className="text-sm text-muted-foreground">
                  Bulk mark all present with one click, then adjust individually
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Edit Anytime</p>
                <p className="text-sm text-muted-foreground">
                  View and edit attendance records for any previous date
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Add Remarks</p>
                <p className="text-sm text-muted-foreground">
                  Optional notes for each student's attendance record
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporting Features</CardTitle>
            <CardDescription>
              Detailed analytics and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Class-wise Reports</p>
                <p className="text-sm text-muted-foreground">
                  View attendance summary for entire class with percentages
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Student-wise Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Individual student attendance history and trends
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Defaulters List</p>
                <p className="text-sm text-muted-foreground">
                  Students with attendance below 75% threshold
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Date Range Reports</p>
                <p className="text-sm text-muted-foreground">
                  Generate reports for any custom date range
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
