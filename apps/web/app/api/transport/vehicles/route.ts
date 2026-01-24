import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/transport/vehicles - Get all vehicles
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        routes: {
          include: {
            stops: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST /api/transport/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleNo,
      vehicleType,
      capacity,
      driverName,
      driverPhone,
      driverLicense,
      conductorName,
      conductorPhone,
      insuranceExpiry,
      fitnessExpiry,
      gpsEnabled,
      status,
    } = body;

    // Validation
    if (!vehicleNo || !vehicleType || !capacity || !driverName || !driverPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if vehicle number already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { vehicleNo },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle number already exists' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleNo,
        vehicleType,
        capacity: parseInt(capacity),
        driverName,
        driverPhone,
        driverLicense,
        conductorName,
        conductorPhone,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        fitnessExpiry: fitnessExpiry ? new Date(fitnessExpiry) : null,
        gpsEnabled: gpsEnabled === true,
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}
