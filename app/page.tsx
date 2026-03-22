import EventCard from "@/components/EventCard";
import { events } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Same Event. Different Stories.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Press Compare IL shows you how Israeli news outlets frame the same
          event — revealing differences in tone, emphasis, and narrative.
        </p>
      </div>

      {/* Event list */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Events</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
