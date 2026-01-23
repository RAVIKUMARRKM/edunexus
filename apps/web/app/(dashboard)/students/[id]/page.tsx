'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AttendanceMarker } from '@/components/students/AttendanceMarker';
import { useToast } from '@/components/ui/toast';

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student');
      return response.json();
    },
  });

  const handleMarkAttendance = async (attendanceData: any) => {
    try {
      const response = await fetch(`/api/students/${studentId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark attendance');
      }

      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      });

      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-96" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Student not found</p>
          <Link href="/students">
            <Button className="mt-4">Back to Students</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const student = data.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'secondary';
      case 'LEFT':
        return 'destructive';
      case 'GRADUATED':
        return 'default';
      case 'SUSPENDED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const calculateAge = (dob: Date | string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Profile</h1>
          <p className="text-muted-foreground">
            View and manage student information
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/students/${studentId}/edit`}>
            <Button>Edit Profile</Button>
          </Link>
          <Link href="/students">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                {student.user?.avatar || student.photo ? (
                  <img
                    src={student.user?.avatar || student.photo}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-4xl font-semibold">
                    {getInitials(student.firstName, student.lastName)}
                  </div>
                )}
              </Avatar>

              <h2 className="text-2xl font-bold text-center">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-muted-foreground">{student.admissionNo}</p>
              <Badge variant={getStatusColor(student.status) as any} className="mt-2">
                {student.status}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class</p>
                <p className="text-lg">
                  {student.class?.name} - {student.section?.name}
                </p>
              </div>

              {student.rollNo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                  <p className="text-lg">{student.rollNo}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-lg">
                  {new Date(student.dateOfBirth).toLocaleDateString()} ({calculateAge(student.dateOfBirth)} years)
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-lg capitalize">{student.gender.toLowerCase()}</p>
              </div>

              {student.bloodGroup && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                  <p className="text-lg">{student.bloodGroup}</p>
                </div>
              )}

              {student.user?.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg break-words">{student.user.email}</p>
                </div>
              )}

              {student.user?.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg">{student.user.phone}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Parent Information */}
          {student.parents && student.parents.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="space-y-4">
                {student.parents.map((sp: any) => (
                  <div key={sp.id} className="space-y-2">
                    {sp.parent.fatherName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Father</p>
                        <p className="text-md">{sp.parent.fatherName}</p>
                        {sp.parent.fatherPhone && (
                          <p className="text-sm text-muted-foreground">{sp.parent.fatherPhone}</p>
                        )}
                      </div>
                    )}
                    {sp.parent.motherName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Mother</p>
                        <p className="text-md">{sp.parent.motherName}</p>
                        {sp.parent.motherPhone && (
                          <p className="text-sm text-muted-foreground">{sp.parent.motherPhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.religion && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Religion</p>
                  <p>{student.religion}</p>
                </div>
              )}
              {student.caste && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Caste</p>
                  <p>{student.caste}</p>
                </div>
              )}
              {student.nationality && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                  <p>{student.nationality}</p>
                </div>
              )}
              {student.motherTongue && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mother Tongue</p>
                  <p>{student.motherTongue}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Address */}
          {(student.address || student.city || student.state) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="space-y-2">
                {student.address && <p>{student.address}</p>}
                <p>
                  {[student.city, student.state, student.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </Card>
          )}

          {/* Attendance Marker */}
          <AttendanceMarker
            studentId={studentId}
            onSubmit={handleMarkAttendance}
          />

          {/* Recent Attendance */}
          {student.attendances && student.attendances.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Attendance</h3>
              <div className="space-y-2">
                {student.attendances.slice(0, 10).map((attendance: any) => (
                  <div
                    key={attendance.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <span>{new Date(attendance.date).toLocaleDateString()}</span>
                    <Badge
                      variant={
                        attendance.status === 'PRESENT'
                          ? 'success'
                          : attendance.status === 'ABSENT'
                          ? 'destructive'
                          : attendance.status === 'LATE'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {attendance.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Transport Information */}
          {student.transportAllocation && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Transport Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Route</p>
                  <p>{student.transportAllocation.route.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stop</p>
                  <p>{student.transportAllocation.stop.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pickup Type</p>
                  <p>{student.transportAllocation.pickupType}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Hostel Information */}
          {student.hostelAllocation && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hostel Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Building</p>
                  <p>{student.hostelAllocation.room.building.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Room</p>
                  <p>{student.hostelAllocation.room.roomNo}</p>
                </div>
                {student.hostelAllocation.bedNo && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bed</p>
                    <p>{student.hostelAllocation.bedNo}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
