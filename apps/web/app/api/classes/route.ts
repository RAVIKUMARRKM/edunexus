import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/classes - List all classes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const academicYearId = searchParams.get('academicYearId');
    const includeDetails = searchParams.get('includeDetails') === 'true';

    const where = academicYearId ? { academicYearId } : {};

    const classes = await prisma.class.findMany({
      where,
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
        sections: includeDetails,
        subjects: includeDetails,
        _count: {
          select: {
            students: true,
            sections: true,
            subjects: true,
          },
        },
      },
      orderBy: {
        numericValue: 'asc',
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      numericValue,
      academicYearId,
      classTeacherId,
      roomNo,
      capacity,
    } = body;

    // Validate required fields
    if (!name || !numericValue || !academicYearId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if class already exists for this academic year
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        academicYearId,
      },
    });

    if (existingClass) {
      return NextResponse.json(
        { error: 'Class already exists for this academic year' },
        { status: 409 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        numericValue: parseInt(numericValue),
        academicYearId,
        classTeacherId: classTeacherId || null,
        roomNo: roomNo || null,
        capacity: capacity ? parseInt(capacity) : 40,
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

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
