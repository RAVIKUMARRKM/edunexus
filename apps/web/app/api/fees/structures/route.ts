import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const feeStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().optional().nullable(),
  feeType: z.enum([
    'TUITION',
    'ADMISSION',
    'TRANSPORT',
    'HOSTEL',
    'LIBRARY',
    'LABORATORY',
    'SPORTS',
    'EXAM',
    'OTHER',
  ]),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY']),
  dueDay: z.number().min(1).max(31).default(10),
  lateFee: z.number().min(0).default(0),
  isOptional: z.boolean().default(false),
});

// GET - Fetch all fee structures
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const academicYearId = searchParams.get('academicYearId');
    const classId = searchParams.get('classId');
    const feeType = searchParams.get('feeType');

    const where: any = {};
    if (academicYearId) where.academicYearId = academicYearId;
    if (classId) where.classId = classId;
    if (feeType) where.feeType = feeType;

    const feeStructures = await prisma.feeStructure.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feeStructures);
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee structures' },
      { status: 500 }
    );
  }
}

// POST - Create new fee structure
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission (admin, accountant)
    if (!['ADMIN', 'SUPER_ADMIN', 'ACCOUNTANT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = feeStructureSchema.parse(body);

    const feeStructure = await prisma.feeStructure.create({
      data: {
        ...validatedData,
        classId: validatedData.classId || null,
      },
      include: {
        academicYear: true,
        class: true,
      },
    });

    return NextResponse.json(feeStructure, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating fee structure:', error);
    return NextResponse.json(
      { error: 'Failed to create fee structure' },
      { status: 500 }
    );
  }
}
