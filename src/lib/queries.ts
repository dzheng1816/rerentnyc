import { supabase } from "./supabase";
import type { Listing, FilterParams } from "./types";

export async function getListings(filters: FilterParams): Promise<Listing[]> {
  let query = supabase
    .from("listings")
    .select("*")
    .eq("active", true);

  if (filters.borough) {
    query = query.eq("borough", filters.borough);
  }

  if (filters.neighborhood) {
    query = query.eq("neighborhood", filters.neighborhood);
  }

  if (filters.bedrooms) {
    query = query.or(`bedrooms.eq.${filters.bedrooms},bedrooms.is.null`);
  }

  if (filters.rentMin) {
    query = query.or(`rent.gte.${filters.rentMin},rent.is.null`);
  }
  if (filters.rentMax) {
    query = query.or(`rent.lte.${filters.rentMax},rent.is.null`);
  }

  if (filters.income) {
    query = query.or(`income_min.lte.${filters.income},income_min.is.null`);
    query = query.or(`income_max.gte.${filters.income},income_max.is.null`);
  }

  if (filters.source) {
    query = query.eq("source", filters.source);
  }

  switch (filters.sort) {
    case "rent_asc":
      query = query.order("rent", { ascending: true, nullsFirst: false });
      break;
    case "rent_desc":
      query = query.order("rent", { ascending: false, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("first_seen", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase query error:", error);
    return [];
  }

  return data as Listing[];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase query error:", error);
    return null;
  }

  return data as Listing;
}
