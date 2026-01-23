import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const academicYears = await prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: {
            classes: true,
            exams: true,
          },
        },
      },
    });

    return NextResponse.json({ academicYears });
  } catch (error) {
    console.error('Get academic years error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academic years' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, startDate, endDate, isCurrent } = body;

    // Validation
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, start date, and end date are required' },
        { status: 400 }
      );
    }

    // If setting as current, unset other current years
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: isCurrent || false,
      },
    });

    return NextResponse.json(
      { message: 'Academic year created successfully', academicYear },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create academic year error:', error);
    return NextResponse.json(
      { error: 'Failed to create academic year' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, isCurrent } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Academic year ID is required' },
        { status: 400 }
      );
    }

    // If setting as current, unset other current years
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const academicYear = await prisma.academicYear.update({
      where: { id },
      data: { isCurrent },
    });

    return NextResponse.json({
      message: 'Academic year updated successfully',
      academicYear,
    });
  } catch (error) {
    console.error('Update academic year error:', error);
    return NextResponse.json(
      { error: 'Failed to update academic year' },
      { status: 500 }
    );
  }
}
