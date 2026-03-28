import type { Listing } from "./types";

/**
 * Cleans up listing data for display — extracts missing info from
 * raw_text and URL when structured fields are empty.
 */
export function cleanListing(listing: Listing): Listing {
  const cleaned = { ...listing };

  // Fix bad titles like "Apply Here", "Click here"
  cleaned.title = cleanTitle(listing.title, listing.url, listing.address, listing.raw_text);

  // Fix bedrooms containing ZIP codes (e.g. "11208 Br")
  cleaned.bedrooms = cleanBedrooms(listing.bedrooms);

  // Try to extract rent from raw_text if missing
  if (cleaned.rent === null) {
    cleaned.rent = extractRent(listing.raw_text);
  }

  // Clean up address (remove descriptions appended to addresses)
  if (cleaned.address) {
    cleaned.address = cleanAddress(cleaned.address);
  }

  // Try to detect borough from address if missing
  if (!cleaned.borough) {
    cleaned.borough = detectBorough(listing.address, listing.raw_text);
  }

  return cleaned;
}

const JUNK_TITLES = new Set([
  "apply here",
  "click here",
  "view property",
  "view listing",
  "learn more",
  "apply now",
  "view advertisement",
]);

function cleanTitle(
  title: string | null,
  url: string | null,
  address: string | null,
  rawText: string | null
): string | null {
  if (title && !JUNK_TITLES.has(title.toLowerCase().trim())) {
    return title;
  }

  // Try to extract a name from the URL
  if (url) {
    const fromUrl = extractNameFromUrl(url);
    if (fromUrl) return fromUrl;
  }

  // Fall back to address
  if (address && address.trim()) return address;

  return title;
}

function extractNameFromUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname;
    // Get the last meaningful segment
    const segments = path.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last) return null;

    // Decode URL-encoded characters, then remove file extensions
    const decoded = decodeURIComponent(last);
    const name = decoded.replace(/\.(pdf|html|htm|aspx)$/i, "");

    // Remove zero-width spaces and other invisible Unicode
    const stripped = name.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");

    // Convert URL slugs to readable text
    const cleaned = stripped
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()
      // Strip generic prefixes like "Apartment Info"
      .replace(/^(?:Apartment\s*Info|Property\s*Info|Listing)\s*/i, "")
      .trim();

    // Don't return generic names
    if (cleaned.length < 3 || JUNK_TITLES.has(cleaned.toLowerCase())) return null;

    return cleaned;
  } catch {
    return null;
  }
}

function cleanAddress(address: string): string {
  // Remove descriptions appended after the actual address
  // e.g. "5241 Center Blvd Request Application Building Information..."
  return address
    .replace(/\s+(?:Request|Building Information|Apply|Click|Welcome|View).*$/i, "")
    .trim();
}

const VALID_BEDROOMS = new Set([
  "studio",
  "1-bedroom",
  "2-bedroom",
  "3-bedroom",
  "4-bedroom",
  "5-bedroom",
]);

function cleanBedrooms(bedrooms: string | null): string | null {
  if (!bedrooms) return null;
  const lower = bedrooms.toLowerCase().trim();

  // Already valid
  if (VALID_BEDROOMS.has(lower)) return bedrooms;

  // Contains a digit that looks like a ZIP code (5 digits) — invalid
  if (/\d{5}/.test(bedrooms)) return null;

  // Try to extract a bedroom count like "1 BR" or "2-bed"
  const match = bedrooms.match(/(\d)\s*(?:br|bed)/i);
  if (match) return `${match[1]}-bedroom`;

  // "studio" anywhere
  if (/studio/i.test(bedrooms)) return "Studio";

  return null;
}

function extractRent(rawText: string | null): number | null {
  if (!rawText) return null;

  // Match patterns like "$2,415 Per Month", "$1,601 Per Month", "Rent: 2706.0"
  const patterns = [
    /\$\s*([\d,]+(?:\.\d+)?)\s*(?:per\s*month|\/\s*mo)/i,
    /rent[:\s]+\$?\s*([\d,]+(?:\.\d+)?)/i,
    /open\s*market\s*\$\s*([\d,]+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match) {
      const rent = parseFloat(match[1].replace(/,/g, ""));
      if (rent > 100 && rent < 50000) return rent;
    }
  }

  return null;
}

const BOROUGH_PATTERNS: [RegExp, string][] = [
  [/\bManhattan\b/i, "Manhattan"],
  [/\bBrooklyn\b/i, "Brooklyn"],
  [/\bQueens\b/i, "Queens"],
  [/\b(?:The\s+)?Bronx\b/i, "Bronx"],
  [/\bStaten\s*Island\b/i, "Staten Island"],
];

// Well-known neighborhood → borough mappings for common ones
const NEIGHBORHOOD_BOROUGH: Record<string, string> = {
  "bedford-stuyvesant": "Brooklyn",
  "bed-stuy": "Brooklyn",
  "bushwick": "Brooklyn",
  "williamsburg": "Brooklyn",
  "crown heights": "Brooklyn",
  "east new york": "Brooklyn",
  "brownsville": "Brooklyn",
  "flatbush": "Brooklyn",
  "prospect heights": "Brooklyn",
  "fort greene": "Brooklyn",
  "boerum hill": "Brooklyn",
  "clinton hill": "Brooklyn",
  "park slope": "Brooklyn",
  "sunset park": "Brooklyn",
  "bay ridge": "Brooklyn",
  "harlem": "Manhattan",
  "east harlem": "Manhattan",
  "washington heights": "Manhattan",
  "inwood": "Manhattan",
  "lower east side": "Manhattan",
  "les": "Manhattan",
  "chelsea": "Manhattan",
  "hell's kitchen": "Manhattan",
  "upper west side": "Manhattan",
  "upper east side": "Manhattan",
  "morningside heights": "Manhattan",
  "south bronx": "Bronx",
  "mott haven": "Bronx",
  "hunts point": "Bronx",
  "east tremont": "Bronx",
  "fordham": "Bronx",
  "university heights": "Bronx",
  "morris heights": "Bronx",
  "kingsbridge": "Bronx",
  "highbridge": "Bronx",
  "melrose": "Bronx",
  "longwood": "Bronx",
  "astoria": "Queens",
  "long island city": "Queens",
  "flushing": "Queens",
  "jamaica": "Queens",
  "jackson heights": "Queens",
  "elmhurst": "Queens",
  "corona": "Queens",
  "far rockaway": "Queens",
  "hunters point": "Queens",
  "woodside": "Queens",
  "sunnyside": "Queens",
  "st. george": "Staten Island",
  "stapleton": "Staten Island",
};

function detectBorough(address: string | null, rawText: string | null): string | null {
  const combined = [address, rawText].filter(Boolean).join(" ");
  if (!combined) return null;

  // Direct borough mention
  for (const [pattern, borough] of BOROUGH_PATTERNS) {
    if (pattern.test(combined)) return borough;
  }

  // Neighborhood-based detection
  const lowerCombined = combined.toLowerCase();
  for (const [neighborhood, borough] of Object.entries(NEIGHBORHOOD_BOROUGH)) {
    if (lowerCombined.includes(neighborhood)) return borough;
  }

  return null;
}

/**
 * Returns how "complete" a listing is (0-1 scale) for showing disclaimers
 */
export function completenessScore(listing: Listing): number {
  let score = 0;
  let total = 5;

  if (listing.title && !JUNK_TITLES.has(listing.title.toLowerCase().trim())) score++;
  if (listing.address && listing.address.trim()) score++;
  if (listing.rent !== null) score++;
  if (listing.bedrooms !== null) score++;
  if (listing.borough) score++;

  return score / total;
}
