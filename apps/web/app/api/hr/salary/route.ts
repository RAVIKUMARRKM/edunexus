import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';

// GET /api/hr/salary - Get all salaries
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const month = searchParams.get('month');
    const status = searchParams.get('status');

    const where: any = {};
    if (staffId) where.staffId = staffId;
    if (month) where.month = new Date(month);
    if (status) where.status = status;

    const salaries = await prisma.salary.findMany({
      where,
      include: {
        staff: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            department: true,
          },
        },
      },
      orderBy: {
        month: 'desc',
      },
    });

    return NextResponse.json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    );
  }
}

// POST /api/hr/salary - Create salary entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      staffId,
      month,
      basicSalary,
      hra = 0,
      da = 0,
      ta = 0,
      otherAllowances = 0,
      pf = 0,
      tax = 0,
      otherDeductions = 0,
    } = body;

    // Validate required fields
    if (!staffId || !month || !basicSalary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if salary already exists for this month
    const existingSalary = await prisma.salary.findUnique({
      where: {
        staffId_month: {
          staffId,
          month: new Date(month),
        },
      },
    });

    if (existingSalary) {
      return NextResponse.json(
        { error: 'Salary for this month already exists' },
        { status: 400 }
      );
    }

    // Calculate gross and net salary
    const grossSalary = parseFloat(basicSalary) + parseFloat(hra) + parseFloat(da) + parseFloat(ta) + parseFloat(otherAllowances);
    const totalDeductions = parseFloat(pf) + parseFloat(tax) + parseFloat(otherDeductions);
    const netSalary = grossSalary - totalDeductions;

    const salary = await prisma.salary.create({
      data: {
        staffId,
        month: new Date(month),
        basicSalary: parseFloat(basicSalary),
        hra: parseFloat(hra),
        da: parseFloat(da),
        ta: parseFloat(ta),
        otherAllowances: parseFloat(otherAllowances),
        grossSalary,
        pf: parseFloat(pf),
        tax: parseFloat(tax),
        otherDeductions: parseFloat(otherDeductions),
        totalDeductions,
        netSalary,
        status: 'PENDING',
      },
      include: {
        staff: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            department: true,
          },
        },
      },
    });

    return NextResponse.json(salary, { status: 201 });
  } catch (error) {
    console.error('Error creating salary:', error);
    return NextResponse.json(
      { error: 'Failed to create salary' },
      { status: 500 }
    );
  }
}
