import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/transport/routes - Get all routes
export async function GET(request: NextRequest) {
  try {
    const routes = await prisma.route.findMany({
      include: {
        vehicle: true,
        stops: {
          orderBy: {
            sequence: 'asc',
          },
        },
        allocations: {
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
      orderBy: {
        routeNo: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

// POST /api/transport/routes - Create a new route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, routeNo, vehicleId, startPoint, endPoint, distance } = body;

    // Validation
    if (!name || !routeNo || !vehicleId || !startPoint || !endPoint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if route number already exists
    const existingRoute = await prisma.route.findUnique({
      where: { routeNo },
    });

    if (existingRoute) {
      return NextResponse.json(
        { success: false, error: 'Route number already exists' },
        { status: 400 }
      );
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const route = await prisma.route.create({
      data: {
        name,
        routeNo,
        vehicleId,
        startPoint,
        endPoint,
        distance: distance ? parseFloat(distance) : null,
      },
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json({ success: true, data: route }, { status: 201 });
  } catch (error) {
    console.error('Error creating route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create route' },
      { status: 500 }
    );
  }
}
