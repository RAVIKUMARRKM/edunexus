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
          _count: {
            select: {
              children: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      parents,
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
    const parent = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'PARENT',
        children: {
          connect: childrenIds.map((id: string) => ({ id })),
        },
      },
      include: {
        children: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
          },
        },
      },
    });

    // Create notification for parent
    await prisma.notification.create({
      data: {
        userId: parent.id,
        title: 'Welcome to EduNexus',
        message: `Your parent account has been created. You can now login with your email: ${email}`,
        type: 'general',
      },
    });

    return NextResponse.json(
      {
        message: 'Parent account created successfully',
        parent: {
          id: parent.id,
          name: parent.name,
          email: parent.email,
          phone: parent.phone,
          children: parent.children,
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
