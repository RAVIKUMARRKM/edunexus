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

    // Only admins can view teacher attendance reports
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only admins can view teacher attendance reports' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'summary';
    const departmentId = searchParams.get('departmentId');
    const teacherId = searchParams.get('teacherId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (reportType === 'overview') {
      // Overview report - aggregate statistics
      const where: any = {
        date: { gte: start, lte: end },
      };

      if (departmentId) {
        where.teacher = { departmentId };
      }

      if (teacherId) {
        where.teacherId = teacherId;
      }

      const attendance = await prisma.teacherAttendance.findMany({ where });

      const totalRecords = attendance.length;
      const present = attendance.filter((a) => a.status === 'PRESENT').length;
      const absent = attendance.filter((a) => a.status === 'ABSENT').length;
      const late = attendance.filter((a) => a.status === 'LATE').length;
      const halfDay = attendance.filter((a) => a.status === 'HALF_DAY').length;
      const leave = attendance.filter((a) => a.status === 'LEAVE').length;

      const attendancePercentage =
        totalRecords > 0
          ? parseFloat(
              (((present + late + halfDay * 0.5) / totalRecords) * 100).toFixed(2)
            )
          : 0;

      return NextResponse.json({
        totalRecords,
        present,
        absent,
        late,
        halfDay,
        leave,
        attendancePercentage,
        dateRange: { start, end },
      });
    }

    if (reportType === 'summary') {
      // Summary report - teacher-wise attendance
      const where: any = {
        status: 'ACTIVE',
      };

      if (departmentId) {
        where.departmentId = departmentId;
      }

      if (teacherId) {
        where.id = teacherId;
      }

      const teachers = await prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
          attendance: {
            where: {
              date: { gte: start, lte: end },
            },
          },
        },
      });

      const summary = teachers.map((teacher) => {
        const totalDays = teacher.attendance.length;
        const present = teacher.attendance.filter((a) => a.status === 'PRESENT').length;
        const absent = teacher.attendance.filter((a) => a.status === 'ABSENT').length;
        const late = teacher.attendance.filter((a) => a.status === 'LATE').length;
        const halfDay = teacher.attendance.filter((a) => a.status === 'HALF_DAY').length;
        const leave = teacher.attendance.filter((a) => a.status === 'LEAVE').length;

        const attendancePercentage =
          totalDays > 0
            ? parseFloat(
                (((present + late + halfDay * 0.5) / totalDays) * 100).toFixed(2)
              )
            : 0;

        return {
          id: teacher.id,
          name: teacher.user.name,
          email: teacher.user.email,
          employeeId: teacher.employeeId,
          department: teacher.department?.name || '-',
          totalDays,
          present,
          absent,
          late,
          halfDay,
          leave,
          attendancePercentage,
        };
      });

      return NextResponse.json({
        teachers: summary,
        dateRange: { start, end },
      });
    }

    if (reportType === 'defaulters') {
      // Defaulters report - teachers with low attendance
      const threshold = parseFloat(searchParams.get('threshold') || '75');

      const where: any = {
        status: 'ACTIVE',
      };

      if (departmentId) {
        where.departmentId = departmentId;
      }

      const teachers = await prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
          attendance: {
            where: {
              date: { gte: start, lte: end },
            },
          },
        },
      });

      const defaulters = teachers
        .map((teacher) => {
          const totalDays = teacher.attendance.length;
          const present = teacher.attendance.filter((a) => a.status === 'PRESENT').length;
          const late = teacher.attendance.filter((a) => a.status === 'LATE').length;
          const halfDay = teacher.attendance.filter((a) => a.status === 'HALF_DAY').length;
          const absent = teacher.attendance.filter((a) => a.status === 'ABSENT').length;
          const leave = teacher.attendance.filter((a) => a.status === 'LEAVE').length;

          const attendancePercentage =
            totalDays > 0
              ? parseFloat(
                  (((present + late + halfDay * 0.5) / totalDays) * 100).toFixed(2)
                )
              : 0;

          return {
            id: teacher.id,
            name: teacher.user.name,
            email: teacher.user.email,
            phone: teacher.user.phone,
            employeeId: teacher.employeeId,
            department: teacher.department?.name || '-',
            totalDays,
            present,
            absent,
            late,
            halfDay,
            leave,
            attendancePercentage,
          };
        })
        .filter((teacher) => teacher.attendancePercentage < threshold && teacher.totalDays > 0)
        .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

      return NextResponse.json({
        defaulters,
        threshold,
        count: defaulters.length,
        dateRange: { start, end },
      });
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    console.error('Teacher attendance reports error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
