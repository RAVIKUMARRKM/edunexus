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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const returnSchema = z.object({
  condition: z.enum(['RETURNED', 'LOST', 'DAMAGED']),
  finePaid: z.boolean(),
  remarks: z.string().optional(),
});

type ReturnFormData = z.infer<typeof returnSchema>;

interface ReturnFormProps {
  issue: {
    id: string;
    book: {
      title: string;
      author: string;
      isbn?: string;
    };
    student: {
      firstName: string;
      lastName: string;
      admissionNo: string;
    };
    issueDate: string;
    dueDate: string;
    calculatedFine?: number;
  };
}

export function ReturnForm({ issue }: ReturnFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      condition: 'RETURNED',
      finePaid: false,
    },
  });

  const isOverdue = new Date(issue.dueDate) < new Date();
  const daysOverdue = isOverdue
    ? Math.ceil(
        (new Date().getTime() - new Date(issue.dueDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const fineAmount = issue.calculatedFine || daysOverdue * 2;

  const onSubmit = async (data: ReturnFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/library/issues/${issue.id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to return book');
      }

      const result = await response.json();
      toast.success(result.message || 'Book returned successfully');
      router.push('/library/return');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Book & Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Book Details</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Title:</strong> {issue.book.title}
            </p>
            <p>
              <strong>Author:</strong> {issue.book.author}
            </p>
            {issue.book.isbn && (
              <p>
                <strong>ISBN:</strong> {issue.book.isbn}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Student Details</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {issue.student.firstName}{' '}
              {issue.student.lastName}
            </p>
            <p>
              <strong>Admission No:</strong> {issue.student.admissionNo}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Info */}
      <div className="p-4 bg-muted rounded-lg space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Issue Date</p>
            <p className="font-medium">
              {format(new Date(issue.issueDate), 'dd MMM yyyy')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {format(new Date(issue.dueDate), 'dd MMM yyyy')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            {isOverdue ? (
              <Badge variant="destructive">
                Overdue by {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
              </Badge>
            ) : (
              <Badge variant="default">On Time</Badge>
            )}
          </div>
        </div>

        {fineAmount > 0 && (
          <div className="pt-3 border-t">
            <p className="text-sm font-semibold text-destructive">
              Fine Amount: Rs. {fineAmount.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              (Rs. 2 per day overdue)
            </p>
          </div>
        )}
      </div>

      {/* Return Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Condition */}
        <div className="space-y-2">
          <Label htmlFor="condition">
            Book Condition <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value: any) => setValue('condition', value)}
            defaultValue="RETURNED"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RETURNED">Returned (Good Condition)</SelectItem>
              <SelectItem value="DAMAGED">Damaged</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fine Payment */}
        {fineAmount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="finePaid"
                {...register('finePaid')}
                className="rounded border-input"
              />
              <Label htmlFor="finePaid" className="cursor-pointer">
                Fine has been paid (Rs. {fineAmount.toFixed(2)})
              </Label>
            </div>
          </div>
        )}

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <textarea
            id="remarks"
            {...register('remarks')}
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Optional remarks about the return..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Return Book'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
