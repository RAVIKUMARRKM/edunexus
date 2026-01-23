import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/classes/[id]/timetable - Get timetable for a class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json(
        { error: 'sectionId is required' },
        { status: 400 }
      );
    }

    // Verify section belongs to the class
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        classId: params.id,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found or does not belong to this class' },
        { status: 404 }
      );
    }

    const timetableSlots = await prisma.timetableSlot.findMany({
      where: { sectionId },
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
    });

    return NextResponse.json(timetableSlots);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timetable' },
      { status: 500 }
    );
  }
}

// PUT /api/classes/[id]/timetable - Update timetable for a section
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
    const { sectionId, slots } = body;

    if (!sectionId || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: 'sectionId and slots array are required' },
        { status: 400 }
      );
    }

    // Verify section belongs to the class
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        classId: params.id,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found or does not belong to this class' },
        { status: 404 }
      );
    }

    // Delete existing slots for this section
    await prisma.timetableSlot.deleteMany({
      where: { sectionId },
    });

    // Create new slots
    const createdSlots = await Promise.all(
      slots.map((slot: any) =>
        prisma.timetableSlot.create({
          data: {
            sectionId,
            subjectId: slot.subjectId,
            teacherId: slot.teacherId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            roomNo: slot.roomNo || null,
          },
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
        })
      )
    );

    return NextResponse.json(createdSlots);
  } catch (error) {
    console.error('Error updating timetable:', error);
    return NextResponse.json(
      { error: 'Failed to update timetable' },
      { status: 500 }
    );
  }
}
