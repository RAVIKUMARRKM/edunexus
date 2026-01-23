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

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  numericValue: z.string().min(1, 'Numeric value is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classTeacherId: z.string().optional(),
  roomNo: z.string().optional(),
  capacity: z.string().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  academicYears: Array<{ id: string; name: string; isCurrent: boolean }>;
  teachers: Array<{
    id: string;
    user: { name: string };
    employeeId: string;
  }>;
  onSuccess?: () => void;
}

export function ClassForm({
  academicYears,
  teachers,
  onSuccess,
}: ClassFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      capacity: '40',
      academicYearId: academicYears.find((y) => y.isCurrent)?.id || '',
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create class');
      }

      toast.success('Class created successfully');
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create class'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name</Label>
          <Input
            id="name"
            placeholder="e.g., Class 10, Grade 5"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numericValue">Numeric Value (for sorting)</Label>
          <Input
            id="numericValue"
            type="number"
            placeholder="e.g., 10"
            {...register('numericValue')}
          />
          {errors.numericValue && (
            <p className="text-sm text-destructive">
              {errors.numericValue.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="academicYearId">Academic Year</Label>
          <Select
            onValueChange={(value) => setValue('academicYearId', value)}
            defaultValue={watch('academicYearId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name} {year.isCurrent && '(Current)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.academicYearId && (
            <p className="text-sm text-destructive">
              {errors.academicYearId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="classTeacherId">Class Teacher (Optional)</Label>
          <Select
            onValueChange={(value) => setValue('classTeacherId', value)}
            defaultValue={watch('classTeacherId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.user.name} ({teacher.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomNo">Room Number (Optional)</Label>
          <Input
            id="roomNo"
            placeholder="e.g., 101, A-12"
            {...register('roomNo')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="40"
            {...register('capacity')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Class'}
        </Button>
      </div>
    </form>
  );
}
