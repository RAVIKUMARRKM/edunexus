import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/hostel/rooms - Get all hostel rooms
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const buildingId = searchParams.get('buildingId');
    const status = searchParams.get('status');
    const roomType = searchParams.get('roomType');

    const where: any = {};
    if (buildingId) where.buildingId = buildingId;
    if (status) where.status = status as any;
    if (roomType) where.roomType = roomType as any;

    const rooms = await prisma.hostelRoom.findMany({
      where,
      include: {
        building: true,
        allocations: {
          where: {
            isActive: true,
          },
          include: {
            student: {
              include: {
                user: true,
                class: true,
                section: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          building: {
            name: 'asc',
          },
        },
        {
          roomNo: 'asc',
        },
      ],
    });

    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// POST /api/hostel/rooms - Create a new hostel room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      roomNo,
      buildingId,
      floor,
      roomType,
      capacity,
      rentPerMonth,
      facilities,
      status,
    } = body;

    // Validation
    if (!roomNo || !buildingId || floor === undefined || !roomType || !capacity || !rentPerMonth) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if building exists
    const building = await prisma.hostelBuilding.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return NextResponse.json(
        { success: false, error: 'Building not found' },
        { status: 404 }
      );
    }

    // Check if room number already exists in this building
    const existingRoom = await prisma.hostelRoom.findUnique({
      where: {
        roomNo_buildingId: {
          roomNo,
          buildingId,
        },
      },
    });

    if (existingRoom) {
      return NextResponse.json(
        { success: false, error: 'Room number already exists in this building' },
        { status: 400 }
      );
    }

    const room = await prisma.hostelRoom.create({
      data: {
        roomNo,
        buildingId,
        floor: parseInt(floor),
        roomType,
        capacity: parseInt(capacity),
        occupied: 0,
        rentPerMonth: parseFloat(rentPerMonth),
        facilities,
        status: status || 'AVAILABLE',
      },
      include: {
        building: true,
      },
    });

    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
