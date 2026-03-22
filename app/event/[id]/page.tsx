import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, events } from "@/lib/mockData";
import SourceCard from "@/components/SourceCard";
import ComparisonSection from "@/components/ComparisonSection";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6"
      >
        ← Back to events
      </Link>

      {/* Event header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold text-gray-700">
            {event.category}
          </span>
          <span className="text-sm text-gray-400">
            {formatDate(event.timestamp)}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
          {event.title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">{event.summary}</p>
      </div>

      {/* Source cards */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {event.sourcesCount} Sources Covering This Event
      </h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mb-10">
        {event.sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      {/* Comparison section */}
      <ComparisonSection notes={event.comparisonNotes} />
    </div>
  );
}
