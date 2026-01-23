'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const feeStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().optional(),
  feeType: z.string().min(1, 'Fee type is required'),
  amount: z.string().min(1, 'Amount is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  dueDay: z.string().min(1, 'Due day is required'),
  lateFee: z.string().default('0'),
  isOptional: z.boolean().default(false),
});

type FeeStructureFormData = z.infer<typeof feeStructureSchema>;

interface FeeStructureFormProps {
  academicYears: Array<{ id: string; name: string }>;
  classes: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function FeeStructureForm({
  academicYears,
  classes,
  onSuccess,
}: FeeStructureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeeStructureFormData>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      dueDay: '10',
      lateFee: '0',
      isOptional: false,
    },
  });

  const onSubmit = async (data: FeeStructureFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/fees/structures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          dueDay: parseInt(data.dueDay),
          lateFee: parseFloat(data.lateFee),
          classId: data.classId || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create fee structure');
      }

      toast.success('Fee structure created successfully');
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create fee structure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Fee Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Fee Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Tuition Fee"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="feeType">Fee Type</Label>
              <Select
                onValueChange={(value) => setValue('feeType', value)}
                defaultValue={watch('feeType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TUITION">Tuition</SelectItem>
                  <SelectItem value="ADMISSION">Admission</SelectItem>
                  <SelectItem value="TRANSPORT">Transport</SelectItem>
                  <SelectItem value="HOSTEL">Hostel</SelectItem>
                  <SelectItem value="LIBRARY">Library</SelectItem>
                  <SelectItem value="LABORATORY">Laboratory</SelectItem>
                  <SelectItem value="SPORTS">Sports</SelectItem>
                  <SelectItem value="EXAM">Exam</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.feeType && (
                <p className="text-sm text-red-500 mt-1">{errors.feeType.message}</p>
              )}
            </div>

            <div>
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
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicYearId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.academicYearId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="classId">Class (Optional)</Label>
              <Select
                onValueChange={(value) => setValue('classId', value)}
                defaultValue={watch('classId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount')}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                onValueChange={(value) => setValue('frequency', value)}
                defaultValue={watch('frequency')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TIME">One Time</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="HALF_YEARLY">Half Yearly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.frequency.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dueDay">Due Day (of Month)</Label>
              <Input
                id="dueDay"
                type="number"
                min="1"
                max="31"
                {...register('dueDay')}
              />
              {errors.dueDay && (
                <p className="text-sm text-red-500 mt-1">{errors.dueDay.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lateFee">Late Fee (₹)</Label>
              <Input
                id="lateFee"
                type="number"
                step="0.01"
                {...register('lateFee')}
              />
              {errors.lateFee && (
                <p className="text-sm text-red-500 mt-1">{errors.lateFee.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOptional"
              {...register('isOptional')}
              className="rounded"
            />
            <Label htmlFor="isOptional">This is an optional fee</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Fee Structure'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
