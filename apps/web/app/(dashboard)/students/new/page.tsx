'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { StudentForm } from '@/components/students/StudentForm';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import type { StudentInput } from '@edunexus/shared';

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

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

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentInput) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create student');
      }

      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
      router.push(`/students/${data.id}`);
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
    await createStudentMutation.mutateAsync(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Add New Student</h1>
        <p className="text-muted-foreground">
          Create a new student record with complete information
        </p>
      </div>

      {/* Form */}
      <StudentForm
        onSubmit={handleSubmit}
        isLoading={createStudentMutation.isPending}
        classes={classesData?.classes || []}
        sections={sectionsData?.sections || []}
      />
    </div>
  );
}
