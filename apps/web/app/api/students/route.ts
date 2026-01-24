import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { studentSchema } from '@edunexus/shared';
import { getServerSession } from 'next-auth';

// GET /api/students - List all students with filters
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNo: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              avatar: true,
              isActive: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              numericValue: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
            },
          },
          parents: {
            include: {
              parent: {
                select: {
                  fatherName: true,
                  fatherPhone: true,
                  motherName: true,
                  motherPhone: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validatedData = studentSchema.parse(body);

    // Check if admission number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { admissionNo: validatedData.admissionNo },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Admission number already exists' },
        { status: 400 }
      );
    }

    // Create user account for student
    const user = await prisma.user.create({
      data: {
        email: validatedData.email || `${validatedData.admissionNo}@student.edunexus.com`,
        password: '$2a$10$default.password.hash', // Should be hashed
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        phone: validatedData.phone,
        role: 'STUDENT',
        isActive: true,
      },
    });

    // Create student record
    const student = await prisma.student.create({
      data: {
        admissionNo: validatedData.admissionNo,
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
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
        status: 'ACTIVE',
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

    // Create parent if parent information is provided
    if (validatedData.fatherName || validatedData.motherName) {
      const parentUser = await prisma.user.create({
        data: {
          email: validatedData.fatherEmail || validatedData.motherEmail || `parent.${validatedData.admissionNo}@edunexus.com`,
          password: '$2a$10$default.password.hash',
          name: validatedData.fatherName || validatedData.motherName || 'Parent',
          phone: validatedData.fatherPhone || validatedData.motherPhone,
          role: 'PARENT',
          isActive: true,
        },
      });

      const parent = await prisma.parent.create({
        data: {
          userId: parentUser.id,
          fatherName: validatedData.fatherName,
          fatherPhone: validatedData.fatherPhone,
          fatherEmail: validatedData.fatherEmail,
          fatherOccupation: validatedData.fatherOccupation,
          motherName: validatedData.motherName,
          motherPhone: validatedData.motherPhone,
          motherEmail: validatedData.motherEmail,
          motherOccupation: validatedData.motherOccupation,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
        },
      });

      await prisma.studentParent.create({
        data: {
          studentId: student.id,
          parentId: parent.id,
          relation: 'father',
          isPrimary: true,
        },
      });
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}
