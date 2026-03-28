import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BoroughBadge from "@/components/BoroughBadge";
import SourceBadge from "@/components/SourceBadge";
import { getListingById } from "@/lib/queries";
import { cleanListing, completenessScore } from "@/lib/listing-utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const raw = await getListingById(id);
  if (!raw) return { title: "Listing Not Found — ReRentNYC" };

  const listing = cleanListing(raw);
  const title = listing.title || listing.address || "Re-Rental Listing";
  return {
    title: `${title} — ReRentNYC`,
    description: `Affordable re-rental: ${title}. ${listing.bedrooms || ""} ${listing.rent ? `$${listing.rent}/mo` : ""} in ${listing.borough || "NYC"}.`,
  };
}

const SOURCE_NAMES: Record<string, string> = {
  hdc: "NYC HDC (Housing Development Corporation)",
  resideny: "Reside New York",
  taxace: "Taxace NY",
  tfc: "TF Cornerstone",
  sjp: "SJP Residential",
  stnicksalliance: "St. Nicks Alliance",
  ibis: "Ibis Management",
  city5: "City5",
  taxsolute: "Tax Solute Consulting",
  mgny: "MGNY Consulting",
  fifthave: "Fifth Avenue Committee",
  langsam: "Langsam Property Services",
  springleasing: "Spring Leasing & Management",
  cgmr: "CGMR Compliance",
  reclaimhdfc: "Reclaim HDFC",
  afny: "Affordable for New York",
  iafford: "iAfford NY",
  ahgleasing: "Affordable Housing Group (Related)",
  clintonmgmt: "Clinton Management",
  housingpartnership: "Housing Partnership",
  sois: "SOIS Real Estate Consulting",
  wavecrest: "Wavecrest Rentals",
  mickigarcia: "Micki Garcia Realty",
  thebridge: "The Bridge NY",
  infinitehorizons: "Infinite Horizons",
  kgupright: "K&G Upright Consulting",
  yourneighborhood: "Your Neighborhood Housing",
};

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await getListingById(id);

  if (!raw) notFound();

  const listing = cleanListing(raw);
  const rentWasExtracted = raw.rent === null && listing.rent !== null;
  const isIncomplete = completenessScore(listing) < 0.6;

  const fmt = (n: number | null) =>
    n !== null ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : null;

  const sourceName = SOURCE_NAMES[listing.source] || listing.source;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-block">
        &larr; Back to listings
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.borough && <BoroughBadge borough={listing.borough} />}
          <SourceBadge source={listing.source} />
          {(() => {
            const diff = Date.now() - new Date(listing.first_seen).getTime();
            if (diff < 48 * 60 * 60 * 1000) {
              return (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">
                  NEW
                </span>
              );
            }
            return null;
          })()}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {listing.title || "Re-Rental Listing"}
        </h1>

        {listing.address && listing.address !== listing.title && (
          <p className="text-gray-600 mb-6">{listing.address}</p>
        )}

        {isIncomplete && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Limited details available.</span>{" "}
              Some information for this listing isn&apos;t displayed here. Click
              &quot;Apply / View Original&quot; below to see the full listing from{" "}
              <span className="font-medium">{sourceName}</span>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Monthly Rent</p>
            {listing.rent !== null ? (
              <div>
                <p className="text-lg font-semibold">
                  {rentWasExtracted ? "~" : ""}${listing.rent.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo
                </p>
                {rentWasExtracted && (
                  <p className="text-xs text-gray-400 italic">Estimated from listing</p>
                )}
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-400 italic">See original listing</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p className={`text-lg font-semibold ${listing.bedrooms ? "" : "text-gray-400 italic"}`}>
              {listing.bedrooms || "See original listing"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Income Range</p>
            {listing.income_min !== null || listing.income_max !== null ? (
              <p className="text-lg font-semibold">
                {fmt(listing.income_min) || "?"} – {fmt(listing.income_max) || "?"}
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-400 italic">See original listing</p>
            )}
          </div>
          {listing.ami_pct && (
            <div>
              <p className="text-sm text-gray-500">AMI</p>
              <p className="text-lg font-semibold">{listing.ami_pct}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Source</p>
          <p className="text-sm font-medium text-gray-700">{sourceName}</p>
        </div>

        <div className="text-xs text-gray-400 mb-6">
          First listed: {new Date(listing.first_seen).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </div>

        {listing.url && (
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Apply / View Original &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
