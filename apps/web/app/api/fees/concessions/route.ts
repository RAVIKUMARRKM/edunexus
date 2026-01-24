import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const concessionSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  feeStructureId: z.string().min(1, 'Fee structure ID is required'),
  concessionType: z.enum([
    'SCHOLARSHIP',
    'SIBLING_DISCOUNT',
    'STAFF_WARD',
    'MERIT_BASED',
    'FINANCIAL_AID',
    'OTHER',
  ]),
  amount: z.number().min(0).optional(),
  percentage: z.number().min(0).max(100).optional(),
  reason: z.string().optional(),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validTo: z.string().min(1, 'Valid to date is required'),
});

// GET - Fetch concessions
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const feeStructureId = searchParams.get('feeStructureId');

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (feeStructureId) where.feeStructureId = feeStructureId;

    const concessions = await prisma.feeConcession.findMany({
      where,
      include: {
        feeStructure: {
          select: {
            id: true,
            name: true,
            feeType: true,
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(concessions);
  } catch (error) {
    console.error('Error fetching concessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concessions' },
      { status: 500 }
    );
  }
}

// POST - Create new concession
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    if (!['ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = concessionSchema.parse(body);

    // Validate that either amount or percentage is provided
    if (!validatedData.amount && !validatedData.percentage) {
      return NextResponse.json(
        { error: 'Either amount or percentage must be provided' },
        { status: 400 }
      );
    }

    const concession = await prisma.feeConcession.create({
      data: {
        studentId: validatedData.studentId,
        feeStructureId: validatedData.feeStructureId,
        concessionType: validatedData.concessionType,
        amount: validatedData.amount || 0,
        percentage: validatedData.percentage || null,
        reason: validatedData.reason,
        validFrom: new Date(validatedData.validFrom),
        validTo: new Date(validatedData.validTo),
        approvedBy: session.user.id,
      },
      include: {
        feeStructure: true,
      },
    });

    return NextResponse.json(concession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating concession:', error);
    return NextResponse.json(
      { error: 'Failed to create concession' },
      { status: 500 }
    );
  }
}
