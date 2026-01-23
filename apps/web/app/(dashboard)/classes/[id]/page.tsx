'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SectionForm } from '@/components/classes/SectionForm';
import { SubjectForm } from '@/components/classes/SubjectForm';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Grid3x3,
  BookOpen,
  Calendar,
  Plus,
  Edit,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';

async function fetchClass(id: string) {
  const response = await fetch(`/api/classes/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch class');
  }
  return response.json();
}

async function fetchTeachers() {
  const response = await fetch('/api/teachers?status=ACTIVE');
  if (!response.ok) {
    throw new Error('Failed to fetch teachers');
  }
  return response.json();
}

export default function ClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);

  const {
    data: classData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['class', params.id],
    queryFn: () => fetchClass(params.id),
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href="/classes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </Link>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{classData.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {classData.academicYear.name}
              </p>
            </div>
            <div className="flex gap-2">
              {classData.academicYear.isCurrent && (
                <Badge variant="default">Current Year</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">
                  {classData._count.students}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Grid3x3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sections</p>
                <p className="text-2xl font-bold">
                  {classData._count.sections}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">
                  {classData._count.subjects}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Teacher</p>
                <p className="text-sm font-medium">
                  {classData.classTeacher?.user.name || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Sections, Subjects, etc. */}
      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sections</h3>
            <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Section</DialogTitle>
                </DialogHeader>
                <SectionForm
                  classId={params.id}
                  onSuccess={() => {
                    setSectionDialogOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classData.sections.map((section: any) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Section {section.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">
                      {section._count.students} / {section.capacity}
                    </span>
                  </div>
                  {section.roomNo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{section.roomNo}</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <Link href={`/classes/${params.id}/timetable?section=${section.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Timetable
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {classData.sections.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No sections created yet
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Subject</DialogTitle>
                </DialogHeader>
                <SubjectForm
                  classId={params.id}
                  teachers={teachers || []}
                  onSuccess={() => {
                    setSubjectDialogOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {classData.subjects.map((subject: any) => (
              <Card key={subject.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">
                          {subject.name}
                        </h4>
                        <Badge variant="outline">{subject.code}</Badge>
                        <Badge variant="secondary">{subject.type}</Badge>
                        {subject.isOptional && (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </div>
                      {subject.assignments.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Teachers:{' '}
                          {subject.assignments
                            .map((a: any) => a.teacher.user.name)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {classData.subjects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No subjects created yet
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Student list will be displayed here</p>
                <Link href={`/classes/${params.id}/students`}>
                  <Button className="mt-4">View All Students</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
