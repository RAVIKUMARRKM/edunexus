import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { studentSchema } from '@edunexus/shared';
import { getServerSession } from 'next-auth';

// GET /api/students/[id] - Get single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
            createdAt: true,
          },
        },
        class: {
          include: {
            academicYear: true,
          },
        },
        section: true,
        parents: {
          include: {
            parent: {
              include: {
                user: {
                  select: {
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        attendances: {
          take: 30,
          orderBy: {
            date: 'desc',
          },
        },
        examResults: {
          include: {
            exam: true,
            subject: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        feePayments: {
          include: {
            feeStructure: true,
          },
          orderBy: {
            paymentDate: 'desc',
          },
          take: 10,
        },
        documents: {
          orderBy: {
            uploadedAt: 'desc',
          },
        },
        transportAllocation: {
          include: {
            route: true,
            stop: true,
          },
        },
        hostelAllocation: {
          include: {
            room: {
              include: {
                building: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validatedData = studentSchema.partial().parse(body);

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Update user information
    if (validatedData.email || validatedData.phone) {
      await prisma.user.update({
        where: { id: existingStudent.userId },
        data: {
          email: validatedData.email,
          phone: validatedData.phone,
          name: validatedData.firstName && validatedData.lastName
            ? `${validatedData.firstName} ${validatedData.lastName}`
            : undefined,
        },
      });
    }

    // Update student information
    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
        gender: validatedData.gender,
        bloodGroup: validatedData.bloodGroup,
        religion: validatedData.religion,
        caste: validatedData.caste,
        nationality: validatedData.nationality,
        motherTongue: validatedData.motherTongue,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        classId: validatedData.classId,
        sectionId: validatedData.sectionId,
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        class: true,
        section: true,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete student (cascade will delete related records)
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Student deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete student' },
      { status: 500 }
    );
  }
}
