import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers and admins can mark attendance
    const allowedRoles = ['TEACHER', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only teachers and admins can mark attendance' },
        { status: 403 }
      );
    }

    const { date, attendanceRecords } = await request.json();

    if (!date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return NextResponse.json(
        { error: 'Date and attendance records are required' },
        { status: 400 }
      );
    }

    // Validate date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Bulk upsert attendance records
    const results = await Promise.all(
      attendanceRecords.map(async (record: any) => {
        return prisma.studentAttendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks || null,
            markedBy: session.user.id,
          },
          create: {
            studentId: record.studentId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks || null,
            markedBy: session.user.id,
          },
        });
      })
    );

    return NextResponse.json({
      message: 'Attendance marked successfully',
      count: results.length,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
