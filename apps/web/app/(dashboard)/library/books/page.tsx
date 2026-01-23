import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookTable } from '@/components/library/BookTable';
import { Plus, Search } from 'lucide-react';

async function getBooks(searchParams: any) {
  try {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.available) params.set('available', searchParams.available);
    params.set('page', searchParams.page || '1');
    params.set('limit', '20');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/books?${params}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return { books: [], pagination: { total: 0, totalPages: 0, page: 1 } };
  }
}

async function BooksList({ searchParams }: { searchParams: any }) {
  const data = await getBooks(searchParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data.books.length} of {data.pagination.total} books
        </p>
      </div>
      <BookTable books={data.books} />
    </div>
  );
}

function BooksListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function BooksPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; available?: string; page?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Catalog</h1>
          <p className="text-muted-foreground">Browse and manage library books</p>
        </div>
        <Button asChild>
          <Link href="/library/books/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <form action="/library/books" method="get">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search by title, author, or ISBN..."
                className="pl-8"
                defaultValue={searchParams.search}
              />
            </div>
          </form>
        </div>
        <form action="/library/books" method="get">
          <Select name="category" defaultValue={searchParams.category || ''}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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
        </form>
        <form action="/library/books" method="get">
          <Select name="available" defaultValue={searchParams.available || ''}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="true">Available Only</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

      <Suspense fallback={<BooksListSkeleton />}>
        <BooksList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
