import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { eachDayOfInterval, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Build query filters
    const where: any = {
      date: { gte: start, lte: end },
    };

    if (classId || sectionId) {
      where.student = {};
      if (classId) where.student.classId = classId;
      if (sectionId) where.student.sectionId = sectionId;
    }

    // Get all attendance records
    const attendance = await prisma.studentAttendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const dateMap = new Map<string, any>();

    attendance.forEach((record) => {
      const dateKey = format(new Date(record.date), 'yyyy-MM-dd');

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: record.date,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          leave: 0,
        });
      }

      const dayData = dateMap.get(dateKey);
      dayData.total += 1;

      if (record.status === 'PRESENT') dayData.present += 1;
      else if (record.status === 'ABSENT') dayData.absent += 1;
      else if (record.status === 'LATE') dayData.late += 1;
      else if (record.status === 'HALF_DAY') dayData.halfDay += 1;
      else if (record.status === 'LEAVE') dayData.leave += 1;
    });

    // Calculate daily percentages
    const daily = Array.from(dateMap.values()).map((day) => ({
      date: day.date,
      total: day.total,
      present: day.present,
      absent: day.absent,
      late: day.late,
      halfDay: day.halfDay,
      leave: day.leave,
      attendancePercentage:
        day.total > 0
          ? parseFloat(
              (((day.present + day.late + day.halfDay * 0.5) / day.total) * 100).toFixed(2)
            )
          : 0,
    }));

    // Calculate summary
    const totalRecords = attendance.length;
    const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
    const absentCount = attendance.filter((a) => a.status === 'ABSENT').length;
    const lateCount = attendance.filter((a) => a.status === 'LATE').length;
    const halfDayCount = attendance.filter((a) => a.status === 'HALF_DAY').length;
    const leaveCount = attendance.filter((a) => a.status === 'LEAVE').length;

    const averageAttendance =
      totalRecords > 0
        ? parseFloat(
            (((presentCount + lateCount + halfDayCount * 0.5) / totalRecords) * 100).toFixed(2)
          )
        : 0;

    // Find highest and lowest attendance days
    const sortedDays = [...daily].sort(
      (a, b) => b.attendancePercentage - a.attendancePercentage
    );
    const highestDay = sortedDays[0];
    const lowestDay = sortedDays[sortedDays.length - 1];

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(daily.length / 2);
    const firstHalf = daily.slice(0, midpoint);
    const secondHalf = daily.slice(midpoint);

    const firstHalfAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, day) => sum + day.attendancePercentage, 0) / firstHalf.length
        : 0;
    const secondHalfAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, day) => sum + day.attendancePercentage, 0) / secondHalf.length
        : 0;
    const trend = parseFloat((secondHalfAvg - firstHalfAvg).toFixed(2));

    // Distribution
    const distribution = {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      halfDay: halfDayCount,
      leave: leaveCount,
      presentPercent: totalRecords > 0 ? parseFloat(((presentCount / totalRecords) * 100).toFixed(2)) : 0,
      absentPercent: totalRecords > 0 ? parseFloat(((absentCount / totalRecords) * 100).toFixed(2)) : 0,
      latePercent: totalRecords > 0 ? parseFloat(((lateCount / totalRecords) * 100).toFixed(2)) : 0,
      halfDayPercent: totalRecords > 0 ? parseFloat(((halfDayCount / totalRecords) * 100).toFixed(2)) : 0,
      leavePercent: totalRecords > 0 ? parseFloat(((leaveCount / totalRecords) * 100).toFixed(2)) : 0,
    };

    return NextResponse.json({
      summary: {
        totalDays: daily.length,
        averageAttendance,
        highestAttendance: highestDay?.attendancePercentage || 0,
        highestDate: highestDay?.date || null,
        lowestAttendance: lowestDay?.attendancePercentage || 0,
        lowestDate: lowestDay?.date || null,
        trend,
      },
      daily,
      distribution,
      dateRange: { start, end },
    });
  } catch (error) {
    console.error('Attendance trends error:', error);
    return NextResponse.json(
      { error: 'Failed to generate trends' },
      { status: 500 }
    );
  }
}
