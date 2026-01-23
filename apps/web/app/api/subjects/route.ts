import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/subjects - List all subjects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');

    const where: any = {};
    if (classId) {
      where.classId = classId;
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            numericValue: true,
          },
        },
      },
      orderBy: [
        {
          class: {
            numericValue: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}
