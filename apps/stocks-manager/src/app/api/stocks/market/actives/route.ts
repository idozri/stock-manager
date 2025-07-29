import { NextResponse } from 'next/server';
import { StockDto } from '@stocks-manager/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(): Promise<
  NextResponse<StockDto[] | { error: string }>
> {
  try {
    const response = await fetch(`${API_URL}/stocks/market/actives`);

    if (!response.ok) {
      throw new Error('Failed to fetch most active stocks');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching most active stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch most active stocks' },
      { status: 500 }
    );
  }
}
