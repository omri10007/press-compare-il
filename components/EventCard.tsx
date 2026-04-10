import Link from 'next/link';
import type { Event } from '@/lib/events';

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all"
    >
      <p className="text-sm text-gray-400 mb-1">{event.date}</p>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.summary}</p>
      <span className="text-xs font-medium text-blue-600">
        {event.sources.length} source{event.sources.length !== 1 ? 's' : ''}
      </span>
    </Link>
  );
}
