import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/sections - List all sections
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');

    const where = classId ? { classId } : {};

    const sections = await prisma.section.findMany({
      where,
      include: {
        class: {
          include: {
            academicYear: true,
          },
        },
        _count: {
          select: {
            students: true,
            timetableSlots: true,
          },
        },
      },
      orderBy: [{ class: { numericValue: 'asc' } }, { name: 'asc' }],
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
