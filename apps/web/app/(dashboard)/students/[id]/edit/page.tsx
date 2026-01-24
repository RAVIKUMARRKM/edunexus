'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { StudentForm } from '@/components/students/StudentForm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import type { StudentInput } from '@edunexus/shared';

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  // Fetch student data
  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student');
      return response.json();
    },
  });

  // Fetch classes
  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    },
  });

  // Fetch sections
  const { data: sectionsData } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const response = await fetch('/api/sections');
      if (!response.ok) throw new Error('Failed to fetch sections');
      return response.json();
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (data: Partial<StudentInput>) => {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update student');
      }

      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Student updated successfully',
      });
      router.push(`/students/${studentId}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (data: StudentInput) => {
    await updateStudentMutation.mutateAsync(data);
  };

  if (isLoadingStudent) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Student not found</p>
        </Card>
      </div>
    );
  }

  const student = studentData;

  // Prepare initial form data
  const initialData = {
    admissionNo: student.admissionNo,
    rollNo: student.rollNo || undefined,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
    gender: student.gender,
    bloodGroup: student.bloodGroup || undefined,
    religion: student.religion || undefined,
    caste: student.caste || undefined,
    nationality: student.nationality,
    motherTongue: student.motherTongue || undefined,
    address: student.address || undefined,
    city: student.city || undefined,
    state: student.state || undefined,
    pincode: student.pincode || undefined,
    classId: student.classId || '',
    sectionId: student.sectionId || '',
    email: student.user?.email || undefined,
    phone: student.user?.phone || undefined,
    // Parent information
    fatherName: student.parents?.[0]?.parent?.fatherName || undefined,
    fatherPhone: student.parents?.[0]?.parent?.fatherPhone || undefined,
    fatherEmail: student.parents?.[0]?.parent?.fatherEmail || undefined,
    fatherOccupation: student.parents?.[0]?.parent?.fatherOccupation || undefined,
    motherName: student.parents?.[0]?.parent?.motherName || undefined,
    motherPhone: student.parents?.[0]?.parent?.motherPhone || undefined,
    motherEmail: student.parents?.[0]?.parent?.motherEmail || undefined,
    motherOccupation: student.parents?.[0]?.parent?.motherOccupation || undefined,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <p className="text-muted-foreground">
          Update student information for {student.firstName} {student.lastName}
        </p>
      </div>

      {/* Form */}
      <StudentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateStudentMutation.isPending}
        classes={classesData || []}
        sections={sectionsData || []}
      />
    </div>
  );
}
