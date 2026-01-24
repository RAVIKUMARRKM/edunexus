import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get last 7 days attendance trend
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const presentCount = await prisma.studentAttendance.count({
        where: {
          date: {
            gte: date,
            lt: nextDay,
          },
          status: 'PRESENT',
        },
      });

      const absentCount = await prisma.studentAttendance.count({
        where: {
          date: {
            gte: date,
            lt: nextDay,
          },
          status: 'ABSENT',
        },
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: presentCount,
        absent: absentCount,
      });
    }

    // Get last 6 months fee collection
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const collected = await prisma.feePayment.aggregate({
        where: {
          paymentDate: {
            gte: firstDay,
            lte: lastDay,
          },
          status: 'COMPLETED',
        },
        _sum: {
          paidAmount: true,
        },
      });

      const pending = await prisma.feePayment.aggregate({
        where: {
          forMonth: {
            gte: firstDay,
            lte: lastDay,
          },
          status: 'PENDING',
        },
        _sum: {
          dueAmount: true,
        },
      });

      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        collected: Number(collected._sum.paidAmount || 0),
        pending: Number(pending._sum.dueAmount || 0),
      });
    }

    // Get class-wise student distribution
    const classDistribution = await prisma.class.findMany({
      where: {
        academicYear: {
          isCurrent: true,
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            students: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
      orderBy: {
        numericValue: 'asc',
      },
    });

    const classData = classDistribution.map((cls: any) => ({
      class: cls.name,
      students: cls._count.students,
    }));

    return NextResponse.json({
      attendanceTrend: last7Days,
      feeCollection: last6Months,
      classDistribution: classData,
    });
  } catch (error) {
    console.error('Dashboard charts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
