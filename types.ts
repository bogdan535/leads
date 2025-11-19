
export interface SearchResult {
  business_id: string;
  phone_number: string | null;
  name: string;
  full_address: string;
  latitude: number;
  longitude: number;
  review_count: number;
  rating: number;
  website: string | null;
  place_id: string;
  place_link: string;
  types: string[];
  price_level: string | null;
  city: string;
  state: string | null;
  description: (string | null)[];
}

export interface CsvData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface SearchProgress {
  current: number;
  total: number;
  status: string;
}
