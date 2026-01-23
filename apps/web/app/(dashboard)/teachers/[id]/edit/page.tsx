'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { TeacherFormValues } from '@/lib/validations/teacher';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  const queryClient = useQueryClient();

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teachers/${teacherId}`);
      if (!res.ok) throw new Error('Failed to fetch teacher');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      const res = await fetch(`/api/teachers/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update teacher');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher updated successfully');
      router.push(`/teachers/${teacherId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: TeacherFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading teacher data...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Teacher not found</p>
      </div>
    );
  }

  const initialData: Partial<TeacherFormValues> = {
    email: teacher.user.email,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    dateOfBirth: new Date(teacher.dateOfBirth).toISOString().split('T')[0],
    gender: teacher.gender,
    bloodGroup: teacher.bloodGroup,
    phone: teacher.user.phone,
    photo: teacher.photo,
    address: teacher.address,
    city: teacher.city,
    state: teacher.state,
    pincode: teacher.pincode,
    emergencyContact: teacher.emergencyContact,
    qualification: teacher.qualification,
    specialization: teacher.specialization,
    experience: teacher.experience,
    joiningDate: new Date(teacher.joiningDate).toISOString().split('T')[0],
    departmentId: teacher.departmentId,
    designation: teacher.designation,
    basicSalary: parseFloat(teacher.basicSalary),
    status: teacher.status,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/teachers/${teacherId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Teacher</h1>
          <p className="text-muted-foreground">
            Update teacher information
          </p>
        </div>
      </div>

      {/* Form */}
      <TeacherForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEdit={true}
      />
    </div>
  );
}
