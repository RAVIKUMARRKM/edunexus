'use client';

import { useState, useEffect } from 'react';
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

interface ExamFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  defaultValues?: any;
}

interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

interface Class {
  id: string;
  name: string;
  numericValue: number;
}

export default function ExamForm({
  onSubmit,
  loading = false,
  defaultValues,
}: ExamFormProps) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: '',
      academicYearId: '',
      classId: '',
      examType: 'MID_TERM',
      startDate: '',
      endDate: '',
      maxMarks: 100,
      passingMarks: 33,
      isPublished: false,
    },
  });

  const academicYearId = watch('academicYearId');
  const examType = watch('examType');

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (academicYearId) {
      fetchClasses(academicYearId);
    }
  }, [academicYearId]);

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch('/api/academic-years');
      if (response.ok) {
        const data = await response.json();
        setAcademicYears(data);
        // Set current academic year as default
        const currentYear = data.find((year: AcademicYear) => year.isCurrent);
        if (currentYear && !defaultValues) {
          setValue('academicYearId', currentYear.id);
        }
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchClasses = async (yearId: string) => {
    try {
      const response = await fetch(`/api/classes?academicYearId=${yearId}`);
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Exam Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Mid Term Examination 2024"
            {...register('name', { required: 'Exam name is required' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="examType">Exam Type *</Label>
          <Select
            value={examType}
            onValueChange={(value) => setValue('examType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNIT_TEST">Unit Test</SelectItem>
              <SelectItem value="MID_TERM">Mid Term</SelectItem>
              <SelectItem value="FINAL">Final Examination</SelectItem>
              <SelectItem value="PRACTICAL">Practical</SelectItem>
              <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academicYearId">Academic Year *</Label>
          <Select
            value={academicYearId}
            onValueChange={(value) => setValue('academicYearId', value)}
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
            <p className="text-sm text-red-500">
              {errors.academicYearId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="classId">Class *</Label>
          <Select
            value={watch('classId')}
            onValueChange={(value) => setValue('classId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.classId && (
            <p className="text-sm text-red-500">{errors.classId.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate', { required: 'End date is required' })}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxMarks">Maximum Marks *</Label>
          <Input
            id="maxMarks"
            type="number"
            min="1"
            placeholder="100"
            {...register('maxMarks', {
              required: 'Maximum marks is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
          />
          {errors.maxMarks && (
            <p className="text-sm text-red-500">{errors.maxMarks.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passingMarks">Passing Marks *</Label>
          <Input
            id="passingMarks"
            type="number"
            min="1"
            placeholder="33"
            {...register('passingMarks', {
              required: 'Passing marks is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
          />
          {errors.passingMarks && (
            <p className="text-sm text-red-500">
              {errors.passingMarks.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isPublished" className="font-normal">
          Publish immediately (students can view results)
        </Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Exam'}
        </Button>
      </div>
    </form>
  );
}
