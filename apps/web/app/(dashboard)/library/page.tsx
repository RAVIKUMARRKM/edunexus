import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  BookMarked,
  AlertCircle,
  DollarSign,
  Plus,
  BookCheck,
  BookX,
} from 'lucide-react';

async function getLibraryStats() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/library/reports?type=overview`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching library stats:', error);
    return null;
  }
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  href,
}: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  href?: string;
}) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link href={href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            {children}
          </Card>
        </Link>
      );
    }
    return <Card>{children}</Card>;
  };

  return (
    <CardWrapper>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </CardWrapper>
  );
}

async function LibraryStats() {
  const stats = await getLibraryStats();

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Books"
        value={stats.totalBooks}
        icon={BookOpen}
        description="Total books in library"
        href="/library/books"
      />
      <StatsCard
        title="Available Books"
        value={stats.totalAvailable}
        icon={BookMarked}
        description="Books available for issue"
      />
      <StatsCard
        title="Currently Issued"
        value={stats.totalIssued}
        icon={BookCheck}
        description="Books issued to students"
        href="/library/issue"
      />
      <StatsCard
        title="Overdue Books"
        value={stats.totalOverdue}
        icon={AlertCircle}
        description="Books past due date"
      />
      <StatsCard
        title="Total Fines"
        value={`Rs. ${stats.totalFines.toFixed(2)}`}
        icon={DollarSign}
        description="All time fines collected"
      />
      <StatsCard
        title="Unpaid Fines"
        value={`Rs. ${stats.unpaidFines.toFixed(2)}`}
        icon={BookX}
        description="Outstanding fine amount"
      />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
          <p className="text-muted-foreground">
            Manage books, issues, and library operations
          </p>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <LibraryStats />
      </Suspense>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-auto py-6" variant="outline">
          <Link href="/library/books/new">
            <div className="flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Add New Book</span>
            </div>
          </Link>
        </Button>

        <Button asChild className="h-auto py-6" variant="outline">
          <Link href="/library/issue">
            <div className="flex flex-col items-center gap-2">
              <BookCheck className="h-6 w-6" />
              <span>Issue Book</span>
            </div>
          </Link>
        </Button>

        <Button asChild className="h-auto py-6" variant="outline">
          <Link href="/library/return">
            <div className="flex flex-col items-center gap-2">
              <BookX className="h-6 w-6" />
              <span>Return Book</span>
            </div>
          </Link>
        </Button>

        <Button asChild className="h-auto py-6" variant="outline">
          <Link href="/library/reports">
            <div className="flex flex-col items-center gap-2">
              <BookMarked className="h-6 w-6" />
              <span>View Reports</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
