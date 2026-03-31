import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

interface OrderPayload {
  items: Array<{
    productId: string;
    storeId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  paymentMethod: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const payload: OrderPayload = await req.json();

    // Validate payload
    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    if (!payload.deliveryAddress || payload.deliveryLat === undefined || payload.deliveryLng === undefined) {
      return NextResponse.json(
        { error: 'Delivery address and coordinates are required' },
        { status: 400 }
      );
    }

    // Fetch products to calculate totals
    const productIds = payload.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    let deliveryFee = 0;

    const orderItems = [];

    for (const item of payload.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      const itemTotal = product.basePrice * item.quantity;
      subtotal += itemTotal;
      deliveryFee += product.deliveryFee;

      orderItems.push({
        productId: item.productId,
        storeId: item.storeId,
        quantity: item.quantity,
        pricePerUnit: product.basePrice,
        total: itemTotal,
      });
    }

    const total = subtotal + deliveryFee;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: user.userId,
        deliveryAddress: payload.deliveryAddress,
        deliveryLat: payload.deliveryLat,
        deliveryLng: payload.deliveryLng,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING',
        paymentMethod: (payload.paymentMethod || 'FLUTTERWAVE').toUpperCase() as any,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            store: true,
          },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        orderId: order.id,
        title: 'Order Created',
        message: `Your order #${order.id.slice(0, 8)} has been created`,
        type: 'ORDER_CREATED',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: user.userId },
      include: {
        items: {
          include: {
            product: true,
            store: true,
          },
        },
        rider: true,
        trackingUpdates: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
