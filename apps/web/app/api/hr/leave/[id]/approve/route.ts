import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';

// PUT /api/hr/leave/[id]/approve - Approve or reject leave request
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, remarks } = body;

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    // Check if leave request exists
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    if (leaveRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Leave request has already been processed' },
        { status: 400 }
      );
    }

    // Update leave request
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        status,
        approvedBy: session.user.id,
        approvedAt: new Date(),
        remarks,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        staff: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave request:', error);
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    );
  }
}
