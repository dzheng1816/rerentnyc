const BOROUGH_COLORS: Record<string, string> = {
  Manhattan: "bg-purple-100 text-purple-800",
  Brooklyn: "bg-blue-100 text-blue-800",
  Queens: "bg-green-100 text-green-800",
  Bronx: "bg-orange-100 text-orange-800",
  "Staten Island": "bg-teal-100 text-teal-800",
};

export default function BoroughBadge({ borough }: { borough: string | null }) {
  if (!borough) return null;
  const colors = BOROUGH_COLORS[borough] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors}`}>
      {borough}
    </span>
  );
}
