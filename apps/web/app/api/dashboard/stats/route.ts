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

    // Get current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: 'No current academic year found' },
        { status: 404 }
      );
    }

    // Get total students count
    const totalStudents = await prisma.student.count({
      where: { status: 'ACTIVE' },
    });

    // Get total teachers count
    const totalTeachers = await prisma.teacher.count({
      where: { status: 'ACTIVE' },
    });

    // Get today's attendance stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentToday = await prisma.studentAttendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: 'PRESENT',
      },
    });

    const attendancePercentage = totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100)
      : 0;

    // Get fee collection stats for current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const feeCollected = await prisma.feePayment.aggregate({
      where: {
        paymentDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        status: 'COMPLETED',
      },
      _sum: {
        paidAmount: true,
      },
    });

    const totalFeeCollected = Number(feeCollected._sum.paidAmount || 0);

    // Get pending fees
    const pendingFees = await prisma.feePayment.aggregate({
      where: {
        status: 'PENDING',
      },
      _sum: {
        dueAmount: true,
      },
    });

    const totalPendingFees = Number(pendingFees._sum.dueAmount || 0);

    // Get recent activities (last 10)
    const recentActivities = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    const activities = recentActivities.map((student: any) => ({
      type: 'student_admission',
      title: 'New Student Admission',
      description: `${student.firstName} ${student.lastName} has been admitted`,
      time: student.createdAt,
    }));

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeachers,
        attendancePercentage,
        totalFeeCollected,
        totalPendingFees,
      },
      recentActivities: activities,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
