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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (type === 'summary' && studentId) {
      // Student-wise summary
      const attendance = await prisma.studentAttendance.findMany({
        where: {
          studentId,
          date: { gte: start, lte: end },
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              admissionNo: true,
              class: { select: { name: true } },
              section: { select: { name: true } },
            },
          },
        },
        orderBy: { date: 'asc' },
      });

      const totalDays = attendance.length;
      const present = attendance.filter((a) => a.status === 'PRESENT').length;
      const absent = attendance.filter((a) => a.status === 'ABSENT').length;
      const late = attendance.filter((a) => a.status === 'LATE').length;
      const halfDay = attendance.filter((a) => a.status === 'HALF_DAY').length;
      const leave = attendance.filter((a) => a.status === 'LEAVE').length;

      const attendancePercentage = totalDays > 0
        ? ((present + halfDay * 0.5 + late) / totalDays) * 100
        : 0;

      return NextResponse.json({
        student: attendance[0]?.student,
        summary: {
          totalDays,
          present,
          absent,
          late,
          halfDay,
          leave,
          attendancePercentage: attendancePercentage.toFixed(2),
        },
        records: attendance,
      });
    }

    if (type === 'class' && classId) {
      // Class-wise summary
      const students = await prisma.student.findMany({
        where: {
          classId,
          sectionId: sectionId || undefined,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admissionNo: true,
          rollNo: true,
        },
        orderBy: { rollNo: 'asc' },
      });

      const studentsWithAttendance = await Promise.all(
        students.map(async (student) => {
          const attendance = await prisma.studentAttendance.findMany({
            where: {
              studentId: student.id,
              date: { gte: start, lte: end },
            },
          });

          const totalDays = attendance.length;
          const present = attendance.filter((a) => a.status === 'PRESENT').length;
          const absent = attendance.filter((a) => a.status === 'ABSENT').length;

          const attendancePercentage = totalDays > 0
            ? ((present + attendance.filter((a) => a.status === 'HALF_DAY').length * 0.5 +
                attendance.filter((a) => a.status === 'LATE').length) / totalDays) * 100
            : 0;

          return {
            ...student,
            totalDays,
            present,
            absent,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
          };
        })
      );

      return NextResponse.json({
        students: studentsWithAttendance,
        dateRange: { start, end },
      });
    }

    if (type === 'defaulters') {
      // Low attendance students (below 75%)
      const threshold = parseFloat(searchParams.get('threshold') || '75');

      const students = await prisma.student.findMany({
        where: {
          classId: classId || undefined,
          sectionId: sectionId || undefined,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admissionNo: true,
          rollNo: true,
          class: { select: { name: true } },
          section: { select: { name: true } },
          user: { select: { phone: true, email: true } },
        },
      });

      const defaulters = [];

      for (const student of students) {
        const attendance = await prisma.studentAttendance.findMany({
          where: {
            studentId: student.id,
            date: { gte: start, lte: end },
          },
        });

        const totalDays = attendance.length;
        if (totalDays === 0) continue;

        const present = attendance.filter((a) => a.status === 'PRESENT').length;
        const attendancePercentage =
          ((present + attendance.filter((a) => a.status === 'HALF_DAY').length * 0.5 +
            attendance.filter((a) => a.status === 'LATE').length) / totalDays) * 100;

        if (attendancePercentage < threshold) {
          defaulters.push({
            ...student,
            totalDays,
            present,
            absent: attendance.filter((a) => a.status === 'ABSENT').length,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
          });
        }
      }

      return NextResponse.json({
        defaulters: defaulters.sort((a, b) => a.attendancePercentage - b.attendancePercentage),
        threshold,
        dateRange: { start, end },
      });
    }

    // Monthly overview
    const attendance = await prisma.studentAttendance.findMany({
      where: {
        date: { gte: start, lte: end },
        student: classId || sectionId ? {
          classId: classId || undefined,
          sectionId: sectionId || undefined,
        } : undefined,
      },
    });

    const totalRecords = attendance.length;
    const present = attendance.filter((a) => a.status === 'PRESENT').length;
    const absent = attendance.filter((a) => a.status === 'ABSENT').length;
    const late = attendance.filter((a) => a.status === 'LATE').length;
    const halfDay = attendance.filter((a) => a.status === 'HALF_DAY').length;
    const leave = attendance.filter((a) => a.status === 'LEAVE').length;

    return NextResponse.json({
      overview: {
        totalRecords,
        present,
        absent,
        late,
        halfDay,
        leave,
        attendancePercentage: totalRecords > 0
          ? (((present + halfDay * 0.5 + late) / totalRecords) * 100).toFixed(2)
          : '0',
      },
      dateRange: { start, end },
    });
  } catch (error) {
    console.error('Attendance report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
