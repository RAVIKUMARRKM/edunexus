import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

// GET /api/library/reports - Get library reports
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    switch (reportType) {
      case 'overview':
        return await getOverviewReport();
      case 'issued':
        return await getIssuedBooksReport(startDate, endDate);
      case 'overdue':
        return await getOverdueBooksReport();
      case 'popular':
        return await getPopularBooksReport(startDate, endDate);
      case 'fines':
        return await getFinesReport(startDate, endDate);
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// Overview Report
async function getOverviewReport() {
  const [
    totalBooks,
    totalAvailable,
    totalIssued,
    totalOverdue,
    totalFines,
    unpaidFines,
  ] = await Promise.all([
    prisma.book.aggregate({
      _sum: { quantity: true },
    }),
    prisma.book.aggregate({
      _sum: { availableQty: true },
    }),
    prisma.bookIssue.count({
      where: { status: 'ISSUED' },
    }),
    prisma.bookIssue.count({
      where: {
        status: 'ISSUED',
        dueDate: { lt: new Date() },
      },
    }),
    prisma.bookIssue.aggregate({
      where: { fineAmount: { gt: 0 } },
      _sum: { fineAmount: true },
    }),
    prisma.bookIssue.aggregate({
      where: {
        fineAmount: { gt: 0 },
        finePaid: false,
      },
      _sum: { fineAmount: true },
    }),
  ]);

  return NextResponse.json({
    totalBooks: totalBooks._sum.quantity || 0,
    totalAvailable: totalAvailable._sum.availableQty || 0,
    totalIssued,
    totalOverdue,
    totalFines: totalFines._sum.fineAmount || 0,
    unpaidFines: unpaidFines._sum.fineAmount || 0,
  });
}

// Issued Books Report
async function getIssuedBooksReport(startDate: string | null, endDate: string | null) {
  const where: any = {};

  if (startDate || endDate) {
    where.issueDate = {};
    if (startDate) where.issueDate.gte = new Date(startDate);
    if (endDate) where.issueDate.lte = new Date(endDate);
  }

  const issues = await prisma.bookIssue.findMany({
    where,
    include: {
      book: {
        select: {
          title: true,
          author: true,
          isbn: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          admissionNo: true,
          class: { select: { name: true } },
          section: { select: { name: true } },
        },
      },
    },
    orderBy: { issueDate: 'desc' },
  });

  return NextResponse.json({ issues });
}

// Overdue Books Report
async function getOverdueBooksReport() {
  const overdueIssues = await prisma.bookIssue.findMany({
    where: {
      status: 'ISSUED',
      dueDate: { lt: new Date() },
    },
    include: {
      book: {
        select: {
          title: true,
          author: true,
          isbn: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          admissionNo: true,
          user: {
            select: {
              phone: true,
              email: true,
            },
          },
          class: { select: { name: true } },
          section: { select: { name: true } },
        },
      },
    },
    orderBy: { dueDate: 'asc' },
  });

  // Calculate fine for each overdue book
  const overdueWithFine = overdueIssues.map((issue) => {
    const daysOverdue = Math.ceil(
      (new Date().getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const calculatedFine = daysOverdue * 2;

    return {
      ...issue,
      daysOverdue,
      calculatedFine,
    };
  });

  return NextResponse.json({ overdueIssues: overdueWithFine });
}

// Popular Books Report
async function getPopularBooksReport(startDate: string | null, endDate: string | null) {
  const where: any = {};

  if (startDate || endDate) {
    where.issueDate = {};
    if (startDate) where.issueDate.gte = new Date(startDate);
    if (endDate) where.issueDate.lte = new Date(endDate);
  }

  const popularBooks = await prisma.bookIssue.groupBy({
    by: ['bookId'],
    where,
    _count: {
      bookId: true,
    },
    orderBy: {
      _count: {
        bookId: 'desc',
      },
    },
    take: 20,
  });

  // Get book details
  const booksWithDetails = await Promise.all(
    popularBooks.map(async (item) => {
      const book = await prisma.book.findUnique({
        where: { id: item.bookId },
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
          category: true,
        },
      });

      return {
        ...book,
        issueCount: item._count.bookId,
      };
    })
  );

  return NextResponse.json({ popularBooks: booksWithDetails });
}

// Fines Report
async function getFinesReport(startDate: string | null, endDate: string | null) {
  const where: any = {
    fineAmount: { gt: 0 },
  };

  if (startDate || endDate) {
    where.returnDate = {};
    if (startDate) where.returnDate.gte = new Date(startDate);
    if (endDate) where.returnDate.lte = new Date(endDate);
  }

  const fines = await prisma.bookIssue.findMany({
    where,
    include: {
      book: {
        select: {
          title: true,
          author: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          admissionNo: true,
          class: { select: { name: true } },
          section: { select: { name: true } },
        },
      },
    },
    orderBy: { returnDate: 'desc' },
  });

  const summary = await prisma.bookIssue.aggregate({
    where,
    _sum: {
      fineAmount: true,
    },
    _count: {
      id: true,
    },
  });

  const paidFines = await prisma.bookIssue.aggregate({
    where: {
      ...where,
      finePaid: true,
    },
    _sum: {
      fineAmount: true,
    },
  });

  return NextResponse.json({
    fines,
    summary: {
      totalFines: Number(summary._sum.fineAmount || 0),
      totalCount: summary._count.id,
      paidAmount: Number(paidFines._sum.fineAmount || 0),
      unpaidAmount: Number(summary._sum.fineAmount || 0) - Number(paidFines._sum.fineAmount || 0),
    },
  });
}
