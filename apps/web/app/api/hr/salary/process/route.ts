import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';

// POST /api/hr/salary/process - Process monthly salary for all staff
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { month, paymentMode, transactionId } = body;

    if (!month) {
      return NextResponse.json(
        { error: 'Month is required' },
        { status: 400 }
      );
    }

    const targetMonth = new Date(month);

    // Get all active staff
    const activeStaff = await prisma.staff.findMany({
      where: {
        status: 'ACTIVE',
      },
    });

    if (activeStaff.length === 0) {
      return NextResponse.json(
        { error: 'No active staff found' },
        { status: 400 }
      );
    }

    // Process salaries in transaction
    const results = await prisma.$transaction(
      activeStaff.map((staff) => {
        // Calculate salary components (these can be customized)
        const basicSalary = parseFloat(staff.basicSalary.toString());
        const hra = basicSalary * 0.4; // 40% HRA
        const da = basicSalary * 0.2; // 20% DA
        const ta = basicSalary * 0.1; // 10% TA
        const grossSalary = basicSalary + hra + da + ta;
        const pf = basicSalary * 0.12; // 12% PF
        const tax = grossSalary * 0.1; // 10% tax (simplified)
        const totalDeductions = pf + tax;
        const netSalary = grossSalary - totalDeductions;

        return prisma.salary.upsert({
          where: {
            staffId_month: {
              staffId: staff.id,
              month: targetMonth,
            },
          },
          update: {
            status: 'PROCESSED',
            paidAt: new Date(),
            paymentMode,
            transactionId,
          },
          create: {
            staffId: staff.id,
            month: targetMonth,
            basicSalary,
            hra,
            da,
            ta,
            otherAllowances: 0,
            grossSalary,
            pf,
            tax,
            otherDeductions: 0,
            totalDeductions,
            netSalary,
            status: 'PROCESSED',
            paidAt: new Date(),
            paymentMode,
            transactionId,
          },
        });
      })
    );

    return NextResponse.json({
      message: `Processed salaries for ${results.length} staff members`,
      count: results.length,
      month: targetMonth,
    });
  } catch (error) {
    console.error('Error processing salaries:', error);
    return NextResponse.json(
      { error: 'Failed to process salaries' },
      { status: 500 }
    );
  }
}
