'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubjectAssignment } from '@/components/teachers/SubjectAssignment';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = params.id as string;

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teachers/${teacherId}`);
      if (!res.ok) throw new Error('Failed to fetch teacher');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading teacher profile...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Teacher not found</p>
      </div>
    );
  }

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
    ACTIVE: 'success',
    ON_LEAVE: 'warning',
    RESIGNED: 'destructive',
    TERMINATED: 'destructive',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teachers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Teacher Profile</h1>
          <p className="text-muted-foreground">View and manage teacher details</p>
        </div>
        <Button asChild>
          <Link href={`/teachers/${teacherId}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              {teacher.photo ? (
                <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-3xl font-semibold">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {teacher.firstName} {teacher.lastName}
                  </h2>
                  <p className="text-muted-foreground">{teacher.employeeId}</p>
                </div>
                <Badge variant={statusColors[teacher.status]}>
                  {teacher.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.user.email}</span>
                </div>
                {teacher.user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{teacher.user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.qualification}</span>
                </div>
                {teacher.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{teacher.department.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {format(new Date(teacher.joiningDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Full Name:</span>
                  <span className="col-span-2 text-sm font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Date of Birth:</span>
                  <span className="col-span-2 text-sm font-medium">
                    {format(new Date(teacher.dateOfBirth), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Gender:</span>
                  <span className="col-span-2 text-sm font-medium">{teacher.gender}</span>
                </div>
                {teacher.bloodGroup && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Blood Group:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.bloodGroup}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teacher.address && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.address}</span>
                  </div>
                )}
                {teacher.city && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">City:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.city}</span>
                  </div>
                )}
                {teacher.state && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">State:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.state}</span>
                  </div>
                )}
                {teacher.emergencyContact && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Emergency:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.emergencyContact}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Employee ID:</span>
                  <span className="col-span-2 text-sm font-medium">{teacher.employeeId}</span>
                </div>
                {teacher.designation && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Designation:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.designation}</span>
                  </div>
                )}
                {teacher.specialization && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Specialization:</span>
                    <span className="col-span-2 text-sm font-medium">{teacher.specialization}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Experience:</span>
                  <span className="col-span-2 text-sm font-medium">{teacher.experience} years</span>
                </div>
              </CardContent>
            </Card>

            {/* Salary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Basic Salary:</span>
                  <span className="col-span-2 text-sm font-medium">
                    ₹{parseFloat(teacher.basicSalary).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Teacher Info */}
          {teacher.classTeacher && (
            <Card>
              <CardHeader>
                <CardTitle>Class Teacher</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{teacher.classTeacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.classTeacher.academicYear.name}
                    </p>
                  </div>
                  <Badge>Class Teacher</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectAssignment teacherId={teacherId} />
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.attendances?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No attendance records found
                </p>
              ) : (
                <div className="space-y-3">
                  {teacher.attendances?.map((attendance: any) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(attendance.date), 'MMM dd, yyyy')}
                        </p>
                        {attendance.remarks && (
                          <p className="text-sm text-muted-foreground">{attendance.remarks}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          attendance.status === 'PRESENT'
                            ? 'success'
                            : attendance.status === 'ABSENT'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {attendance.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.leaveRequests?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No leave requests found
                </p>
              ) : (
                <div className="space-y-3">
                  {teacher.leaveRequests?.map((leave: any) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{leave.leaveType.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(leave.startDate), 'MMM dd')} -{' '}
                          {format(new Date(leave.endDate), 'MMM dd, yyyy')} ({leave.days} days)
                        </p>
                        <p className="text-sm mt-1">{leave.reason}</p>
                      </div>
                      <Badge
                        variant={
                          leave.status === 'APPROVED'
                            ? 'success'
                            : leave.status === 'REJECTED'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
