import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const where = {
      role: 'PARENT',
    };

    const [parents, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
          parent: {
            select: {
              id: true,
              _count: {
                select: {
                  students: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Transform the data to include children count in the expected format
    const transformedParents = parents.map((parent) => ({
      id: parent.id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      avatar: parent.avatar,
      role: parent.role,
      createdAt: parent.createdAt,
      _count: {
        children: parent.parent?._count?.students || 0,
      },
    }));

    return NextResponse.json({
      parents: transformedParents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get parents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parents' },
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

    // Check if user has permission to create parents
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, password, childrenIds } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!childrenIds || childrenIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one child must be selected' },
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create parent user account
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'PARENT',
      },
    });

    // Create parent record
    const parentRecord = await prisma.parent.create({
      data: {
        userId: user.id,
        // Basic parent info can be added later through profile update
      },
    });

    // Link children to parent through StudentParent join table
    await Promise.all(
      childrenIds.map((studentId: string) =>
        prisma.studentParent.create({
          data: {
            studentId,
            parentId: parentRecord.id,
            relation: 'parent',
            isPrimary: true,
          },
        })
      )
    );

    // Fetch linked children for response
    const children = await prisma.student.findMany({
      where: {
        id: {
          in: childrenIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNo: true,
      },
    });

    // Create notification for parent
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to EduNexus',
        message: `Your parent account has been created. You can now login with your email: ${email}`,
        type: 'general',
      },
    });

    return NextResponse.json(
      {
        message: 'Parent account created successfully',
        parent: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          children,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create parent error:', error);
    return NextResponse.json(
      { error: 'Failed to create parent account' },
      { status: 500 }
    );
  }
}
