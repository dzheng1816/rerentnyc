"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Borough } from "@/lib/types";

const BOROUGHS: Borough[] = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
const BEDROOMS = ["Studio", "1-bedroom", "2-bedroom", "3-bedroom", "4-bedroom"];
const HOUSEHOLD_SIZES = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SOURCES = [
  { value: "hdc", label: "HDC" },
  { value: "resideny", label: "Reside NY" },
  { value: "taxace", label: "Taxace" },
  { value: "taxsolute", label: "Tax Solute" },
  { value: "tfc", label: "TF Cornerstone" },
  { value: "sjp", label: "SJP" },
  { value: "stnicksalliance", label: "St. Nicks" },
  { value: "ibis", label: "Ibis" },
  { value: "city5", label: "City5" },
  { value: "mgny", label: "MGNY" },
  { value: "fifthave", label: "Fifth Ave Committee" },
  { value: "langsam", label: "Langsam" },
  { value: "springleasing", label: "Spring Leasing" },
  { value: "cgmr", label: "CGMR" },
  { value: "reclaimhdfc", label: "Reclaim HDFC" },
  { value: "afny", label: "AFNY" },
  { value: "iafford", label: "iAfford" },
  { value: "ahgleasing", label: "AHG Leasing" },
  { value: "clintonmgmt", label: "Clinton Mgmt" },
  { value: "housingpartnership", label: "Housing Partnership" },
  { value: "sois", label: "SOIS" },
  { value: "wavecrest", label: "Wavecrest" },
  { value: "mickigarcia", label: "Micki Garcia" },
  { value: "thebridge", label: "The Bridge" },
  { value: "infinitehorizons", label: "Infinite Horizons" },
  { value: "kgupright", label: "K&G Upright" },
  { value: "yourneighborhood", label: "Your Neighborhood" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [neighborhood, setNeighborhood] = useState(searchParams.get("neighborhood") || "");
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [rentMin, setRentMin] = useState(searchParams.get("rentMin") || "");
  const [rentMax, setRentMax] = useState(searchParams.get("rentMax") || "");
  const [income, setIncome] = useState(searchParams.get("income") || "");
  const [householdSize, setHouseholdSize] = useState(searchParams.get("householdSize") || "");
  const [source, setSource] = useState(searchParams.get("source") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    if (!borough) {
      setNeighborhoods([]);
      setNeighborhood("");
      return;
    }
    async function fetchNeighborhoods() {
      const { data } = await supabase
        .from("listings")
        .select("neighborhood")
        .eq("borough", borough)
        .eq("active", true)
        .not("neighborhood", "is", null);
      if (data) {
        const unique = [...new Set(data.map((r: { neighborhood: string }) => r.neighborhood))].sort();
        setNeighborhoods(unique);
      }
    }
    fetchNeighborhoods();
    setNeighborhood("");
  }, [borough]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (borough) params.set("borough", borough);
    if (neighborhood) params.set("neighborhood", neighborhood);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (rentMin) params.set("rentMin", rentMin);
    if (rentMax) params.set("rentMax", rentMax);
    if (income) params.set("income", income);
    if (householdSize) params.set("householdSize", householdSize);
    if (source) params.set("source", source);
    if (sort && sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }, [borough, neighborhood, bedrooms, rentMin, rentMax, income, householdSize, source, sort, router]);

  const clearFilters = useCallback(() => {
    setBorough(""); setNeighborhood(""); setBedrooms(""); setRentMin("");
    setRentMax(""); setIncome(""); setHouseholdSize(""); setSource(""); setSort("newest");
    router.push("/");
  }, [router]);

  const selectClass = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const inputClass = selectClass;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Borough</label>
          <select className={selectClass} value={borough} onChange={(e) => setBorough(e.target.value)}>
            <option value="">All Boroughs</option>
            {BOROUGHS.map((b) => (<option key={b} value={b}>{b}</option>))}
          </select>
        </div>

        {borough && neighborhoods.length >= 2 && (
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Neighborhood</label>
            <select className={selectClass} value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
              <option value="">All Neighborhoods</option>
              {neighborhoods.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Bedrooms</label>
          <select className={selectClass} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">All</option>
            {BEDROOMS.map((b) => (<option key={b} value={b}>{b}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Min Rent</label>
          <input type="number" className={inputClass} placeholder="$0" value={rentMin} onChange={(e) => setRentMin(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Max Rent</label>
          <input type="number" className={inputClass} placeholder="No max" value={rentMax} onChange={(e) => setRentMax(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Your Income</label>
          <input type="number" className={inputClass} placeholder="e.g. 68000" value={income} onChange={(e) => setIncome(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Household Size</label>
          <select className={selectClass} value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)}>
            <option value="">Any</option>
            {HOUSEHOLD_SIZES.map((s) => (<option key={s} value={s}>{s} {s === "1" ? "person" : "people"}</option>))}
          </select>
          {householdSize && income && (
            <p className="text-xs text-gray-400 mt-1">
              For a household of {householdSize} at ${Number(income).toLocaleString()}/yr, check listing income ranges to see if you qualify.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Source</label>
          <select className={selectClass} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All Sources</option>
            {SOURCES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Sort By</label>
          <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="rent_asc">Rent: Low to High</option>
            <option value="rent_desc">Rent: High to Low</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button onClick={applyFilters} className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Search
          </button>
          <button onClick={clearFilters} className="rounded-md bg-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
