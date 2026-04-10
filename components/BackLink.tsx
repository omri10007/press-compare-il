import Link from 'next/link';

export default function BackLink() {
  return (
    <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
      ← All events
    </Link>
  );
}
