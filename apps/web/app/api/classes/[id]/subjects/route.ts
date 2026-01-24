import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/classes/[id]/subjects - Get all subjects for a class
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjects = await prisma.subject.findMany({
      where: { classId: params.id },
      include: {
        assignments: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            timetableSlots: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

// POST /api/classes/[id]/subjects - Create a new subject for a class
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
    const { name, code, type, isOptional, teacherId } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Subject name and code are required' },
        { status: 400 }
      );
    }

    // Check if subject code already exists for this class
    const existingSubject = await prisma.subject.findFirst({
      where: {
        code,
        classId: params.id,
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Subject code already exists for this class' },
        { status: 409 }
      );
    }

    // Create subject
    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        classId: params.id,
        type: type || 'THEORY',
        isOptional: isOptional || false,
      },
    });

    // If teacherId is provided, create assignment
    if (teacherId) {
      await prisma.subjectAssignment.create({
        data: {
          subjectId: newSubject.id,
          teacherId,
        },
      });
    }

    // Fetch the complete subject with assignments
    const completeSubject = await prisma.subject.findUnique({
      where: { id: newSubject.id },
      include: {
        assignments: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(completeSubject, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
