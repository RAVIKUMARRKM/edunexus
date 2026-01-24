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

    // Get today's date for queries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Run all queries in parallel for better performance
    const [
      currentYear,
      totalStudents,
      totalTeachers,
      presentToday,
      feeCollected,
      pendingFees,
      recentActivities,
    ] = await Promise.all([
      prisma.academicYear.findFirst({
        where: { isCurrent: true },
        select: { id: true, name: true },
      }),
      prisma.student.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.teacher.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.studentAttendance.count({
        where: {
          date: { gte: today, lt: tomorrow },
          status: 'PRESENT',
        },
      }),
      prisma.feePayment.aggregate({
        where: {
          paymentDate: { gte: firstDayOfMonth, lte: lastDayOfMonth },
          status: 'COMPLETED',
        },
        _sum: { paidAmount: true },
      }),
      prisma.feePayment.aggregate({
        where: { status: 'PENDING' },
        _sum: { dueAmount: true },
      }),
      prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      }),
    ]);

    if (!currentYear) {
      return NextResponse.json(
        { error: 'No current academic year found' },
        { status: 404 }
      );
    }

    const attendancePercentage = totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100)
      : 0;

    const totalFeeCollected = Number(feeCollected._sum.paidAmount || 0);
    const totalPendingFees = Number(pendingFees._sum.dueAmount || 0);

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
