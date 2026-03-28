export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 text-center">
          ReRentNYC is an independent listing aggregator. Not affiliated with NYC HPD,
          HDC, or any property management company. Listings are sourced from public
          re-rental advertisements. Always verify details directly with the listing agent.
        </p>
        <p className="text-xs text-gray-400 text-center mt-2">
          &copy; {new Date().getFullYear()} ReRentNYC
        </p>
      </div>
    </footer>
  );
}
