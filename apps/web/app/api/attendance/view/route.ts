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
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const date = searchParams.get('date');

    // Build query filters
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    } else if (classId || sectionId) {
      where.student = {};
      if (classId) where.student.classId = classId;
      if (sectionId) where.student.sectionId = sectionId;
    }

    if (date) {
      const specificDate = new Date(date);
      specificDate.setHours(0, 0, 0, 0);
      where.date = specificDate;
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }

    const attendance = await prisma.studentAttendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            rollNo: true,
            class: { select: { name: true } },
            section: { select: { name: true } },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { student: { rollNo: 'asc' } }],
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('View attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
