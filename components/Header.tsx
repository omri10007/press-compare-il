import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            📰 Press Compare IL
          </span>
        </Link>
        <span className="text-sm text-gray-500">
          Compare how Israel's news outlets cover the same story
        </span>
      </div>
    </header>
  );
}
