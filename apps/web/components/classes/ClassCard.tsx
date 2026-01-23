'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Grid3x3,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    roomNo?: string | null;
    capacity: number;
    academicYear: {
      name: string;
      isCurrent: boolean;
    };
    classTeacher?: {
      user: {
        name: string;
      };
    } | null;
    _count: {
      students: number;
      sections: number;
      subjects: number;
    };
  };
}

export function ClassCard({ classData }: ClassCardProps) {
  const studentsPercentage = Math.round(
    (classData._count.students / classData.capacity) * 100
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {classData.name}
          </CardTitle>
          {classData.roomNo && (
            <p className="text-sm text-muted-foreground">
              Room {classData.roomNo}
            </p>
          )}
        </div>
        {classData.academicYear.isCurrent && (
          <Badge variant="default">Current</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {classData.classTeacher && (
            <div className="flex items-center text-sm">
              <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Class Teacher:</span>
              <span className="ml-2 font-medium">
                {classData.classTeacher.user.name}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Students:</span>
            <span className="ml-2 font-medium">
              {classData._count.students} / {classData.capacity}
            </span>
            <Badge
              variant={studentsPercentage > 90 ? 'destructive' : 'secondary'}
              className="ml-2"
            >
              {studentsPercentage}%
            </Badge>
          </div>
          <div className="flex items-center text-sm">
            <Grid3x3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Sections:</span>
            <span className="ml-2 font-medium">
              {classData._count.sections}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Subjects:</span>
            <span className="ml-2 font-medium">
              {classData._count.subjects}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/classes/${classData.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
