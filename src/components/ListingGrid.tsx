import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/types";

export default function ListingGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500">No listings match your filters.</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
