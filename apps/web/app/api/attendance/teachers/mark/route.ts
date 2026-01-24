import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can mark teacher attendance
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only admins can mark teacher attendance' },
        { status: 403 }
      );
    }

    const { date, records } = await request.json();

    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'Date and records are required' },
        { status: 400 }
      );
    }

    // Normalize date to midnight
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Upsert attendance records
    const results = await Promise.all(
      records.map((record: any) =>
        prisma.teacherAttendance.upsert({
          where: {
            teacherId_date: {
              teacherId: record.teacherId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status,
            inTime: record.inTime ? new Date(record.inTime) : null,
            outTime: record.outTime ? new Date(record.outTime) : null,
            remarks: record.remarks || null,
          },
          create: {
            teacherId: record.teacherId,
            date: attendanceDate,
            status: record.status,
            inTime: record.inTime ? new Date(record.inTime) : null,
            outTime: record.outTime ? new Date(record.outTime) : null,
            remarks: record.remarks || null,
          },
        })
      )
    );

    return NextResponse.json({
      message: 'Teacher attendance marked successfully',
      count: results.length,
    });
  } catch (error) {
    console.error('Mark teacher attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
