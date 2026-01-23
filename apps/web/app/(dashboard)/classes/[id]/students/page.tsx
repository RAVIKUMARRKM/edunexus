'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ArrowLeft, Search, Users, Filter } from 'lucide-react';
import { useState } from 'react';

async function fetchClass(id: string) {
  const response = await fetch(`/api/classes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch class');
  return response.json();
}

async function fetchStudents(classId: string, sectionId?: string) {
  const url = sectionId
    ? `/api/students?classId=${classId}&sectionId=${sectionId}`
    : `/api/students?classId=${classId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
}

export default function ClassStudentsPage({
  params,
}: {
  params: { id: string };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ['class', params.id],
    queryFn: () => fetchClass(params.id),
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: [
      'students',
      params.id,
      selectedSection === 'all' ? undefined : selectedSection,
    ],
    queryFn: () =>
      fetchStudents(
        params.id,
        selectedSection === 'all' ? undefined : selectedSection
      ),
    enabled: !!classData,
  });

  const filteredStudents = students?.filter((student: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.admissionNo.toLowerCase().includes(searchLower) ||
      student.rollNo?.toLowerCase().includes(searchLower)
    );
  });

  if (loadingClass) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Class not found</h2>
          <Link href="/classes">
            <Button className="mt-4">Back to Classes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href={`/classes/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Students - {classData.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {classData.academicYear.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {students?.length || 0} Students
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, admission no, or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {classData.sections.map((section: any) => (
                    <SelectItem key={section.id} value={section.id}>
                      Section {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Students Table */}
          {loadingStudents ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredStudents && filteredStudents.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.photo || undefined} />
                            <AvatarFallback>
                              {getInitials(student.firstName, student.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {student.admissionNo}
                      </TableCell>
                      <TableCell>{student.rollNo || '-'}</TableCell>
                      <TableCell>
                        {student.section ? `Section ${student.section.name}` : '-'}
                      </TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === 'ACTIVE'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/students/${student.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchQuery
                  ? 'No students found matching your search'
                  : 'No students enrolled in this class yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
