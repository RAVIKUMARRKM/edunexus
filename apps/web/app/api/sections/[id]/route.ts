import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/sections/[id] - Get a single section
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const section = await prisma.section.findUnique({
      where: { id: params.id },
      include: {
        class: {
          include: {
            academicYear: true,
            subjects: true,
          },
        },
        students: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        timetableSlots: {
          include: {
            subject: true,
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
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

// PUT /api/sections/[id] - Update a section
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
    const { name, roomNo, capacity } = body;

    const updatedSection = await prisma.section.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(roomNo !== undefined && { roomNo }),
        ...(capacity && { capacity: parseInt(capacity) }),
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// DELETE /api/sections/[id] - Delete a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if section has students
    const sectionWithStudents = await prisma.section.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (sectionWithStudents && sectionWithStudents._count.students > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete section with students. Please move or remove students first.',
        },
        { status: 400 }
      );
    }

    await prisma.section.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
