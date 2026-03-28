const SOURCE_LABELS: Record<string, string> = {
  hdc: "HDC",
  resideny: "Reside NY",
  taxace: "Taxace",
  tfc: "TF Cornerstone",
  sjp: "SJP",
  stnicksalliance: "St. Nicks",
  ibis: "Ibis",
  city5: "City5",
};

export default function SourceBadge({ source }: { source: string }) {
  const label = SOURCE_LABELS[source] || source;
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {label}
    </span>
  );
}
