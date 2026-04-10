import eventsData from '@/data/events.json';

export interface Source {
  source_name: string;
  article_title: string;
  snippet: string;
  url: string;
  key_points: string[];
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  summary: string;
  sources: Source[];
}

export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

export function getEventById(id: string): Event | undefined {
  return (eventsData as Event[]).find((e) => e.id === id);
}
