import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../../packages/database/src';

// GET /api/transport/allocations - Get all transport allocations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const routeId = searchParams.get('routeId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (routeId) where.routeId = routeId;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const allocations = await prisma.transportAllocation.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            class: true,
            section: true,
          },
        },
        route: {
          include: {
            vehicle: true,
          },
        },
        stop: true,
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

// POST /api/transport/allocations - Create a new transport allocation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      routeId,
      stopId,
      pickupType,
      validFrom,
      validTo,
      isActive,
    } = body;

    // Validation
    if (!studentId || !routeId || !stopId || !validFrom) {
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
    const existingAllocation = await prisma.transportAllocation.findUnique({
      where: { studentId },
    });

    if (existingAllocation && existingAllocation.isActive) {
      return NextResponse.json(
        { success: false, error: 'Student already has an active transport allocation' },
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

    // Check if stop exists
    const stop = await prisma.routeStop.findUnique({
      where: { id: stopId },
    });

    if (!stop) {
      return NextResponse.json(
        { success: false, error: 'Stop not found' },
        { status: 404 }
      );
    }

    // If existing allocation exists but is inactive, delete it
    if (existingAllocation) {
      await prisma.transportAllocation.delete({
        where: { id: existingAllocation.id },
      });
    }

    const allocation = await prisma.transportAllocation.create({
      data: {
        studentId,
        routeId,
        stopId,
        pickupType: pickupType || 'BOTH',
        validFrom: new Date(validFrom),
        validTo: validTo ? new Date(validTo) : null,
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
        route: {
          include: {
            vehicle: true,
          },
        },
        stop: true,
      },
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
