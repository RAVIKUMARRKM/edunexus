import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/exams/[id]/students - Get all students for an exam's class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the exam to find the class
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      select: {
        classId: true,
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Fetch all students in that class
    const students = await prisma.student.findMany({
      where: {
        classId: exam.classId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNo: true,
        admissionNo: true,
      },
      orderBy: {
        rollNo: 'asc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
