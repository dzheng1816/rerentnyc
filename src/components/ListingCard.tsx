import Link from "next/link";
import BoroughBadge from "./BoroughBadge";
import SourceBadge from "./SourceBadge";
import type { Listing } from "@/lib/types";

function isNew(firstSeen: string): boolean {
  const diff = Date.now() - new Date(firstSeen).getTime();
  return diff < 48 * 60 * 60 * 1000;
}

function formatRent(rent: number | null): string {
  if (rent === null) return "Contact for rent";
  return `$${rent.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo`;
}

function formatIncome(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Contact for details";
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)}`;
  if (max !== null) return `Up to ${fmt(max)}`;
  return `From ${fmt(min!)}`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {listing.title || listing.address || "Re-Rental Listing"}
          </h3>
          {isNew(listing.first_seen) && (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">
              NEW
            </span>
          )}
        </div>

        {listing.address && listing.address !== listing.title && (
          <p className="text-sm text-gray-500 mb-3">{listing.address}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <BoroughBadge borough={listing.borough} />
          <SourceBadge source={listing.source} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Rent</span>
            <p className="font-medium text-gray-900">{formatRent(listing.rent)}</p>
          </div>
          <div>
            <span className="text-gray-500">Bedrooms</span>
            <p className="font-medium text-gray-900">{listing.bedrooms || "N/A"}</p>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <span className="text-gray-500">Income Range</span>
          <p className="font-medium text-gray-900">
            {formatIncome(listing.income_min, listing.income_max)}
          </p>
        </div>

        <div className="mt-3 text-sm font-medium text-blue-600 group-hover:text-blue-700">
          View Listing &rarr;
        </div>
      </div>
    </Link>
  );
}
