'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  Users,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-utils';

export default function TeacherAttendanceReportsPage() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [overviewData, setOverviewData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [defaultersData, setDefaultersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'overview',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const res = await fetch(`/api/attendance/teachers/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
      } else {
        toast.error('Failed to load overview');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'summary',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const res = await fetch(`/api/attendance/teachers/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      } else {
        toast.error('Failed to load summary');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaulters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'defaulters',
        threshold: '75',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const res = await fetch(`/api/attendance/teachers/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDefaultersData(data);
      } else {
        toast.error('Failed to load defaulters');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportOverview = () => {
    if (!overviewData) {
      toast.error('No data to export');
      return;
    }
    const data = [
      { Metric: 'Total Records', Value: overviewData.totalRecords },
      { Metric: 'Present', Value: overviewData.present },
      { Metric: 'Absent', Value: overviewData.absent },
      { Metric: 'Late', Value: overviewData.late },
      { Metric: 'Half Day', Value: overviewData.halfDay },
      { Metric: 'Leave', Value: overviewData.leave },
      { Metric: 'Attendance %', Value: `${overviewData.attendancePercentage}%` },
    ];
    exportToCSV(data, 'teacher-attendance-overview');
    toast.success('Overview exported successfully');
  };

  const exportSummary = () => {
    if (!summaryData || !summaryData.teachers) {
      toast.error('No data to export');
      return;
    }
    const data = summaryData.teachers.map((teacher: any) => ({
      'Employee ID': teacher.employeeId,
      'Teacher Name': teacher.name,
      'Department': teacher.department,
      'Email': teacher.email,
      'Total Days': teacher.totalDays,
      'Present': teacher.present,
      'Absent': teacher.absent,
      'Late': teacher.late,
      'Half Day': teacher.halfDay,
      'Leave': teacher.leave,
      'Attendance %': `${teacher.attendancePercentage}%`,
    }));
    exportToCSV(data, 'teacher-attendance-summary');
    toast.success('Summary exported successfully');
  };

  const exportDefaulters = () => {
    if (!defaultersData || !defaultersData.defaulters) {
      toast.error('No data to export');
      return;
    }
    const data = defaultersData.defaulters.map((teacher: any) => ({
      'Employee ID': teacher.employeeId,
      'Teacher Name': teacher.name,
      'Department': teacher.department,
      'Email': teacher.email,
      'Phone': teacher.phone || '-',
      'Total Days': teacher.totalDays,
      'Present': teacher.present,
      'Absent': teacher.absent,
      'Attendance %': `${teacher.attendancePercentage}%`,
    }));
    exportToCSV(data, 'teacher-attendance-defaulters');
    toast.success('Defaulters report exported successfully');
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge className="bg-green-500">Excellent</Badge>;
    } else if (percentage >= 75) {
      return <Badge className="bg-yellow-500">Good</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-orange-500">Average</Badge>;
    } else {
      return <Badge className="bg-red-500">Poor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Attendance Reports</h1>
        <p className="text-muted-foreground">
          View comprehensive attendance reports for teaching staff
        </p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={fetchOverview}>
            <FileText className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="summary" onClick={fetchSummary}>
            <Users className="mr-2 h-4 w-4" />
            Teacher-wise Summary
          </TabsTrigger>
          <TabsTrigger value="defaulters" onClick={fetchDefaulters}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Low Attendance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>
                    Overall statistics for the selected period
                  </CardDescription>
                </div>
                <Button onClick={exportOverview} variant="outline" disabled={!overviewData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : overviewData ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewData.totalRecords}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {overviewData.attendancePercentage}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {overviewData.present}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {overviewData.absent}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {overviewData.late}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {overviewData.leave}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click the Overview tab to load data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teacher-wise Attendance Summary</CardTitle>
                  <CardDescription>
                    Individual attendance records for all teachers
                  </CardDescription>
                </div>
                <Button onClick={exportSummary} variant="outline" disabled={!summaryData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : summaryData?.teachers ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-4 pb-2 border-b font-medium text-sm">
                    <div>Employee ID</div>
                    <div>Name</div>
                    <div>Department</div>
                    <div className="text-right">Total Days</div>
                    <div className="text-right">Present</div>
                    <div className="text-right">Absent</div>
                    <div className="text-right">Attendance</div>
                  </div>
                  {summaryData.teachers.map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="grid grid-cols-7 gap-4 py-2 border-b last:border-0"
                    >
                      <div className="text-sm">{teacher.employeeId}</div>
                      <div className="text-sm font-medium">{teacher.name}</div>
                      <div className="text-sm text-muted-foreground">{teacher.department}</div>
                      <div className="text-sm text-right">{teacher.totalDays}</div>
                      <div className="text-sm text-right text-green-600">{teacher.present}</div>
                      <div className="text-sm text-right text-red-600">{teacher.absent}</div>
                      <div className="text-sm text-right flex items-center justify-end gap-2">
                        <span className="font-medium">{teacher.attendancePercentage}%</span>
                        {getAttendanceBadge(teacher.attendancePercentage)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click the Teacher-wise Summary tab to load data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaulters Tab */}
        <TabsContent value="defaulters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Low Attendance (&lt;75%)</CardTitle>
                  <CardDescription>
                    Teachers with attendance below the threshold
                  </CardDescription>
                </div>
                <Button onClick={exportDefaulters} variant="outline" disabled={!defaultersData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : defaultersData?.defaulters ? (
                defaultersData.defaulters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No teachers with low attendance found
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-4 pb-2 border-b font-medium text-sm">
                      <div>Employee ID</div>
                      <div>Name</div>
                      <div>Department</div>
                      <div className="text-right">Total Days</div>
                      <div className="text-right">Absent</div>
                      <div className="text-right">Attendance</div>
                    </div>
                    {defaultersData.defaulters.map((teacher: any) => (
                      <div
                        key={teacher.id}
                        className="grid grid-cols-6 gap-4 py-3 border-b last:border-0 hover:bg-muted/50"
                      >
                        <div className="text-sm">{teacher.employeeId}</div>
                        <div>
                          <div className="text-sm font-medium">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">{teacher.email}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{teacher.department}</div>
                        <div className="text-sm text-right">{teacher.totalDays}</div>
                        <div className="text-sm text-right text-red-600">{teacher.absent}</div>
                        <div className="text-sm text-right">
                          <Badge className="bg-red-500">{teacher.attendancePercentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click the Low Attendance tab to load data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
