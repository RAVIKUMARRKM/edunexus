import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@edunexus/database';

// Helper function to calculate grade based on percentage
async function calculateGrade(percentage: number): Promise<string> {
  const gradeScales = await prisma.gradeScale.findMany({
    orderBy: {
      minPercent: 'desc',
    },
  });

  for (const scale of gradeScales) {
    const minPercent = parseFloat(scale.minPercent.toString());
    const maxPercent = parseFloat(scale.maxPercent.toString());

    if (percentage >= minPercent && percentage <= maxPercent) {
      return scale.name;
    }
  }

  return 'F';
}

// GET /api/exams/[id]/results - Get exam results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');

    const where: any = {
      examId: params.id,
    };

    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;

    const results = await prisma.examResult.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNo: true,
            admissionNo: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        exam: {
          select: {
            name: true,
            maxMarks: true,
            passingMarks: true,
          },
        },
      },
      orderBy: [
        {
          student: {
            rollNo: 'asc',
          },
        },
        {
          subject: {
            name: 'asc',
          },
        },
      ],
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam results' },
      { status: 500 }
    );
  }
}

// POST /api/exams/[id]/results - Create/Update exam results (bulk)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { results } = body;

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'Results must be a non-empty array' },
        { status: 400 }
      );
    }

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    const maxMarks = exam.maxMarks;

    // Process results in a transaction
    const createdResults = await prisma.$transaction(async (tx) => {
      const savedResults = [];

      for (const result of results) {
        const { studentId, subjectId, marksObtained, isAbsent, remarks } = result;

        // Validate required fields
        if (!studentId || !subjectId) {
          throw new Error('Missing studentId or subjectId');
        }

        // Validate marks
        if (!isAbsent && (marksObtained < 0 || marksObtained > maxMarks)) {
          throw new Error(`Invalid marks for student ${studentId}. Must be between 0 and ${maxMarks}`);
        }

        // Calculate percentage and grade
        const marks = isAbsent ? 0 : parseFloat(marksObtained.toString());
        const percentage = (marks / maxMarks) * 100;
        const grade = isAbsent ? 'AB' : await calculateGrade(percentage);

        // Upsert result
        const savedResult = await tx.examResult.upsert({
          where: {
            examId_studentId_subjectId: {
              examId: params.id,
              studentId,
              subjectId,
            },
          },
          update: {
            marksObtained: new Prisma.Decimal(marks),
            grade,
            isAbsent: isAbsent || false,
            remarks: remarks || null,
          },
          create: {
            examId: params.id,
            studentId,
            subjectId,
            marksObtained: new Prisma.Decimal(marks),
            grade,
            isAbsent: isAbsent || false,
            remarks: remarks || null,
          },
          include: {
            student: {
              select: {
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
        });

        savedResults.push(savedResult);
      }

      return savedResults;
    });

    return NextResponse.json({
      message: 'Results saved successfully',
      count: createdResults.length,
      results: createdResults,
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving exam results:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save exam results' },
      { status: 500 }
    );
  }
}
