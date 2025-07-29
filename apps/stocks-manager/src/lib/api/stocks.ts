import { StockDto, StockQuoteDto } from '@stocks-manager/interfaces';

export async function getUserStocks(userId: string): Promise<StockDto[]> {
  const res = await fetch(`/api/stocks?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
}

export const getMostActiveStocks = async (): Promise<StockDto[]> => {
  try {
    const res = await fetch(`/api/stocks/market/actives`);

    if (!res.ok) throw new Error('Failed to fetch most active stocks');

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopGainersStocks = async (): Promise<StockDto[]> => {
  try {
    const res = await fetch(`/api/stocks/market/gainers`);

    if (!res.ok) throw new Error('Failed to fetch top gainers stocks');

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBiggestLosersStocks = async (): Promise<StockDto[]> => {
  try {
    const res = await fetch(`/api/stocks/market/losers`);

    if (!res.ok) throw new Error('Failed to fetch biggest losers stocks');

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchStocks = async (query: string): Promise<StockDto[]> => {
  try {
    const res = await fetch(
      `/api/stocks/search?q=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error('Failed to search stocks');

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStockDetails = async (
  symbol: string
): Promise<StockQuoteDto> => {
  try {
    const res = await fetch(`/api/stocks/details/${symbol}`);

    if (!res.ok) throw new Error('Failed to fetch stock details');

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
