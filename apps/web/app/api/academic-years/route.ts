import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/academic-years - List all academic years
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(academicYears);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academic years' },
      { status: 500 }
    );
  }
}
