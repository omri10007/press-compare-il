import Link from "next/link";
import type { Event } from "@/lib/mockData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  Politics: "bg-blue-100 text-blue-700",
  Security: "bg-red-100 text-red-700",
  Technology: "bg-green-100 text-green-700",
};

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const colorClass =
    categoryColors[event.category] ?? "bg-gray-100 text-gray-700";

  return (
    <Link href={`/event/${event.id}`} className="block group">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${colorClass}`}
          >
            {event.category}
          </span>
          <span className="text-xs text-gray-400 shrink-0">
            {formatDate(event.timestamp)}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
          {event.title}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {event.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{event.sourcesCount} sources covering this event</span>
          <span className="text-blue-600 font-medium group-hover:underline">
            Compare →
          </span>
        </div>
      </div>
    </Link>
  );
}
