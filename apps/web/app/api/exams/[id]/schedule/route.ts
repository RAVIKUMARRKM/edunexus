import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/exams/[id]/schedule - Get exam schedule
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedules = await prisma.examSchedule.findMany({
      where: {
        examId: params.id,
      },
      include: {
        exam: {
          select: {
            name: true,
            maxMarks: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching exam schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam schedule' },
      { status: 500 }
    );
  }
}

// POST /api/exams/[id]/schedule - Create exam schedule
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { subjectId, date, startTime, endTime, roomNo } = body;

    // Validate required fields
    if (!subjectId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check if schedule already exists for this subject
    const existingSchedule = await prisma.examSchedule.findUnique({
      where: {
        examId_subjectId: {
          examId: params.id,
          subjectId,
        },
      },
    });

    if (existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule already exists for this subject' },
        { status: 400 }
      );
    }

    // Validate date is within exam period
    const scheduleDate = new Date(date);
    if (scheduleDate < exam.startDate || scheduleDate > exam.endDate) {
      return NextResponse.json(
        { error: 'Schedule date must be within exam period' },
        { status: 400 }
      );
    }

    const schedule = await prisma.examSchedule.create({
      data: {
        examId: params.id,
        subjectId,
        date: new Date(date),
        startTime,
        endTime,
        roomNo: roomNo || null,
      },
      include: {
        exam: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating exam schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create exam schedule' },
      { status: 500 }
    );
  }
}
