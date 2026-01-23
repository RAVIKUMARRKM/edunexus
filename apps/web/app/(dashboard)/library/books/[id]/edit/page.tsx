import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookForm } from '@/components/library/BookForm';
import { ArrowLeft } from 'lucide-react';

async function getBook(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/books/${id}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

async function EditBookForm({ id }: { id: string }) {
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return <BookForm initialData={book} bookId={id} />;
}

function EditBookFormSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function EditBookPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href={`/library/books/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
          <p className="text-muted-foreground">Update book information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditBookFormSkeleton />}>
            <EditBookForm id={params.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
