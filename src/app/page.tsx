import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import { getListings } from "@/lib/queries";
import type { FilterParams, SortOption } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: FilterParams = {
    borough: params.borough,
    bedrooms: params.bedrooms,
    rentMin: params.rentMin ? Number(params.rentMin) : undefined,
    rentMax: params.rentMax ? Number(params.rentMax) : undefined,
    income: params.income ? Number(params.income) : undefined,
    source: params.source,
    sort: (params.sort as SortOption) || "newest",
  };

  const listings = await getListings(filters);

  return (
    <>
      <section className="bg-gray-900 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Affordable Re-Rental Apartments in NYC
          </h1>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Re-rentals are affordable apartments that become available without a
            lottery. Browse current listings and apply directly.
          </p>
          <Suspense fallback={null}>
            <FilterBar />
          </Suspense>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{listings.length}</span> listing{listings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ListingGrid listings={listings} />
      </section>
    </>
  );
}
