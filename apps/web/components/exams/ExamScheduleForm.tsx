'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface ExamSchedule {
  id: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  roomNo: string | null;
}

interface ExamScheduleFormProps {
  examId: string;
  subjects: Subject[];
  existingSchedules: ExamSchedule[];
  onScheduleCreated: () => void;
}

export default function ExamScheduleForm({
  examId,
  subjects,
  existingSchedules,
  onScheduleCreated,
}: ExamScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedSubjectId = watch('subjectId');

  // Filter out subjects that already have schedules
  const scheduledSubjectIds = existingSchedules.map((s) => s.subjectId);
  const availableSubjects = subjects.filter(
    (s) => !scheduledSubjectIds.includes(s.id)
  );

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exams/${examId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        setShowForm(false);
        onScheduleCreated();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create schedule');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Existing Schedules */}
      {existingSchedules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Exam Schedule</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Room No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {getSubjectName(schedule.subjectId)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(schedule.date), 'MMMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {schedule.startTime} - {schedule.endTime}
                    </TableCell>
                    <TableCell>{schedule.roomNo || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Schedule Form */}
      {availableSubjects.length > 0 && (
        <div>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          ) : (
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Schedule</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Subject *</Label>
                    <Select
                      value={selectedSubjectId}
                      onValueChange={(value) => setValue('subjectId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subjectId && (
                      <p className="text-sm text-red-500">Subject is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date', { required: true })}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">Date is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      {...register('startTime', { required: true })}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-500">Start time is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      {...register('endTime', { required: true })}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-red-500">End time is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomNo">Room Number (Optional)</Label>
                    <Input
                      id="roomNo"
                      placeholder="e.g., Room 101"
                      {...register('roomNo')}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Schedule'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {availableSubjects.length === 0 && existingSchedules.length > 0 && (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            All subjects have been scheduled
          </p>
        </div>
      )}

      {existingSchedules.length === 0 && !showForm && (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            No schedules created yet
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Schedule
          </Button>
        </div>
      )}
    </div>
  );
}
