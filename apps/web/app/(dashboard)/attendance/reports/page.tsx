'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Download,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function AttendanceReportsPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(1))); // First day of month
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Report data
  const [classReport, setClassReport] = useState<any>(null);
  const [defaultersReport, setDefaultersReport] = useState<any>(null);
  const [overviewReport, setOverviewReport] = useState<any>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async () => {
    if (!selectedClass) return;
    try {
      const res = await fetch(`/api/classes/${selectedClass}/sections`);
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchClassReport = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'class',
        classId: selectedClass,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (selectedSection) params.append('sectionId', selectedSection);

      const res = await fetch(`/api/attendance/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setClassReport(data);
      } else {
        toast.error('Failed to load class report');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultersReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'defaulters',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        threshold: '75',
      });
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedSection) params.append('sectionId', selectedSection);

      const res = await fetch(`/api/attendance/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDefaultersReport(data);
      } else {
        toast.error('Failed to load defaulters report');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'overview',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedSection) params.append('sectionId', selectedSection);

      const res = await fetch(`/api/attendance/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOverviewReport(data);
      } else {
        toast.error('Failed to load overview');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return 'default';
    if (percentage >= 75) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground">
            View detailed attendance analytics and reports
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date range and class to generate reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Class (Optional)</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Section (Optional)</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <TabsTrigger value="class" onClick={fetchClassReport}>
            <Users className="mr-2 h-4 w-4" />
            Class Report
          </TabsTrigger>
          <TabsTrigger value="defaulters" onClick={fetchDefaultersReport}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Low Attendance
          </TabsTrigger>
        </TabsList>

        {/* Overview Report */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Overview</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <CardDescription>
                {format(startDate, 'PPP')} to {format(endDate, 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : overviewReport ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{overviewReport.overview.totalRecords}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {overviewReport.overview.present}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {overviewReport.overview.absent}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          {overviewReport.overview.late}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={cn('text-2xl font-bold', getAttendanceColor(parseFloat(overviewReport.overview.attendancePercentage)))}>
                          {overviewReport.overview.attendancePercentage}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Click "Overview" tab to load report
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Report */}
        <TabsContent value="class">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class-wise Attendance Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : classReport ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Admission No</TableHead>
                        <TableHead className="text-right">Total Days</TableHead>
                        <TableHead className="text-right">Present</TableHead>
                        <TableHead className="text-right">Absent</TableHead>
                        <TableHead className="text-right">Attendance %</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classReport.students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No data available for the selected criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        classReport.students.map((student: any) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.rollNo || '-'}</TableCell>
                            <TableCell className="font-medium">
                              {student.firstName} {student.lastName}
                            </TableCell>
                            <TableCell>{student.admissionNo}</TableCell>
                            <TableCell className="text-right">{student.totalDays}</TableCell>
                            <TableCell className="text-right text-green-600">{student.present}</TableCell>
                            <TableCell className="text-right text-red-600">{student.absent}</TableCell>
                            <TableCell className="text-right">
                              <span className={getAttendanceColor(student.attendancePercentage)}>
                                {student.attendancePercentage}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getAttendanceBadge(student.attendancePercentage)}>
                                {student.attendancePercentage >= 90 ? 'Excellent' :
                                 student.attendancePercentage >= 75 ? 'Good' : 'Poor'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Select a class and click "Class Report" tab to load report
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaulters Report */}
        <TabsContent value="defaulters">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Low Attendance Students (&lt; 75%)</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : defaultersReport ? (
                <div className="space-y-4">
                  {defaultersReport.defaulters.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 p-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                            {defaultersReport.defaulters.length} students with low attendance
                          </h3>
                          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                            These students have attendance below {defaultersReport.threshold}% and may require intervention.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="text-right">Present</TableHead>
                          <TableHead className="text-right">Absent</TableHead>
                          <TableHead className="text-right">Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {defaultersReport.defaulters.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                                <p className="font-medium">Great! No students with low attendance</p>
                                <p className="text-sm text-muted-foreground">
                                  All students have attendance above {defaultersReport.threshold}%
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          defaultersReport.defaulters.map((student: any) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {student.admissionNo}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {student.class?.name}
                                {student.section && ` - ${student.section.name}`}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {student.user?.phone && <p>{student.user.phone}</p>}
                                  {student.user?.email && (
                                    <p className="text-muted-foreground">{student.user.email}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {student.present}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                {student.absent}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-2 justify-end">
                                  <Progress
                                    value={student.attendancePercentage}
                                    className="w-16 h-2"
                                  />
                                  <span className={cn('font-medium', getAttendanceColor(student.attendancePercentage))}>
                                    {student.attendancePercentage}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Click "Low Attendance" tab to load report
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
