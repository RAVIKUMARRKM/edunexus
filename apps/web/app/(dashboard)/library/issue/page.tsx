import { Suspense } from 'react';
import Link from 'next/link';
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
import { IssueForm } from '@/components/library/IssueForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { BookCheck, Plus } from 'lucide-react';

// Force dynamic rendering to avoid build-time fetch errors
export const dynamic = 'force-dynamic';

async function getIssues(status?: string) {
  try {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('limit', '50');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/issues?${params}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch issues');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching issues:', error);
    return { issues: [] };
  }
}

async function IssuesList({ status }: { status?: string }) {
  const data = await getIssues(status);

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
            <TableHead>Status</TableHead>
            <TableHead>Fine</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No issues found
              </TableCell>
            </TableRow>
          ) : (
            data.issues.map((issue: any) => {
              const isOverdue =
                issue.status === 'ISSUED' && new Date(issue.dueDate) < new Date();
              return (
                <TableRow key={issue.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{issue.book.title}</p>
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
                    {format(new Date(issue.dueDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isOverdue
                          ? 'destructive'
                          : issue.status === 'ISSUED'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {isOverdue ? 'Overdue' : issue.status}
                    </Badge>
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
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function IssuesListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function IssuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issue Books</h1>
        <p className="text-muted-foreground">Issue books to students</p>
      </div>

      <Tabs defaultValue="issue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issue">
            <Plus className="mr-2 h-4 w-4" />
            Issue New Book
          </TabsTrigger>
          <TabsTrigger value="active">
            <BookCheck className="mr-2 h-4 w-4" />
            Active Issues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issue">
          <Card>
            <CardHeader>
              <CardTitle>Issue Book to Student</CardTitle>
            </CardHeader>
            <CardContent>
              <IssueForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Currently Issued Books</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<IssuesListSkeleton />}>
                <IssuesList status="ISSUED" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
