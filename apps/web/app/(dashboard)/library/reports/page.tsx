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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookMarked,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';

// Force dynamic rendering to avoid build-time fetch errors
export const dynamic = 'force-dynamic';

async function getReport(type: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/reports?type=${type}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

async function OverdueReport() {
  const data = await getReport('overdue');

  if (!data || !data.overdueIssues) {
    return <div className="text-center py-8">Failed to load report</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overdueIssues.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Fine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              Rs.{' '}
              {data.overdueIssues
                .reduce((sum: number, i: any) => sum + i.calculatedFine, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Overdue</TableHead>
              <TableHead>Fine</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.overdueIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No overdue books
                </TableCell>
              </TableRow>
            ) : (
              data.overdueIssues.map((issue: any) => (
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
                    <div className="text-sm">
                      {issue.student.user.phone && (
                        <p>{issue.student.user.phone}</p>
                      )}
                      {issue.student.user.email && (
                        <p className="text-muted-foreground">
                          {issue.student.user.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(issue.dueDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{issue.daysOverdue} days</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-destructive">
                      Rs. {issue.calculatedFine}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

async function PopularBooksReport() {
  const data = await getReport('popular');

  if (!data || !data.popularBooks) {
    return <div className="text-center py-8">Failed to load report</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Times Issued</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.popularBooks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.popularBooks.map((book: any, index: number) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Badge variant={index < 3 ? 'default' : 'outline'}>
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <Badge variant="outline">{book.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{book.issueCount}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

async function FinesReport() {
  const data = await getReport('fines');

  if (!data || !data.fines) {
    return <div className="text-center py-8">Failed to load report</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {data.summary.totalFines.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rs. {data.summary.paidAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              Rs. {data.summary.unpaidAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Fine Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.fines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No fines recorded
                </TableCell>
              </TableRow>
            ) : (
              data.fines.map((fine: any) => (
                <TableRow key={fine.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {fine.student.firstName} {fine.student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fine.student.admissionNo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">{fine.book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {fine.book.author}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {fine.returnDate
                      ? format(new Date(fine.returnDate), 'dd MMM yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      Rs. {parseFloat(fine.fineAmount).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={fine.finePaid ? 'default' : 'destructive'}>
                      {fine.finePaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library Reports</h1>
        <p className="text-muted-foreground">
          View library statistics and analytics
        </p>
      </div>

      <Tabs defaultValue="overdue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overdue">
            <AlertCircle className="mr-2 h-4 w-4" />
            Overdue Books
          </TabsTrigger>
          <TabsTrigger value="popular">
            <TrendingUp className="mr-2 h-4 w-4" />
            Popular Books
          </TabsTrigger>
          <TabsTrigger value="fines">
            <DollarSign className="mr-2 h-4 w-4" />
            Fines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Books Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ReportSkeleton />}>
                <OverdueReport />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Books</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ReportSkeleton />}>
                <PopularBooksReport />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fines">
          <Card>
            <CardHeader>
              <CardTitle>Fines Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ReportSkeleton />}>
                <FinesReport />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
