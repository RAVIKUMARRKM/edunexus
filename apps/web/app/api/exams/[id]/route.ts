import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/exams/[id] - Get single exam
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.exam.findUnique({
      where: {
        id: params.id,
      },
      include: {
        academicYear: {
          select: {
            name: true,
            startDate: true,
            endDate: true,
          },
        },
        class: {
          select: {
            name: true,
            numericValue: true,
            subjects: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
              },
            },
          },
        },
        schedules: {
          include: {
            exam: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
        results: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                rollNo: true,
              },
            },
            subject: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
        _count: {
          select: {
            results: true,
            schedules: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}

// PUT /api/exams/[id] - Update exam
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      examType,
      startDate,
      endDate,
      maxMarks,
      passingMarks,
      isPublished,
    } = body;

    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id: params.id },
    });

    if (!existingExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (examType) updateData.examType = examType;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (maxMarks !== undefined) updateData.maxMarks = maxMarks;
    if (passingMarks !== undefined) updateData.passingMarks = passingMarks;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const exam = await prisma.exam.update({
      where: {
        id: params.id,
      },
      data: updateData,
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

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

// DELETE /api/exams/[id] - Delete exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            results: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check if exam has results
    if (exam._count.results > 0) {
      return NextResponse.json(
        { error: 'Cannot delete exam with existing results' },
        { status: 400 }
      );
    }

    await prisma.exam.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}
