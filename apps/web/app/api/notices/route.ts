import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');

    const where: any = {
      isPublished: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    };

    // Filter by user role (admin roles can see all notices)
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'];
    if (session.user.role && !adminRoles.includes(session.user.role)) {
      where.targetRoles = {
        has: session.user.role,
      };
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          attachmentUrl: true,
          publishedAt: true,
          expiresAt: true,
          createdAt: true,
        },
      }),
      prisma.notice.count({ where }),
    ]);

    return NextResponse.json({
      notices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get notices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notices' },
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

    // Check if user has permission to create notices
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      content,
      type,
      targetRoles,
      targetClasses,
      attachmentUrl,
      expiresAt,
      isPublished,
    } = body;

    // Validation
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Title, content, and type are required' },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        type,
        targetRoles: targetRoles || [],
        targetClasses: targetClasses || [],
        attachmentUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(
      { message: 'Notice created successfully', notice },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create notice error:', error);
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}
