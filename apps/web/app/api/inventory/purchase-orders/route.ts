import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';

// GET /api/inventory/purchase-orders - Get all purchase orders
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');

    const where: any = {};
    if (status) where.status = status;
    if (vendorId) where.vendorId = vendorId;

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        vendor: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return NextResponse.json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/purchase-orders - Create new purchase order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, expectedDate, items, remarks } = body;

    // Validate required fields
    if (!vendorId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Vendor and items are required' },
        { status: 400 }
      );
    }

    // Generate PO number
    const lastPO = await prisma.purchaseOrder.findFirst({
      orderBy: { poNumber: 'desc' },
    });

    const poNumber = lastPO
      ? `PO${(parseInt(lastPO.poNumber.slice(2)) + 1).toString().padStart(6, '0')}`
      : 'PO000001';

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + parseFloat(item.unitPrice) * parseInt(item.quantity),
      0
    );

    // Create purchase order with items in transaction
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          poNumber,
          vendorId,
          orderDate: new Date(),
          expectedDate: expectedDate ? new Date(expectedDate) : null,
          totalAmount,
          status: 'DRAFT',
          remarks,
        },
      });

      // Create purchase order items
      await Promise.all(
        items.map((item: any) =>
          tx.purchaseOrderItem.create({
            data: {
              purchaseOrderId: po.id,
              itemId: item.itemId,
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              totalPrice: parseFloat(item.unitPrice) * parseInt(item.quantity),
            },
          })
        )
      );

      return tx.purchaseOrder.findUnique({
        where: { id: po.id },
        include: {
          vendor: true,
          items: {
            include: {
              item: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  }
}
