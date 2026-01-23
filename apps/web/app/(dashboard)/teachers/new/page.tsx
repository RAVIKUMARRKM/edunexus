'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { TeacherFormValues } from '@/lib/validations/teacher';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewTeacherPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create teacher');
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success('Teacher created successfully');
      router.push(`/teachers/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: TeacherFormValues) => {
    createMutation.mutate(data);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Teacher</h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new teacher to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <TeacherForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
