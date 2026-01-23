'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Users, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [attendanceType, setAttendanceType] = useState<'student' | 'teacher'>('student');

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Mark and track student and teacher attendance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">285</div>
            <p className="text-xs text-muted-foreground">95% attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">15</div>
            <p className="text-xs text-muted-foreground">5% absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Tabs */}
      <Tabs value={attendanceType} onValueChange={(v) => setAttendanceType(v as any)}>
        <TabsList>
          <TabsTrigger value="student">Student Attendance</TabsTrigger>
          <TabsTrigger value="teacher">Teacher Attendance</TabsTrigger>
        </TabsList>

        {/* Student Attendance */}
        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{format(date, 'PPP')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Class</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes?.classes?.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Section</label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Placeholder Message */}
                <div className="border rounded-lg p-12 text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Attendance Module</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a class and section to mark attendance for {format(date, 'PPP')}
                  </p>
                  <Button disabled>
                    Load Students
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teacher Attendance */}
        <TabsContent value="teacher" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Teacher Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Teacher Attendance</h3>
                <p className="text-muted-foreground mb-4">
                  Mark attendance for all teachers for {format(date, 'PPP')}
                </p>
                <Button disabled>
                  Load Teachers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The attendance module is currently under development.
            The full functionality to mark, edit, and view detailed attendance reports will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
