import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/teachers - List all teachers with filters
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const departmentId = searchParams.get('departmentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Department filter
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              avatar: true,
              isActive: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          subjectAssignments: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
          classTeacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.teacher.count({ where }),
    ]);

    return NextResponse.json({
      teachers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Create new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      city,
      state,
      pincode,
      emergencyContact,
      qualification,
      specialization,
      experience,
      joiningDate,
      departmentId,
      designation,
      basicSalary,
      photo,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !dateOfBirth || !gender || !qualification || !basicSalary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate unique employee ID
    const lastTeacher = await prisma.teacher.findFirst({
      orderBy: { employeeId: 'desc' },
    });
    const lastId = lastTeacher ? parseInt(lastTeacher.employeeId.substring(3)) : 0;
    const employeeId = `TCH${String(lastId + 1).padStart(5, '0')}`;

    // Hash password (in production, use bcrypt)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and teacher in transaction
    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          phone,
          avatar: photo,
          role: 'TEACHER',
          isActive: true,
        },
      });

      const newTeacher = await tx.teacher.create({
        data: {
          employeeId,
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          bloodGroup,
          address,
          city,
          state,
          pincode,
          emergencyContact,
          qualification,
          specialization,
          experience: experience || 0,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
          departmentId,
          designation,
          basicSalary,
          photo,
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              avatar: true,
              isActive: true,
            },
          },
          department: true,
        },
      });

      return newTeacher;
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
