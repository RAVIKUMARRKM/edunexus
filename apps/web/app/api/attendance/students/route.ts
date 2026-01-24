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
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const date = searchParams.get('date');

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Get students
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
        photo: true,
      },
      orderBy: { rollNo: 'asc' },
    });

    // Get existing attendance for the date
    const existingAttendance = await prisma.studentAttendance.findMany({
      where: {
        date: attendanceDate,
        studentId: { in: students.map((s) => s.id) },
      },
    });

    // Map existing attendance to students
    const studentsWithAttendance = students.map((student) => {
      const attendance = existingAttendance.find((a) => a.studentId === student.id);
      return {
        ...student,
        attendance: attendance ? {
          status: attendance.status,
          remarks: attendance.remarks,
        } : null,
      };
    });

    return NextResponse.json({
      students: studentsWithAttendance,
      date: attendanceDate,
    });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
