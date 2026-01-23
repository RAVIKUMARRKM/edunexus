import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

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

async function BookDetails({ id }: { id: string }) {
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const activeIssues = book.issues.filter((i: any) => i.status === 'ISSUED');
  const issueHistory = book.issues.filter((i: any) => i.status !== 'ISSUED');

  return (
    <div className="space-y-6">
      {/* Book Information */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{book.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-medium">{book.author}</p>
              </div>
              {book.isbn && (
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge>{book.category}</Badge>
              </div>
              {book.subject && (
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{book.subject}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {book.publisher && (
                <div>
                  <p className="text-sm text-muted-foreground">Publisher</p>
                  <p className="font-medium">{book.publisher}</p>
                </div>
              )}
              {book.edition && (
                <div>
                  <p className="text-sm text-muted-foreground">Edition</p>
                  <p className="font-medium">{book.edition}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-medium">{book.language}</p>
              </div>
              {book.pages && (
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              )}
              {book.price && (
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">Rs. {book.price}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="text-2xl font-bold">{book.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {book.availableQty}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currently Issued</p>
              <p className="text-2xl font-bold text-blue-600">
                {book.quantity - book.availableQty}
              </p>
            </div>
            {book.shelfLocation && (
              <div>
                <p className="text-sm text-muted-foreground">Shelf Location</p>
                <p className="text-2xl font-bold">{book.shelfLocation}</p>
              </div>
            )}
          </div>

          {book.description && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{book.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Issues */}
      {activeIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Issued To</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeIssues.map((issue: any) => {
                  const isOverdue = new Date(issue.dueDate) < new Date();
                  return (
                    <TableRow key={issue.id}>
                      <TableCell>
                        {issue.student.firstName} {issue.student.lastName}
                      </TableCell>
                      <TableCell>{issue.student.admissionNo}</TableCell>
                      <TableCell>
                        {format(new Date(issue.issueDate), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(issue.dueDate), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isOverdue ? 'destructive' : 'default'}>
                          {isOverdue ? 'Overdue' : 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Issue History */}
      {issueHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issue History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issueHistory.slice(0, 10).map((issue: any) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      {issue.student.firstName} {issue.student.lastName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(issue.issueDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {issue.returnDate
                        ? format(new Date(issue.returnDate), 'dd MMM yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          issue.status === 'RETURNED'
                            ? 'default'
                            : issue.status === 'LOST'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BookDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/library/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Book Details</h1>
            <p className="text-muted-foreground">View book information and history</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/library/books/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Book
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BookDetailsSkeleton />}>
        <BookDetails id={params.id} />
      </Suspense>
    </div>
  );
}
