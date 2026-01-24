import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const returnSchema = z.object({
  fineAmount: z.number().optional(),
  finePaid: z.boolean().default(false),
  remarks: z.string().optional(),
  condition: z.enum(['RETURNED', 'LOST', 'DAMAGED']).default('RETURNED'),
});

// PUT /api/library/issues/[id]/return - Return a book
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = returnSchema.parse(body);

    // Check if issue exists
    const existingIssue = await prisma.bookIssue.findUnique({
      where: { id: params.id },
      include: {
        book: true,
      },
    });

    if (!existingIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    if (existingIssue.status !== 'ISSUED') {
      return NextResponse.json(
        { error: 'Book is already returned' },
        { status: 400 }
      );
    }

    // Calculate fine if overdue
    let fineAmount = validatedData.fineAmount || 0;
    if (existingIssue.dueDate < new Date()) {
      const daysOverdue = Math.ceil(
        (new Date().getTime() - existingIssue.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      fineAmount = daysOverdue * 2; // 2 rupees per day
    }

    // Update issue and book availability
    const [issue] = await prisma.$transaction([
      prisma.bookIssue.update({
        where: { id: params.id },
        data: {
          returnDate: new Date(),
          status: validatedData.condition,
          fineAmount,
          finePaid: validatedData.finePaid,
          returnedTo: session.user.id,
          remarks: validatedData.remarks,
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
      // Only increment available quantity if book is returned in good condition
      validatedData.condition === 'RETURNED'
        ? prisma.book.update({
            where: { id: existingIssue.bookId },
            data: {
              availableQty: { increment: 1 },
            },
          })
        : // If book is lost or damaged, reduce total quantity
          validatedData.condition === 'LOST'
        ? prisma.book.update({
            where: { id: existingIssue.bookId },
            data: {
              quantity: { decrement: 1 },
            },
          })
        : prisma.book.findUnique({ where: { id: existingIssue.bookId } }),
    ]);

    return NextResponse.json({
      ...issue,
      message:
        fineAmount > 0 && !validatedData.finePaid
          ? `Book returned successfully. Fine amount: ${fineAmount}`
          : 'Book returned successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error returning book:', error);
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    );
  }
}
