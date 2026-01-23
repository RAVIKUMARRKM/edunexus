'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const issueSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
  studentId: z.string().min(1, 'Student is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  remarks: z.string().optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

export function IssueForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchBook, setSearchBook] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 14 days from now
    },
  });

  const selectedBookId = watch('bookId');
  const selectedStudentId = watch('studentId');

  // Fetch available books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `/api/library/books?available=true&search=${searchBook}&limit=50`
        );
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const debounce = setTimeout(fetchBooks, 300);
    return () => clearTimeout(debounce);
  }, [searchBook]);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // This assumes you have a students API endpoint
        const response = await fetch(`/api/students?search=${searchStudent}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const debounce = setTimeout(fetchStudents, 300);
    return () => clearTimeout(debounce);
  }, [searchStudent]);

  const onSubmit = async (data: IssueFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/library/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to issue book');
      }

      toast.success('Book issued successfully');
      router.push('/library/issue');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Book Selection */}
      <div className="space-y-2">
        <Label htmlFor="bookId">
          Select Book <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          <Input
            placeholder="Search books by title, author, or ISBN..."
            value={searchBook}
            onChange={(e) => setSearchBook(e.target.value)}
          />
          <Select onValueChange={(value) => setValue('bookId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {books.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No available books found
                </div>
              ) : (
                books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - {book.author} ({book.availableQty} available)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {errors.bookId && (
          <p className="text-sm text-red-500">{errors.bookId.message}</p>
        )}
        {selectedBook && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p>
              <strong>Title:</strong> {selectedBook.title}
            </p>
            <p>
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p>
              <strong>Category:</strong> {selectedBook.category}
            </p>
            <p>
              <strong>Available:</strong> {selectedBook.availableQty}
            </p>
          </div>
        )}
      </div>

      {/* Student Selection */}
      <div className="space-y-2">
        <Label htmlFor="studentId">
          Select Student <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          <Input
            placeholder="Search students by name or admission number..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <Select onValueChange={(value) => setValue('studentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No students found
                </div>
              ) : (
                students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.admissionNo})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId.message}</p>
        )}
        {selectedStudent && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p>
              <strong>Name:</strong> {selectedStudent.firstName}{' '}
              {selectedStudent.lastName}
            </p>
            <p>
              <strong>Admission No:</strong> {selectedStudent.admissionNo}
            </p>
            {selectedStudent.class && (
              <p>
                <strong>Class:</strong> {selectedStudent.class.name}
                {selectedStudent.section && ` - ${selectedStudent.section.name}`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">
          Due Date <span className="text-red-500">*</span>
        </Label>
        <Input id="dueDate" type="date" {...register('dueDate')} />
        {errors.dueDate && (
          <p className="text-sm text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <textarea
          id="remarks"
          {...register('remarks')}
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Optional remarks..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Issuing...' : 'Issue Book'}
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
  );
}
