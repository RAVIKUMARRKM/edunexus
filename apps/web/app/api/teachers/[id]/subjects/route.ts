import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/teachers/[id]/subjects - Get teacher's subject assignments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignments = await prisma.subjectAssignment.findMany({
      where: {
        teacherId: params.id,
      },
      include: {
        subject: {
          include: {
            class: {
              include: {
                academicYear: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching subject assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject assignments' },
      { status: 500 }
    );
  }
}

// POST /api/teachers/[id]/subjects - Assign subject to teacher
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { subjectId } = body;

    // Validate required fields
    if (!subjectId) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
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

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.subjectAssignment.findUnique({
      where: {
        subjectId_teacherId: {
          subjectId,
          teacherId: params.id,
        },
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'This subject is already assigned to this teacher' },
        { status: 400 }
      );
    }

    // Create assignment
    const assignment = await prisma.subjectAssignment.create({
      data: {
        subjectId,
        teacherId: params.id,
      },
      include: {
        subject: {
          include: {
            class: {
              include: {
                academicYear: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating subject assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create subject assignment' },
      { status: 500 }
    );
  }
}

// DELETE /api/teachers/[id]/subjects - Remove subject assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const assignment = await prisma.subjectAssignment.findUnique({
      where: {
        subjectId_teacherId: {
          subjectId,
          teacherId: params.id,
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Delete assignment
    await prisma.subjectAssignment.delete({
      where: {
        subjectId_teacherId: {
          subjectId,
          teacherId: params.id,
        },
      },
    });

    return NextResponse.json({ message: 'Subject assignment removed successfully' });
  } catch (error) {
    console.error('Error deleting subject assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject assignment' },
      { status: 500 }
    );
  }
}
