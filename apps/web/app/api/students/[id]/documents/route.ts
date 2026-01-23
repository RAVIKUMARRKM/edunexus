import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { getServerSession } from 'next-auth';

// GET /api/students/[id]/documents - Get all documents for a student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const documents = await prisma.studentDocument.findMany({
      where: {
        studentId: params.id,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/students/[id]/documents - Upload a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { name, type, fileUrl } = body;

    if (!name || !type || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const document = await prisma.studentDocument.create({
      data: {
        studentId: params.id,
        name,
        type,
        fileUrl,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}
