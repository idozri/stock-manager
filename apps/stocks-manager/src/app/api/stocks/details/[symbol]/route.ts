import { NextRequest, NextResponse } from 'next/server';
import { StockQuoteDto } from '@stocks-manager/interfaces';

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
): Promise<NextResponse<StockQuoteDto | { error: string }>> {
  try {
    const { symbol } = params;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Get API URL from environment variable, fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/stocks/details/${symbol}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stock details: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
