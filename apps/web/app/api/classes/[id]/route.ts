import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/classes/[id] - Get a single class
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

    const classData = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        academicYear: true,
        classTeacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        sections: {
          include: {
            _count: {
              select: {
                students: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        subjects: {
          include: {
            assignments: {
              include: {
                teacher: {
                  include: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        _count: {
          select: {
            students: true,
            sections: true,
            subjects: true,
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

// PUT /api/classes/[id] - Update a class
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, numericValue, classTeacherId, roomNo, capacity } = body;

    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(numericValue && { numericValue: parseInt(numericValue) }),
        ...(classTeacherId !== undefined && { classTeacherId }),
        ...(roomNo !== undefined && { roomNo }),
        ...(capacity && { capacity: parseInt(capacity) }),
      },
      include: {
        academicYear: true,
        classTeacher: {
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
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id] - Delete a class
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if class has students
    const classWithStudents = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (classWithStudents && classWithStudents._count.students > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete class with students. Please move or remove students first.',
        },
        { status: 400 }
      );
    }

    await prisma.class.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    );
  }
}
