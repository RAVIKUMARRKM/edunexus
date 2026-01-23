import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const attendanceSchema = z.object({
  date: z.string().or(z.date()),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE']),
  remarks: z.string().optional(),
});

// POST /api/students/[id]/attendance - Mark attendance for a student
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validatedData = attendanceSchema.parse(body);

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const attendanceDate = new Date(validatedData.date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.studentAttendance.findUnique({
      where: {
        studentId_date: {
          studentId: params.id,
          date: attendanceDate,
        },
      },
    });

    let attendance;

    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.studentAttendance.update({
        where: {
          studentId_date: {
            studentId: params.id,
            date: attendanceDate,
          },
        },
        data: {
          status: validatedData.status,
          remarks: validatedData.remarks,
        },
      });
    } else {
      // Create new attendance record
      attendance = await prisma.studentAttendance.create({
        data: {
          studentId: params.id,
          date: attendanceDate,
          status: validatedData.status,
          remarks: validatedData.remarks,
          markedBy: 'system', // Should be the current user's ID
        },
      });
    }

    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

// GET /api/students/[id]/attendance - Get student attendance records
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');

    const where: any = {
      studentId: params.id,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (month) {
      const monthDate = new Date(month);
      const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      where.date = {
        gte: firstDay,
        lte: lastDay,
      };
    }

    const attendances = await prisma.studentAttendance.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate statistics
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'PRESENT').length;
    const absent = attendances.filter(a => a.status === 'ABSENT').length;
    const late = attendances.filter(a => a.status === 'LATE').length;
    const halfDay = attendances.filter(a => a.status === 'HALF_DAY').length;
    const leave = attendances.filter(a => a.status === 'LEAVE').length;
    const percentage = total > 0 ? ((present + (halfDay * 0.5)) / total * 100).toFixed(2) : 0;

    return NextResponse.json({
      data: attendances,
      statistics: {
        total,
        present,
        absent,
        late,
        halfDay,
        leave,
        percentage: parseFloat(percentage as string),
      },
    });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
