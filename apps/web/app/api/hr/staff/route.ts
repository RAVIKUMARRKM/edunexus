import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcryptjs';

// GET /api/hr/staff - Get all staff
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;

    const staff = await prisma.staff.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            isActive: true,
          },
        },
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST /api/hr/staff - Create new staff
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      password,
      employeeId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      address,
      city,
      state,
      pincode,
      designation,
      departmentId,
      joiningDate,
      basicSalary,
      photo,
    } = body;

    // Validate required fields
    if (!email || !password || !employeeId || !firstName || !lastName || !designation || !basicSalary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { employeeId },
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user and staff in a transaction
    const staff = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          phone,
          role: 'STAFF',
          avatar: photo,
        },
      });

      return await tx.staff.create({
        data: {
          employeeId,
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address,
          city,
          state,
          pincode,
          designation,
          departmentId,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
          basicSalary,
          photo,
        },
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              isActive: true,
            },
          },
          department: true,
        },
      });
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}
