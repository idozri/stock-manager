import { NextRequest, NextResponse } from 'next/server';
import { StockDto } from '@stocks-manager/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  req: NextRequest
): Promise<NextResponse<StockDto[] | { error: string }>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/stocks?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<StockDto | { error: string }>> {
  try {
    const body = await req.json();
    const { userId, symbol, name } = body;

    if (!userId || !symbol) {
      return NextResponse.json(
        { error: 'userId and symbol are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, symbol, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to add stock' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding stock:', error);
    return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<StockDto | { error: string }>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const symbol = searchParams.get('symbol');

    if (!userId || !symbol) {
      return NextResponse.json(
        { error: 'userId and symbol parameters are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/stocks?userId=${userId}&symbol=${symbol}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to remove stock' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing stock:', error);
    return NextResponse.json(
      { error: 'Failed to remove stock' },
      { status: 500 }
    );
  }
}
