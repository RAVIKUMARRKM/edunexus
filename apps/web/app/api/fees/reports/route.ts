import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const classId = searchParams.get('classId');

    const dateFilter: any = {};
    if (fromDate) dateFilter.gte = new Date(fromDate);
    if (toDate) dateFilter.lte = new Date(toDate);

    switch (reportType) {
      case 'collection-summary':
        return getCollectionSummary(dateFilter);

      case 'defaulters':
        return getDefaulters(classId);

      case 'payment-mode':
        return getPaymentModeReport(dateFilter);

      case 'class-wise':
        return getClassWiseReport(dateFilter);

      case 'monthly-collection':
        return getMonthlyCollection();

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

async function getCollectionSummary(dateFilter: any) {
  const payments = await prisma.feePayment.findMany({
    where: {
      paymentDate: dateFilter,
      status: 'COMPLETED',
    },
    include: {
      feeStructure: {
        select: {
          feeType: true,
        },
      },
    },
  });

  const summary = {
    totalCollected: payments.reduce((sum, p) => sum + Number(p.paidAmount), 0),
    totalDiscount: payments.reduce((sum, p) => sum + Number(p.discount), 0),
    totalLateFee: payments.reduce((sum, p) => sum + Number(p.lateFee), 0),
    transactionCount: payments.length,
    byFeeType: {} as Record<string, number>,
  };

  payments.forEach((payment) => {
    const feeType = payment.feeStructure.feeType;
    summary.byFeeType[feeType] =
      (summary.byFeeType[feeType] || 0) + Number(payment.paidAmount);
  });

  return NextResponse.json(summary);
}

async function getDefaulters(classId: string | null) {
  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true },
  });

  if (!currentAcademicYear) {
    return NextResponse.json(
      { error: 'No current academic year found' },
      { status: 404 }
    );
  }

  const where: any = {
    status: 'ACTIVE',
  };
  if (classId) where.classId = classId;

  const students = await prisma.student.findMany({
    where,
    include: {
      class: true,
      section: true,
      feePayments: {
        where: {
          feeStructure: {
            academicYearId: currentAcademicYear.id,
          },
        },
      },
      user: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });

  const defaulters = [];

  for (const student of students) {
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        academicYearId: currentAcademicYear.id,
        OR: [{ classId: student.classId }, { classId: null }],
      },
    });

    let totalDue = 0;
    feeStructures.forEach((structure) => {
      const payments = student.feePayments.filter(
        (p) => p.feeStructureId === structure.id
      );
      const totalPaid = payments.reduce(
        (sum, p) => sum + Number(p.paidAmount),
        0
      );

      let totalAmount = Number(structure.amount);
      if (structure.frequency === 'MONTHLY') totalAmount *= 12;
      else if (structure.frequency === 'QUARTERLY') totalAmount *= 4;
      else if (structure.frequency === 'HALF_YEARLY') totalAmount *= 2;

      const due = totalAmount - totalPaid;
      if (due > 0) totalDue += due;
    });

    if (totalDue > 0) {
      defaulters.push({
        studentId: student.id,
        admissionNo: student.admissionNo,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class?.name,
        section: student.section?.name,
        phone: student.user.phone,
        totalDue,
      });
    }
  }

  return NextResponse.json({
    defaulters,
    summary: {
      count: defaulters.length,
      totalDueAmount: defaulters.reduce((sum, d) => sum + d.totalDue, 0),
    },
  });
}

async function getPaymentModeReport(dateFilter: any) {
  const payments = await prisma.feePayment.findMany({
    where: {
      paymentDate: dateFilter,
      status: 'COMPLETED',
    },
  });

  const byMode: Record<string, { count: number; amount: number }> = {};

  payments.forEach((payment) => {
    const mode = payment.paymentMode;
    if (!byMode[mode]) {
      byMode[mode] = { count: 0, amount: 0 };
    }
    byMode[mode].count++;
    byMode[mode].amount += Number(payment.paidAmount);
  });

  return NextResponse.json({
    byMode,
    total: {
      count: payments.length,
      amount: payments.reduce((sum, p) => sum + Number(p.paidAmount), 0),
    },
  });
}

async function getClassWiseReport(dateFilter: any) {
  const payments = await prisma.feePayment.findMany({
    where: {
      paymentDate: dateFilter,
      status: 'COMPLETED',
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
    },
  });

  const byClass: Record<string, { count: number; amount: number }> = {};

  payments.forEach((payment) => {
    const className = payment.student.class?.name || 'No Class';
    if (!byClass[className]) {
      byClass[className] = { count: 0, amount: 0 };
    }
    byClass[className].count++;
    byClass[className].amount += Number(payment.paidAmount);
  });

  return NextResponse.json({
    byClass,
    total: {
      count: payments.length,
      amount: payments.reduce((sum, p) => sum + Number(p.paidAmount), 0),
    },
  });
}

async function getMonthlyCollection() {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const payments = await prisma.feePayment.findMany({
    where: {
      paymentDate: {
        gte: startDate,
        lte: endDate,
      },
      status: 'COMPLETED',
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
    amount: 0,
    count: 0,
  }));

  payments.forEach((payment) => {
    const month = payment.paymentDate.getMonth();
    monthlyData[month].amount += Number(payment.paidAmount);
    monthlyData[month].count++;
  });

  return NextResponse.json({
    monthlyData,
    yearTotal: monthlyData.reduce((sum, m) => sum + m.amount, 0),
  });
}
