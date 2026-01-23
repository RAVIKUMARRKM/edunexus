import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/hostel/allocations - Get all hostel allocations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const buildingId = searchParams.get('buildingId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (roomId) where.roomId = roomId;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (buildingId) {
      where.room = {
        buildingId,
      };
    }

    const allocations = await prisma.hostelAllocation.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            class: true,
            section: true,
          },
        },
        room: {
          include: {
            building: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: allocations });
  } catch (error) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch allocations' },
      { status: 500 }
    );
  }
}

// POST /api/hostel/allocations - Create a new hostel allocation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, roomId, bedNo, joinDate, leaveDate, isActive } = body;

    // Validation
    if (!studentId || !roomId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if student already has an active allocation
    const existingAllocation = await prisma.hostelAllocation.findUnique({
      where: { studentId },
    });

    if (existingAllocation && existingAllocation.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student already has an active hostel allocation',
        },
        { status: 400 }
      );
    }

    // Check if room exists
    const room = await prisma.hostelRoom.findUnique({
      where: { id: roomId },
      include: {
        allocations: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room has capacity
    if (room.occupied >= room.capacity) {
      return NextResponse.json(
        { success: false, error: 'Room is already at full capacity' },
        { status: 400 }
      );
    }

    // If existing allocation exists but is inactive, delete it
    if (existingAllocation) {
      await prisma.hostelAllocation.delete({
        where: { id: existingAllocation.id },
      });
    }

    // Create allocation and update room occupancy in a transaction
    const allocation = await prisma.$transaction(async (tx) => {
      const newAllocation = await tx.hostelAllocation.create({
        data: {
          studentId,
          roomId,
          bedNo,
          joinDate: joinDate ? new Date(joinDate) : new Date(),
          leaveDate: leaveDate ? new Date(leaveDate) : null,
          isActive: isActive !== false,
        },
        include: {
          student: {
            include: {
              user: true,
              class: true,
              section: true,
            },
          },
          room: {
            include: {
              building: true,
            },
          },
        },
      });

      // Update room occupied count
      await tx.hostelRoom.update({
        where: { id: roomId },
        data: {
          occupied: {
            increment: 1,
          },
          status: room.occupied + 1 >= room.capacity ? 'FULL' : 'AVAILABLE',
        },
      });

      return newAllocation;
    });

    return NextResponse.json({ success: true, data: allocation }, { status: 201 });
  } catch (error) {
    console.error('Error creating allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create allocation' },
      { status: 500 }
    );
  }
}
