import { getAllEvents, getEventById } from '@/lib/events';
import SourceCard from '@/components/SourceCard';
import BackLink from '@/components/BackLink';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllEvents().map((event) => ({ id: event.id }));
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <BackLink />
      </div>

      <p className="text-sm text-gray-400 mb-1">{event.date}</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">{event.summary}</p>

      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        {event.sources.length} sources covering this event
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {event.sources.map((source) => (
          <SourceCard key={source.source_name} source={source} />
        ))}
      </div>
    </main>
  );
}
