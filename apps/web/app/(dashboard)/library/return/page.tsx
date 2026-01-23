import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { ReturnForm } from '@/components/library/ReturnForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { BookX } from 'lucide-react';

async function getIssuedBooks() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/issues?status=ISSUED&limit=100`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch issued books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching issued books:', error);
    return { issues: [] };
  }
}

async function IssuedBooksList() {
  const data = await getIssuedBooks();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No issued books found
              </TableCell>
            </TableRow>
          ) : (
            data.issues.map((issue: any) => {
              const isOverdue = new Date(issue.dueDate) < new Date();
              const daysOverdue = isOverdue
                ? Math.ceil(
                    (new Date().getTime() - new Date(issue.dueDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;

              return (
                <TableRow key={issue.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">{issue.book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {issue.book.author}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {issue.student.firstName} {issue.student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {issue.student.admissionNo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {issue.student.class?.name || '-'}
                    {issue.student.section && ` - ${issue.student.section.name}`}
                  </TableCell>
                  <TableCell>
                    {format(new Date(issue.issueDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{format(new Date(issue.dueDate), 'dd MMM yyyy')}</p>
                      {isOverdue && (
                        <Badge variant="destructive" className="mt-1">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOverdue ? (
                      <span className="text-destructive font-medium">
                        +{daysOverdue}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {issue.calculatedFine > 0 ? (
                      <span className="text-destructive font-medium">
                        Rs. {issue.calculatedFine}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Return
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Return Book</DialogTitle>
                        </DialogHeader>
                        <ReturnForm issue={issue} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function IssuedBooksListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function ReturnPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookX className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Return Books</h1>
          <p className="text-muted-foreground">Process book returns and collect fines</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issued Books</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<IssuedBooksListSkeleton />}>
            <IssuedBooksList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
