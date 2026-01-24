import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/hostel/buildings - Get all hostel buildings
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    const where = type ? { type: type as any } : {};

    const buildings = await prisma.hostelBuilding.findMany({
      where,
      include: {
        rooms: {
          include: {
            allocations: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate occupancy statistics
    const buildingsWithStats = buildings.map((building) => {
      const totalRooms = building.rooms.length;
      const totalCapacity = building.rooms.reduce((sum, room) => sum + room.capacity, 0);
      const totalOccupied = building.rooms.reduce((sum, room) => sum + room.occupied, 0);
      const availableRooms = building.rooms.filter((r) => r.status === 'AVAILABLE').length;

      return {
        ...building,
        stats: {
          totalRooms,
          totalCapacity,
          totalOccupied,
          availableRooms,
          occupancyRate: totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : '0',
        },
      };
    });

    return NextResponse.json({ success: true, data: buildingsWithStats });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch buildings' },
      { status: 500 }
    );
  }
}

// POST /api/hostel/buildings - Create a new hostel building
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, type, wardenName, wardenPhone, capacity, address } = body;

    // Validation
    if (!name || !code || !type || !capacity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if building code already exists
    const existingBuilding = await prisma.hostelBuilding.findUnique({
      where: { code },
    });

    if (existingBuilding) {
      return NextResponse.json(
        { success: false, error: 'Building code already exists' },
        { status: 400 }
      );
    }

    const building = await prisma.hostelBuilding.create({
      data: {
        name,
        code,
        type,
        wardenName,
        wardenPhone,
        capacity: parseInt(capacity),
        address,
      },
    });

    return NextResponse.json({ success: true, data: building }, { status: 201 });
  } catch (error) {
    console.error('Error creating building:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create building' },
      { status: 500 }
    );
  }
}
