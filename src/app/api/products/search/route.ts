import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get('q') || '';
    const sector = searchParams.get('sector');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const priceMin = searchParams.get('priceMin')
      ? parseFloat(searchParams.get('priceMin') || '0')
      : undefined;
    const priceMax = searchParams.get('priceMax')
      ? parseFloat(searchParams.get('priceMax') || '999999')
      : undefined;

    const where: any = {
      availability: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (sector) {
      where.sector = sector;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.basePrice = {};
      if (priceMin !== undefined) where.basePrice.gte = priceMin;
      if (priceMax !== undefined) where.basePrice.lte = priceMax;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
