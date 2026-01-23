'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AttendanceMarkerProps {
  studentId: string;
  onSubmit: (data: {
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';
    remarks?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AttendanceMarker({
  studentId,
  onSubmit,
  isLoading = false,
}: AttendanceMarkerProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE' | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      remarks: '',
    },
  });

  const attendanceStatuses = [
    { value: 'PRESENT', label: 'Present', color: 'success' },
    { value: 'ABSENT', label: 'Absent', color: 'destructive' },
    { value: 'LATE', label: 'Late', color: 'warning' },
    { value: 'HALF_DAY', label: 'Half Day', color: 'secondary' },
    { value: 'LEAVE', label: 'Leave', color: 'default' },
  ];

  const handleFormSubmit = async (data: any) => {
    if (!selectedStatus) {
      return;
    }

    await onSubmit({
      date: data.date,
      status: selectedStatus,
      remarks: data.remarks || undefined,
    });

    // Reset form
    setSelectedStatus(null);
    reset();
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: true })}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <Label>Status *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
            {attendanceStatuses.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setSelectedStatus(status.value as any)}
                className={`p-3 rounded-md border-2 transition-all ${
                  selectedStatus === status.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Badge
                  variant={status.color as any}
                  className="w-full justify-center"
                >
                  {status.label}
                </Badge>
              </button>
            ))}
          </div>
          {!selectedStatus && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select an attendance status
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="remarks">Remarks (Optional)</Label>
          <Input
            id="remarks"
            {...register('remarks')}
            placeholder="Add any notes or remarks..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedStatus(null);
              reset();
            }}
            disabled={isLoading}
          >
            Clear
          </Button>
          <Button type="submit" disabled={!selectedStatus || isLoading}>
            {isLoading ? 'Saving...' : 'Mark Attendance'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
