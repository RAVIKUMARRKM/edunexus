'use client';

import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StudentCardProps {
  student: {
    id: string;
    admissionNo: string;
    rollNo?: string | null;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date | string;
    bloodGroup?: string | null;
    status: string;
    user?: {
      email: string;
      phone?: string | null;
      avatar?: string | null;
    };
    class?: {
      name: string;
    };
    section?: {
      name: string;
    };
    photo?: string | null;
  };
}

export function StudentCard({ student }: StudentCardProps) {
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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-20 w-20">
            {student.user?.avatar || student.photo ? (
              <img
                src={student.user?.avatar || student.photo || ''}
                alt={`${student.firstName} ${student.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xl font-semibold">
                {getInitials(student.firstName, student.lastName)}
              </div>
            )}
          </Avatar>
          <Badge
            variant={getStatusColor(student.status) as any}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs"
          >
            {student.status}
          </Badge>
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold truncate">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {student.admissionNo} {student.rollNo && `• Roll No: ${student.rollNo}`}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Class:</span>
              <span className="text-muted-foreground">
                {student.class?.name} {student.section?.name ? `- ${student.section.name}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Age:</span>
              <span className="text-muted-foreground">
                {calculateAge(student.dateOfBirth)} years
              </span>
            </div>

            {student.bloodGroup && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Blood Group:</span>
                <span className="text-muted-foreground">{student.bloodGroup}</span>
              </div>
            )}

            {student.user?.email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Email:</span>
                <span className="text-muted-foreground truncate">{student.user.email}</span>
              </div>
            )}

            {student.user?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Phone:</span>
                <span className="text-muted-foreground">{student.user.phone}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Link href={`/students/${student.id}`}>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </Link>
            <Link href={`/students/${student.id}/edit`}>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
