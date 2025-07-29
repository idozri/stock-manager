import { NextResponse } from 'next/server';
import { StockDto } from '@stocks-manager/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(): Promise<
  NextResponse<StockDto[] | { error: string }>
> {
  try {
    const response = await fetch(`${API_URL}/stocks/market/losers`);

    if (!response.ok) {
      throw new Error('Failed to fetch biggest losers stocks');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching biggest losers stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch biggest losers stocks' },
      { status: 500 }
    );
  }
}
