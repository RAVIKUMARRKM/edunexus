import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { z } from 'zod';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  feeStructureId: z.string().min(1, 'Fee structure ID is required'),
  amount: z.number().positive('Amount must be positive'),
  discount: z.number().min(0).default(0),
  lateFee: z.number().min(0).default(0),
  paidAmount: z.number().positive('Paid amount must be positive'),
  paymentMode: z.enum(['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'DD']),
  transactionId: z.string().optional(),
  forMonth: z.string().min(1, 'Month is required'),
  remarks: z.string().optional(),
});

// Helper function to generate receipt number
async function generateReceiptNo(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');

  // Get the last receipt of the month
  const lastReceipt = await prisma.feePayment.findFirst({
    where: {
      receiptNo: {
        startsWith: `RCP${year}${month}`,
      },
    },
    orderBy: {
      receiptNo: 'desc',
    },
  });

  let sequence = 1;
  if (lastReceipt) {
    const lastSequence = parseInt(lastReceipt.receiptNo.slice(-4));
    sequence = lastSequence + 1;
  }

  return `RCP${year}${month}${sequence.toString().padStart(4, '0')}`;
}

// GET - Fetch payments
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.paymentDate = {};
      if (fromDate) where.paymentDate.gte = new Date(fromDate);
      if (toDate) where.paymentDate.lte = new Date(toDate);
    }

    const payments = await prisma.feePayment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
        feeStructure: {
          select: {
            id: true,
            name: true,
            feeType: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST - Create new payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    if (!['ADMIN', 'SUPER_ADMIN', 'ACCOUNTANT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    // Generate receipt number
    const receiptNo = await generateReceiptNo();

    // Calculate total and due amount
    const totalAmount = validatedData.amount + validatedData.lateFee - validatedData.discount;
    const dueAmount = totalAmount - validatedData.paidAmount;

    const payment = await prisma.feePayment.create({
      data: {
        receiptNo,
        studentId: validatedData.studentId,
        feeStructureId: validatedData.feeStructureId,
        amount: validatedData.amount,
        discount: validatedData.discount,
        lateFee: validatedData.lateFee,
        totalAmount,
        paidAmount: validatedData.paidAmount,
        dueAmount,
        paymentMode: validatedData.paymentMode,
        transactionId: validatedData.transactionId,
        forMonth: new Date(validatedData.forMonth),
        status: dueAmount > 0 ? 'PENDING' : 'COMPLETED',
        remarks: validatedData.remarks,
        receivedBy: session.user.id,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
        feeStructure: {
          select: {
            id: true,
            name: true,
            feeType: true,
            amount: true,
          },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
