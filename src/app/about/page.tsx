import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ReRentNYC",
  description: "Learn about ReRentNYC and how affordable re-rental apartments work in New York City.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About ReRentNYC</h1>

      <div className="prose prose-gray max-w-none">
        <h2>What is ReRentNYC?</h2>
        <p>
          ReRentNYC is a free directory that aggregates affordable re-rental apartment listings
          from across New York City into one searchable place. We check multiple sources every
          15 minutes so you can find new listings as soon as they appear.
        </p>

        <h2>What are re-rentals?</h2>
        <p>
          Re-rentals are affordable housing units that become available when a current tenant
          moves out. Unlike Housing Connect lotteries (where you enter a drawing for new
          developments), re-rentals let you apply directly — first come, first served.
        </p>
        <p>
          These apartments are part of income-restricted housing programs. Rents are set based
          on Area Median Income (AMI) percentages, and you must meet income requirements to
          qualify.
        </p>

        <h2>How does it work?</h2>
        <p>
          We automatically monitor re-rental listings from sources including NYC HDC, Reside
          New York, Taxace, TF Cornerstone, St. Nicks Alliance, and others. When a new listing
          appears, it shows up here within minutes.
        </p>
        <p>
          Click on any listing to see details, then follow the link to apply directly with the
          listing agent. ReRentNYC does not process applications — we simply help you discover
          available units.
        </p>

        <h2>Disclaimer</h2>
        <p>
          ReRentNYC is an independent project and is not affiliated with NYC HPD, HDC, or any
          property management company. Listings are sourced from publicly available re-rental
          advertisements. Always verify details directly with the listing agent before applying.
        </p>
      </div>
    </div>
  );
}
