'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  type: z.enum(['THEORY', 'PRACTICAL', 'BOTH']),
  isOptional: z.boolean().default(false),
  teacherId: z.string().optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  classId: string;
  teachers: Array<{
    id: string;
    user: { name: string };
    employeeId: string;
  }>;
  onSuccess?: () => void;
}

export function SubjectForm({
  classId,
  teachers,
  onSuccess,
}: SubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      type: 'THEORY',
      isOptional: false,
    },
  });

  const onSubmit = async (data: SubjectFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subject');
      }

      toast.success('Subject created successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create subject'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            placeholder="e.g., Mathematics, Physics"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            placeholder="e.g., MATH101, PHY201"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Subject Type</Label>
          <Select
            onValueChange={(value) =>
              setValue('type', value as 'THEORY' | 'PRACTICAL' | 'BOTH')
            }
            defaultValue={watch('type')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THEORY">Theory</SelectItem>
              <SelectItem value="PRACTICAL">Practical</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teacherId">Assign Teacher (Optional)</Label>
          <Select
            onValueChange={(value) => setValue('teacherId', value)}
            defaultValue={watch('teacherId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.user.name} ({teacher.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isOptional"
          {...register('isOptional')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isOptional" className="cursor-pointer">
          This is an optional subject
        </Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Subject'}
        </Button>
      </div>
    </form>
  );
}
