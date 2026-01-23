'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  roomNo: z.string().optional(),
  capacity: z.string().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  classId: string;
  onSuccess?: () => void;
}

export function SectionForm({ classId, onSuccess }: SectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      capacity: '40',
    },
  });

  const onSubmit = async (data: SectionFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create section');
      }

      toast.success('Section created successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create section'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Section Name</Label>
        <Input
          id="name"
          placeholder="e.g., A, B, C"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
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

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Section'}
        </Button>
      </div>
    </form>
  );
}
