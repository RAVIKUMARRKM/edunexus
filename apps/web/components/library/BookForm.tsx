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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const bookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subject: z.string().optional(),
  language: z.string().default('English'),
  pages: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  shelfLocation: z.string().optional(),
  description: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  bookId?: string;
}

export function BookForm({ initialData, bookId }: BookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      language: 'English',
      quantity: 1,
    },
  });

  const onSubmit = async (data: BookFormData) => {
    setIsLoading(true);
    try {
      const url = bookId ? `/api/library/books/${bookId}` : '/api/library/books';
      const method = bookId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save book');
      }

      toast.success(bookId ? 'Book updated successfully' : 'Book added successfully');
      router.push('/library/books');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">
            Author <span className="text-red-500">*</span>
          </Label>
          <Input id="author" {...register('author')} />
          {errors.author && (
            <p className="text-sm text-red-500">{errors.author.message}</p>
          )}
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" {...register('isbn')} />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue('category', value)}
            defaultValue={initialData?.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Geography">Geography</SelectItem>
              <SelectItem value="Literature">Literature</SelectItem>
              <SelectItem value="Biography">Biography</SelectItem>
              <SelectItem value="Reference">Reference</SelectItem>
              <SelectItem value="Comics">Comics</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register('subject')} />
        </div>

        {/* Publisher */}
        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" {...register('publisher')} />
        </div>

        {/* Edition */}
        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input id="edition" {...register('edition')} placeholder="e.g., 1st, 2nd" />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            onValueChange={(value) => setValue('language', value)}
            defaultValue={initialData?.language || 'English'}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Sanskrit">Sanskrit</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pages */}
        <div className="space-y-2">
          <Label htmlFor="pages">Pages</Label>
          <Input id="pages" type="number" {...register('pages')} />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (Rs.)</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input id="quantity" type="number" {...register('quantity')} />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        {/* Shelf Location */}
        <div className="space-y-2">
          <Label htmlFor="shelfLocation">Shelf Location</Label>
          <Input id="shelfLocation" {...register('shelfLocation')} placeholder="e.g., A-12" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter book description..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : bookId ? 'Update Book' : 'Add Book'}
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
