import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/classes/[id]/sections - Get all sections for a class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sections = await prisma.section.findMany({
      where: { classId: params.id },
      include: {
        _count: {
          select: {
            students: true,
            timetableSlots: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// POST /api/classes/[id]/sections - Create a new section for a class
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
    const { name, roomNo, capacity } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      );
    }

    // Check if section already exists for this class
    const existingSection = await prisma.section.findFirst({
      where: {
        name,
        classId: params.id,
      },
    });

    if (existingSection) {
      return NextResponse.json(
        { error: 'Section already exists for this class' },
        { status: 409 }
      );
    }

    const newSection = await prisma.section.create({
      data: {
        name,
        classId: params.id,
        roomNo: roomNo || null,
        capacity: capacity ? parseInt(capacity) : 40,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
