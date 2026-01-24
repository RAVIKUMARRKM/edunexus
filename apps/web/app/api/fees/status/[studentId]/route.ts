import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId } = params;

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicYear) {
      return NextResponse.json(
        { error: 'No current academic year found' },
        { status: 404 }
      );
    }

    // Get applicable fee structures
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        academicYearId: currentAcademicYear.id,
        OR: [
          { classId: student.classId },
          { classId: null }, // Global fees
        ],
      },
    });

    // Get all payments for this student
    const payments = await prisma.feePayment.findMany({
      where: {
        studentId,
        feeStructure: {
          academicYearId: currentAcademicYear.id,
        },
      },
      include: {
        feeStructure: true,
      },
    });

    // Get concessions
    const concessions = await prisma.feeConcession.findMany({
      where: {
        studentId,
        feeStructure: {
          academicYearId: currentAcademicYear.id,
        },
        validFrom: {
          lte: new Date(),
        },
        validTo: {
          gte: new Date(),
        },
      },
      include: {
        feeStructure: true,
      },
    });

    // Calculate fee status for each structure
    const feeStatus = feeStructures.map((structure) => {
      const structurePayments = payments.filter(
        (p) => p.feeStructureId === structure.id
      );
      const structureConcession = concessions.find(
        (c) => c.feeStructureId === structure.id
      );

      const totalPaid = structurePayments.reduce(
        (sum, p) => sum + Number(p.paidAmount),
        0
      );
      const totalDue = structurePayments.reduce(
        (sum, p) => sum + Number(p.dueAmount),
        0
      );

      // Calculate total amount based on frequency
      let totalAmount = Number(structure.amount);
      if (structure.frequency === 'MONTHLY') {
        totalAmount *= 12;
      } else if (structure.frequency === 'QUARTERLY') {
        totalAmount *= 4;
      } else if (structure.frequency === 'HALF_YEARLY') {
        totalAmount *= 2;
      }

      // Apply concession
      let concessionAmount = 0;
      if (structureConcession) {
        if (structureConcession.percentage) {
          concessionAmount =
            (totalAmount * Number(structureConcession.percentage)) / 100;
        } else {
          concessionAmount = Number(structureConcession.amount);
        }
      }

      const netAmount = totalAmount - concessionAmount;
      const balance = netAmount - totalPaid;

      return {
        feeStructure: structure,
        totalAmount,
        concessionAmount,
        netAmount,
        totalPaid,
        balance,
        status:
          balance <= 0
            ? 'PAID'
            : totalPaid > 0
            ? 'PARTIAL'
            : 'UNPAID',
        concession: structureConcession,
      };
    });

    // Calculate overall totals
    const overallTotal = feeStatus.reduce((sum, f) => sum + f.netAmount, 0);
    const overallPaid = feeStatus.reduce((sum, f) => sum + f.totalPaid, 0);
    const overallBalance = overallTotal - overallPaid;

    return NextResponse.json({
      student,
      academicYear: currentAcademicYear,
      feeStatus,
      summary: {
        totalAmount: overallTotal,
        totalPaid: overallPaid,
        totalBalance: overallBalance,
        totalConcession: feeStatus.reduce((sum, f) => sum + f.concessionAmount, 0),
      },
      recentPayments: payments.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching fee status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee status' },
      { status: 500 }
    );
  }
}
