'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface TeacherCardProps {
  teacher: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    photo?: string | null;
    qualification: string;
    designation?: string | null;
    experience: number;
    status: string;
    user: {
      email: string;
      phone?: string | null;
    };
    department?: {
      name: string;
    } | null;
    subjectAssignments?: Array<{
      subject: {
        name: string;
      };
    }>;
  };
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
    ACTIVE: 'success',
    ON_LEAVE: 'warning',
    RESIGNED: 'destructive',
    TERMINATED: 'destructive',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            {teacher.photo ? (
              <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xl font-semibold">
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
            )}
          </Avatar>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {teacher.firstName} {teacher.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{teacher.employeeId}</p>
              </div>
              <Badge variant={statusColors[teacher.status]}>
                {teacher.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{teacher.user.email}</span>
              </div>
              {teacher.user.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{teacher.qualification}</span>
              </div>
              {teacher.department && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{teacher.department.name}</span>
                </div>
              )}
              {teacher.designation && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{teacher.designation}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{teacher.experience} years exp.</span>
              </div>
            </div>

            {/* Subjects */}
            {teacher.subjectAssignments && teacher.subjectAssignments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {teacher.subjectAssignments.slice(0, 3).map((assignment, index) => (
                  <Badge key={index} variant="outline">
                    {assignment.subject.name}
                  </Badge>
                ))}
                {teacher.subjectAssignments.length > 3 && (
                  <Badge variant="outline">+{teacher.subjectAssignments.length - 3} more</Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button asChild size="sm" variant="default">
                <Link href={`/teachers/${teacher.id}`}>View Profile</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/teachers/${teacher.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
