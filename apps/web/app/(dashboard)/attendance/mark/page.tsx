'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Check,
  X,
  Clock,
  Coffee,
  Plane,
  Loader2,
  Users,
  Save,
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  rollNo: string;
  photo?: string;
  attendance?: {
    status: string;
    remarks?: string;
  } | null;
}

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

export default function MarkAttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass]);

  // Fetch students when class, section, or date changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, selectedSection, date]);

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

  const fetchStudents = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        classId: selectedClass,
        date: date.toISOString(),
      });
      if (selectedSection && selectedSection !== 'all') params.append('sectionId', selectedSection);

      const res = await fetch(`/api/attendance/students?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);

        // Initialize attendance state from existing records
        const initialAttendance: Record<string, { status: AttendanceStatus; remarks: string }> = {};
        data.students.forEach((student: Student) => {
          if (student.attendance) {
            initialAttendance[student.id] = {
              status: student.attendance.status as AttendanceStatus,
              remarks: student.attendance.remarks || '',
            };
          }
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { status, remarks: prev[studentId]?.remarks || '' },
    }));
  };

  const updateRemarks = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'PRESENT',
        remarks,
      },
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach((student) => {
      allPresent[student.id] = { status: 'PRESENT', remarks: '' };
    });
    setAttendance(allPresent);
    toast.success('Marked all students as present');
  };

  const saveAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setSaving(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks || null,
      }));

      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          attendanceRecords,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        fetchStudents(); // Refresh to show saved data
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save attendance');
      }
    } catch (error) {
      toast.error('An error occurred while saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const statusIcons = {
    PRESENT: { icon: Check, color: 'text-green-600', bg: 'bg-green-100' },
    ABSENT: { icon: X, color: 'text-red-600', bg: 'bg-red-100' },
    LATE: { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    HALF_DAY: { icon: Coffee, color: 'text-blue-600', bg: 'bg-blue-100' },
    LEAVE: { icon: Plane, color: 'text-purple-600', bg: 'bg-purple-100' },
  };

  const getStats = () => {
    const total = students.length;
    const marked = Object.keys(attendance).length;
    const present = Object.values(attendance).filter(a => a.status === 'PRESENT').length;
    const absent = Object.values(attendance).filter(a => a.status === 'ABSENT').length;
    return { total, marked, present, absent };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Record student attendance for {format(date, 'PPP')}
          </p>
        </div>
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Marked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.marked}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.marked / stats.total) * 100).toFixed(0) : 0}% complete
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class & Date</CardTitle>
          <CardDescription>Choose the class, section, and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Date</Label>
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section (Optional)</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button
                onClick={markAllPresent}
                variant="outline"
                className="w-full"
                disabled={students.length === 0}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark All Present
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-2">Loading students...</p>
          </CardContent>
        </Card>
      ) : students.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Students ({students.length})</CardTitle>
              <Button onClick={saveAttendance} disabled={saving || Object.keys(attendance).length === 0}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => {
                const studentAttendance = attendance[student.id];
                const StatusIcon = studentAttendance
                  ? statusIcons[studentAttendance.status].icon
                  : Users;
                const statusColor = studentAttendance
                  ? statusIcons[studentAttendance.status].color
                  : 'text-muted-foreground';

                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {student.rollNo && <span className="text-muted-foreground mr-2">{student.rollNo}.</span>}
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.admissionNo}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {(Object.keys(statusIcons) as AttendanceStatus[]).map((status) => {
                        const Icon = statusIcons[status].icon;
                        const isSelected = studentAttendance?.status === status;
                        return (
                          <Button
                            key={status}
                            size="sm"
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, status)}
                            className={cn(
                              'h-8 w-8 p-0',
                              isSelected && statusIcons[status].bg
                            )}
                          >
                            <Icon className={cn('h-4 w-4', isSelected && statusIcons[status].color)} />
                          </Button>
                        );
                      })}
                    </div>

                    {studentAttendance && (
                      <Input
                        placeholder="Remarks (optional)"
                        value={studentAttendance.remarks}
                        onChange={(e) => updateRemarks(student.id, e.target.value)}
                        className="w-48"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : selectedClass ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground">
              No active students in the selected class{selectedSection && ' and section'}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get Started</h3>
            <p className="text-muted-foreground">
              Select a class above to start marking attendance
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
