import { NextRequest, NextResponse } from 'next/server';
import { StockDto } from '@stocks-manager/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest
): Promise<NextResponse<StockDto[] | { error: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter q is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/stocks/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to search stocks');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
