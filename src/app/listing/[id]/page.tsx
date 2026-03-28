import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BoroughBadge from "@/components/BoroughBadge";
import SourceBadge from "@/components/SourceBadge";
import { getListingById } from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Listing Not Found — ReRentNYC" };

  const title = listing.title || listing.address || "Re-Rental Listing";
  return {
    title: `${title} — ReRentNYC`,
    description: `Affordable re-rental: ${title}. ${listing.bedrooms || ""} ${listing.rent ? `$${listing.rent}/mo` : ""} in ${listing.borough || "NYC"}.`,
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) notFound();

  const fmt = (n: number | null) =>
    n !== null ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-block">
        &larr; Back to listings
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <BoroughBadge borough={listing.borough} />
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

        {listing.address && (
          <p className="text-gray-600 mb-6">{listing.address}</p>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Monthly Rent</p>
            <p className="text-lg font-semibold">
              {listing.rent ? `$${listing.rent.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo` : "Contact for rent"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p className="text-lg font-semibold">{listing.bedrooms || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Income Range</p>
            <p className="text-lg font-semibold">
              {listing.income_min !== null || listing.income_max !== null
                ? `${fmt(listing.income_min) || "?"} – ${fmt(listing.income_max) || "?"}`
                : "Contact for details"}
            </p>
          </div>
          {listing.ami_pct && (
            <div>
              <p className="text-sm text-gray-500">AMI</p>
              <p className="text-lg font-semibold">{listing.ami_pct}</p>
            </div>
          )}
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
