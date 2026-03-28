export interface Listing {
  id: string;
  content_hash: string;
  source: string;
  title: string | null;
  address: string | null;
  borough: string | null;
  neighborhood: string | null;
  bedrooms: string | null;
  rent: number | null;
  income_min: number | null;
  income_max: number | null;
  ami_pct: string | null;
  url: string | null;
  raw_text: string | null;
  first_seen: string;
  last_seen: string;
  active: boolean;
}

export type Borough = "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";

export type SortOption = "newest" | "rent_asc" | "rent_desc";

export interface FilterParams {
  borough?: string;
  neighborhood?: string;
  bedrooms?: string;
  rentMin?: number;
  rentMax?: number;
  income?: number;
  source?: string;
  sort?: SortOption;
}
