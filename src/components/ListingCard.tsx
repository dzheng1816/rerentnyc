import Link from "next/link";
import BoroughBadge from "./BoroughBadge";
import SourceBadge from "./SourceBadge";
import type { Listing } from "@/lib/types";
import { cleanListing, completenessScore } from "@/lib/listing-utils";

function isNew(firstSeen: string): boolean {
  const diff = Date.now() - new Date(firstSeen).getTime();
  return diff < 48 * 60 * 60 * 1000;
}

function formatRent(rent: number | null, extracted: boolean): string {
  if (rent === null) return "See listing for details";
  const formatted = `$${rent.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo`;
  return extracted ? `~${formatted}` : formatted;
}

function formatIncome(min: number | null, max: number | null): string {
  if (min === null && max === null) return "See listing for details";
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)}`;
  if (max !== null) return `Up to ${fmt(max)}`;
  return `From ${fmt(min!)}`;
}

function formatBedrooms(bedrooms: string | null): string {
  if (!bedrooms) return "See listing";
  return bedrooms;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const cleaned = cleanListing(listing);
  const rentWasExtracted = listing.rent === null && cleaned.rent !== null;
  const isIncomplete = completenessScore(cleaned) < 0.6;

  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {cleaned.title || "Re-Rental Listing"}
          </h3>
          {isNew(listing.first_seen) && (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">
              NEW
            </span>
          )}
        </div>

        {cleaned.address && cleaned.address !== cleaned.title && (
          <p className="text-sm text-gray-500 mb-3">{cleaned.address}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {cleaned.borough && <BoroughBadge borough={cleaned.borough} />}
          <SourceBadge source={cleaned.source} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Rent</span>
            <p className={`font-medium ${cleaned.rent !== null ? "text-gray-900" : "text-gray-400 italic"}`}>
              {formatRent(cleaned.rent, rentWasExtracted)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Bedrooms</span>
            <p className={`font-medium ${cleaned.bedrooms ? "text-gray-900" : "text-gray-400 italic"}`}>
              {formatBedrooms(cleaned.bedrooms)}
            </p>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <span className="text-gray-500">Income Range</span>
          <p className={`font-medium ${(cleaned.income_min !== null || cleaned.income_max !== null) ? "text-gray-900" : "text-gray-400 italic"}`}>
            {formatIncome(cleaned.income_min, cleaned.income_max)}
          </p>
        </div>

        {isIncomplete && (
          <p className="mt-2 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
            Some details may not be listed — check the original source for full info.
          </p>
        )}

        <div className="mt-3 text-sm font-medium text-blue-600 group-hover:text-blue-700">
          View Listing &rarr;
        </div>
      </div>
    </Link>
  );
}
