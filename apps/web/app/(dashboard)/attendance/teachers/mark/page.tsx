'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Check,
  X,
  Clock,
  Coffee,
  Plane,
  Save,
  CheckCircle2,
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

interface Teacher {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  attendance: {
    status: AttendanceStatus;
    inTime?: string;
    outTime?: string;
    remarks?: string;
  } | null;
}

export default function MarkTeacherAttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (date) {
      fetchTeachers();
    }
  }, [date, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: date.toISOString(),
      });
      if (selectedDepartment && selectedDepartment !== 'all') params.append('departmentId', selectedDepartment);

      const res = await fetch(`/api/attendance/teachers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.teachers || []);

        // Pre-fill attendance from existing records
        const initialAttendance: Record<string, any> = {};
        data.teachers.forEach((teacher: Teacher) => {
          if (teacher.attendance) {
            initialAttendance[teacher.id] = {
              status: teacher.attendance.status,
              inTime: teacher.attendance.inTime || '',
              outTime: teacher.attendance.outTime || '',
              remarks: teacher.attendance.remarks || '',
            };
          }
        });
        setAttendance(initialAttendance);
      } else {
        toast.error('Failed to load teachers');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (teacherId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [teacherId]: {
        status,
        inTime: prev[teacherId]?.inTime || '',
        outTime: prev[teacherId]?.outTime || '',
        remarks: prev[teacherId]?.remarks || '',
      },
    }));
  };

  const updateTime = (teacherId: string, field: 'inTime' | 'outTime', value: string) => {
    setAttendance((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [field]: value,
      },
    }));
  };

  const updateRemarks = (teacherId: string, value: string) => {
    setAttendance((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        remarks: value,
      },
    }));
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, any> = {};
    teachers.forEach((teacher) => {
      newAttendance[teacher.id] = {
        status: 'PRESENT',
        inTime: attendance[teacher.id]?.inTime || '',
        outTime: attendance[teacher.id]?.outTime || '',
        remarks: attendance[teacher.id]?.remarks || '',
      };
    });
    setAttendance(newAttendance);
    toast.success('All teachers marked as present');
  };

  const handleSave = async () => {
    const records = Object.entries(attendance)
      .filter(([_, data]) => data?.status)
      .map(([teacherId, data]) => ({
        teacherId,
        status: data.status,
        inTime: data.inTime || null,
        outTime: data.outTime || null,
        remarks: data.remarks || null,
      }));

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one teacher');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/attendance/teachers/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          records,
        }),
      });

      if (res.ok) {
        toast.success('Attendance saved successfully');
        fetchTeachers(); // Refresh data
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save attendance');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return <Check className="h-4 w-4" />;
      case 'ABSENT':
        return <X className="h-4 w-4" />;
      case 'LATE':
        return <Clock className="h-4 w-4" />;
      case 'HALF_DAY':
        return <Coffee className="h-4 w-4" />;
      case 'LEAVE':
        return <Plane className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-500 hover:bg-green-600';
      case 'ABSENT':
        return 'bg-red-500 hover:bg-red-600';
      case 'LATE':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'HALF_DAY':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'LEAVE':
        return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  const stats = {
    total: teachers.length,
    present: Object.values(attendance).filter((a) => a?.status === 'PRESENT').length,
    absent: Object.values(attendance).filter((a) => a?.status === 'ABSENT').length,
    late: Object.values(attendance).filter((a) => a?.status === 'LATE').length,
    halfDay: Object.values(attendance).filter((a) => a?.status === 'HALF_DAY').length,
    leave: Object.values(attendance).filter((a) => a?.status === 'LEAVE').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mark Teacher Attendance</h1>
        <p className="text-muted-foreground">
          Record daily attendance for teaching staff
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date & Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department (Optional)</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button onClick={markAllPresent} variant="outline" className="w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark All Present
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {teachers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600">Half Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.halfDay}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-600">Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.leave}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Marking */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teacher Attendance</CardTitle>
              <CardDescription>
                {loading ? 'Loading teachers...' : `${teachers.length} teachers found`}
              </CardDescription>
            </div>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No teachers found. Please select a different date or department.
            </div>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.employeeId} • {teacher.department}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE'] as AttendanceStatus[]).map(
                      (status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={attendance[teacher.id]?.status === status ? 'default' : 'outline'}
                          className={cn(
                            attendance[teacher.id]?.status === status && getStatusColor(status)
                          )}
                          onClick={() => markAttendance(teacher.id, status)}
                        >
                          {getStatusIcon(status)}
                        </Button>
                      )
                    )}
                  </div>

                  {attendance[teacher.id]?.status && (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="time"
                        placeholder="In Time"
                        value={attendance[teacher.id]?.inTime || ''}
                        onChange={(e) => updateTime(teacher.id, 'inTime', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="time"
                        placeholder="Out Time"
                        value={attendance[teacher.id]?.outTime || ''}
                        onChange={(e) => updateTime(teacher.id, 'outTime', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        placeholder="Remarks"
                        value={attendance[teacher.id]?.remarks || ''}
                        onChange={(e) => updateRemarks(teacher.id, e.target.value)}
                        className="w-48"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
