import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@edunexus/database';
import { authOptions } from '@/lib/auth';

// GET /api/inventory/items - Get all inventory items
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const lowStock = searchParams.get('lowStock');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (lowStock === 'true') {
      where.quantity = {
        lte: prisma.inventoryItem.fields.minQuantity,
      };
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/items - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      code,
      categoryId,
      description,
      unit,
      quantity = 0,
      minQuantity = 10,
      price,
      location,
    } = body;

    // Validate required fields
    if (!name || !code || !categoryId || !unit || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item code already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { code },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item code already exists' },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        code,
        categoryId,
        description,
        unit,
        quantity: parseInt(quantity),
        minQuantity: parseInt(minQuantity),
        price: parseFloat(price),
        location,
      },
      include: {
        category: true,
      },
    });

    // Create initial transaction record
    if (quantity > 0) {
      await prisma.inventoryTransaction.create({
        data: {
          itemId: item.id,
          type: 'PURCHASE',
          quantity: parseInt(quantity),
          previousQty: 0,
          newQty: parseInt(quantity),
          reference: 'Initial Stock',
          createdBy: session.user.id,
        },
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
