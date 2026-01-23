import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// POST /api/teachers/[id]/attendance - Mark teacher attendance
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { date, status, inTime, outTime, remarks } = body;

    // Validate required fields
    if (!date || !status) {
      return NextResponse.json(
        { error: 'Date and status are required' },
        { status: 400 }
      );
    }

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.teacherAttendance.findUnique({
      where: {
        teacherId_date: {
          teacherId: params.id,
          date: new Date(date),
        },
      },
    });

    let attendance;

    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.teacherAttendance.update({
        where: {
          teacherId_date: {
            teacherId: params.id,
            date: new Date(date),
          },
        },
        data: {
          status,
          ...(inTime && { inTime: new Date(inTime) }),
          ...(outTime && { outTime: new Date(outTime) }),
          remarks,
        },
      });
    } else {
      // Create new attendance
      attendance = await prisma.teacherAttendance.create({
        data: {
          teacherId: params.id,
          date: new Date(date),
          status,
          ...(inTime && { inTime: new Date(inTime) }),
          ...(outTime && { outTime: new Date(outTime) }),
          remarks,
        },
      });
    }

    return NextResponse.json(attendance, { status: existingAttendance ? 200 : 201 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

// GET /api/teachers/[id]/attendance - Get teacher attendance
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month'); // Format: YYYY-MM

    const where: any = { teacherId: params.id };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (month) {
      const [year, monthNum] = month.split('-');
      const start = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const end = new Date(parseInt(year), parseInt(monthNum), 0);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    const attendances = await prisma.teacherAttendance.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate statistics
    const stats = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'PRESENT').length,
      absent: attendances.filter(a => a.status === 'ABSENT').length,
      late: attendances.filter(a => a.status === 'LATE').length,
      halfDay: attendances.filter(a => a.status === 'HALF_DAY').length,
      leave: attendances.filter(a => a.status === 'LEAVE').length,
    };

    return NextResponse.json({
      attendances,
      stats,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
