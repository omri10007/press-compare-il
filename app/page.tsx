import { getAllEvents } from '@/lib/events';
import EventCard from '@/components/EventCard';

export default function Home() {
  const events = getAllEvents();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">press-compare</h1>
      <p className="text-gray-500 mb-10">
        See how different sources cover the same story.
      </p>

      {events.length === 0 ? (
        <p className="text-gray-400">No events available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
