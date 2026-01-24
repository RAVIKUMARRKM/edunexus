import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/exams - List all exams with filters
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const academicYearId = searchParams.get('academicYearId');
    const classId = searchParams.get('classId');
    const examType = searchParams.get('examType');
    const isPublished = searchParams.get('isPublished');

    const where: any = {};

    if (academicYearId) where.academicYearId = academicYearId;
    if (classId) where.classId = classId;
    if (examType) where.examType = examType;
    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        academicYear: {
          select: {
            name: true,
            isCurrent: true,
          },
        },
        class: {
          select: {
            name: true,
            numericValue: true,
          },
        },
        results: {
          select: {
            id: true,
          },
        },
        schedules: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            results: true,
            schedules: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

// POST /api/exams - Create new exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      academicYearId,
      classId,
      examType,
      startDate,
      endDate,
      maxMarks,
      passingMarks,
      isPublished,
    } = body;

    // Validate required fields
    if (!name || !academicYearId || !classId || !examType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        academicYearId,
        classId,
        examType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxMarks: maxMarks || 100,
        passingMarks: passingMarks || 33,
        isPublished: isPublished || false,
      },
      include: {
        academicYear: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}
