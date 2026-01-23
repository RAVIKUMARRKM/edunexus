'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';

interface Student {
  id: string;
  admissionNo: string;
  rollNo?: string | null;
  firstName: string;
  lastName: string;
  gender: string;
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
}

interface StudentTableProps {
  students: Student[];
  onDelete?: (id: string) => void;
}

export function StudentTable({ students, onDelete }: StudentTableProps) {
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

  if (students.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No students found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Admission No</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {student.user?.avatar || student.photo ? (
                      <img
                        src={student.user?.avatar || student.photo || ''}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-semibold">
                        {getInitials(student.firstName, student.lastName)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {student.gender.toLowerCase()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{student.admissionNo}</TableCell>
              <TableCell>{student.rollNo || '-'}</TableCell>
              <TableCell>
                {student.class?.name || '-'}
                {student.section?.name && ` - ${student.section.name}`}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {student.user?.email || '-'}
              </TableCell>
              <TableCell>{student.user?.phone || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(student.status) as any}>
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/students/${student.id}`}>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </Link>
                  <Link href={`/students/${student.id}/edit`}>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(student.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
