import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/departments - List all departments
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
