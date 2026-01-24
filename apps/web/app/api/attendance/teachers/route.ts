import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

// GET all teachers for attendance marking
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can view/mark teacher attendance
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only admins can access teacher attendance' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const departmentId = searchParams.get('departmentId');

    // Build filter
    const where: any = {
      status: 'ACTIVE',
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    // Get all teachers
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
      },
      orderBy: [
        { user: { name: 'asc' } },
      ],
    });

    // If date is provided, also fetch existing attendance
    let attendanceMap: Record<string, any> = {};
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);

      const attendanceRecords = await prisma.teacherAttendance.findMany({
        where: {
          date: attendanceDate,
          teacherId: { in: teachers.map((t) => t.id) },
        },
      });

      attendanceRecords.forEach((record) => {
        attendanceMap[record.teacherId] = {
          status: record.status,
          inTime: record.inTime,
          outTime: record.outTime,
          remarks: record.remarks,
        };
      });
    }

    // Combine teachers with attendance data
    const teachersWithAttendance = teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      phone: teacher.user.phone,
      employeeId: teacher.employeeId,
      department: teacher.department?.name || '-',
      attendance: attendanceMap[teacher.id] || null,
    }));

    return NextResponse.json({
      teachers: teachersWithAttendance,
      count: teachersWithAttendance.length,
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}
