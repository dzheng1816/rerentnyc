import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ReRent<span className="text-blue-600">NYC</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
