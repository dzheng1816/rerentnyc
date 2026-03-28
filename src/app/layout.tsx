import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReRentNYC — NYC Affordable Re-Rental Apartments",
  description:
    "Browse available affordable re-rental apartments in New York City. No lottery required — apply directly to available units.",
  openGraph: {
    title: "ReRentNYC — NYC Affordable Re-Rental Apartments",
    description:
      "Browse available affordable re-rental apartments in New York City. No lottery required.",
    siteName: "ReRentNYC",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
