import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const bookUpdateSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  category: z.string().optional(),
  subject: z.string().optional(),
  language: z.string().optional(),
  pages: z.number().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  availableQty: z.number().optional(),
  shelfLocation: z.string().optional(),
  coverImage: z.string().optional(),
  description: z.string().optional(),
});

// GET /api/library/books/[id] - Get a single book
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        issues: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNo: true,
                rollNo: true,
              },
            },
          },
          orderBy: { issueDate: 'desc' },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/library/books/[id] - Update a book
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
    const validatedData = bookUpdateSchema.parse(body);

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await prisma.book.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/library/books/[id] - Delete a book
export async function DELETE(
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

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        issues: {
          where: {
            status: 'ISSUED',
          },
        },
      },
    });

    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if book has active issues
    if (existingBook.issues.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete book with active issues' },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
