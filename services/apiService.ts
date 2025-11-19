
import { SearchResult } from '../types';

const API_HOST = 'maps-data.p.rapidapi.com';
const API_URL = `https://${API_HOST}/search`;

export const searchBusinesses = async (
  apiKey: string,
  query: string,
  limit: number,
  country: string
): Promise<SearchResult[]> => {
  const params = new URLSearchParams({
    query,
    limit: limit.toString(),
    country: country,
    lang: 'en',
  });

  const url = `${API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.status === 'ok' && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('API returned ok status but data is not an array:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch from Maps Data API:', error);
    throw error;
  }
};
