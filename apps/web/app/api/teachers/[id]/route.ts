import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/teachers/[id] - Get single teacher
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
            role: true,
          },
        },
        department: true,
        subjectAssignments: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
        classTeacher: {
          include: {
            academicYear: true,
          },
        },
        attendances: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
        leaveRequests: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher' },
      { status: 500 }
    );
  }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
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
      departmentId,
      designation,
      basicSalary,
      photo,
      status,
      email,
    } = body;

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Update teacher and user in transaction
    const teacher = await prisma.$transaction(async (tx) => {
      // Update user if email or phone changed
      if (email || phone || photo) {
        await tx.user.update({
          where: { id: existingTeacher.userId },
          data: {
            ...(email && { email }),
            ...(phone && { phone }),
            ...(photo && { avatar: photo }),
            name: `${firstName || existingTeacher.firstName} ${lastName || existingTeacher.lastName}`,
          },
        });
      }

      // Update teacher
      const updatedTeacher = await tx.teacher.update({
        where: { id: params.id },
        data: {
          firstName,
          lastName,
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          gender,
          bloodGroup,
          address,
          city,
          state,
          pincode,
          emergencyContact,
          qualification,
          specialization,
          experience,
          departmentId,
          designation,
          ...(basicSalary && { basicSalary }),
          photo,
          status,
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

      return updatedTeacher;
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    );
  }
}

// DELETE /api/teachers/[id] - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        subjectAssignments: true,
        classTeacher: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Check if teacher has assignments
    if (teacher.subjectAssignments.length > 0 || teacher.classTeacher) {
      return NextResponse.json(
        { error: 'Cannot delete teacher with active assignments. Please remove assignments first.' },
        { status: 400 }
      );
    }

    // Delete teacher (will cascade delete user due to onDelete: Cascade)
    await prisma.teacher.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    );
  }
}
