import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const issueSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
  studentId: z.string().min(1, 'Student is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  remarks: z.string().optional(),
});

// GET /api/library/issues - Get all book issues
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const studentId = searchParams.get('studentId') || '';
    const overdue = searchParams.get('overdue') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (overdue) {
      where.status = 'ISSUED';
      where.dueDate = { lt: new Date() };
    }

    const [issues, total] = await Promise.all([
      prisma.bookIssue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issueDate: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              category: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNo: true,
              rollNo: true,
              class: {
                select: {
                  name: true,
                },
              },
              section: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.bookIssue.count({ where }),
    ]);

    // Calculate fine for overdue books
    const issuesWithFine = issues.map((issue) => {
      let calculatedFine = 0;
      if (issue.status === 'ISSUED' && issue.dueDate < new Date()) {
        const daysOverdue = Math.ceil(
          (new Date().getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        calculatedFine = daysOverdue * 2; // 2 rupees per day
      }
      return {
        ...issue,
        calculatedFine,
      };
    });

    return NextResponse.json({
      issues: issuesWithFine,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

// POST /api/library/issues - Issue a book
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    if (!['ADMIN', 'SUPER_ADMIN', 'LIBRARIAN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = issueSchema.parse(body);

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: validatedData.bookId },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.availableQty <= 0) {
      return NextResponse.json(
        { error: 'Book is not available' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: validatedData.studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if student already has this book issued
    const existingIssue = await prisma.bookIssue.findFirst({
      where: {
        bookId: validatedData.bookId,
        studentId: validatedData.studentId,
        status: 'ISSUED',
      },
    });

    if (existingIssue) {
      return NextResponse.json(
        { error: 'Student already has this book issued' },
        { status: 400 }
      );
    }

    // Check if student has overdue books
    const overdueBooks = await prisma.bookIssue.findFirst({
      where: {
        studentId: validatedData.studentId,
        status: 'ISSUED',
        dueDate: { lt: new Date() },
      },
    });

    if (overdueBooks) {
      return NextResponse.json(
        { error: 'Student has overdue books. Please return them first.' },
        { status: 400 }
      );
    }

    // Create issue and update book availability
    const [issue] = await prisma.$transaction([
      prisma.bookIssue.create({
        data: {
          bookId: validatedData.bookId,
          studentId: validatedData.studentId,
          dueDate: new Date(validatedData.dueDate),
          remarks: validatedData.remarks,
          issuedBy: session.user.id,
        },
        include: {
          book: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNo: true,
            },
          },
        },
      }),
      prisma.book.update({
        where: { id: validatedData.bookId },
        data: {
          availableQty: { decrement: 1 },
        },
      }),
    ]);

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error issuing book:', error);
    return NextResponse.json(
      { error: 'Failed to issue book' },
      { status: 500 }
    );
  }
}
