import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/transport/routes/[id]/stops - Get stops for a route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routeId = params.id;

    const stops = await prisma.routeStop.findMany({
      where: {
        routeId,
      },
      orderBy: {
        sequence: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: stops });
  } catch (error) {
    console.error('Error fetching route stops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch route stops' },
      { status: 500 }
    );
  }
}

// POST /api/transport/routes/[id]/stops - Add a stop to a route
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routeId = params.id;
    const body = await request.json();
    const {
      name,
      pickupTime,
      dropTime,
      fare,
      sequence,
      latitude,
      longitude,
    } = body;

    // Validation
    if (!name || !pickupTime || !dropTime || !fare || sequence === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if route exists
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return NextResponse.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
    }

    // Check if sequence already exists for this route
    const existingStop = await prisma.routeStop.findUnique({
      where: {
        routeId_sequence: {
          routeId,
          sequence: parseInt(sequence),
        },
      },
    });

    if (existingStop) {
      return NextResponse.json(
        { success: false, error: 'Stop with this sequence already exists' },
        { status: 400 }
      );
    }

    const stop = await prisma.routeStop.create({
      data: {
        routeId,
        name,
        pickupTime,
        dropTime,
        fare: parseFloat(fare),
        sequence: parseInt(sequence),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    return NextResponse.json({ success: true, data: stop }, { status: 201 });
  } catch (error) {
    console.error('Error creating route stop:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create route stop' },
      { status: 500 }
    );
  }
}
