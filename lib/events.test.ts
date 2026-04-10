import type { Event, Source } from './events';
import { getAllEvents, getEventById } from './events';

describe('Event types', () => {
  it('accepts valid event shape', () => {
    const source: Source = {
      source_name: 'Test Source',
      article_title: 'Test Title',
      snippet: 'Test snippet.',
      url: 'https://example.com',
      key_points: ['Point A', 'Point B'],
    };
    const event: Event = {
      id: 'test-event',
      title: 'Test Event',
      date: '2024-01-01',
      summary: 'A test event.',
      sources: [source],
    };
    expect(event.id).toBe('test-event');
    expect(event.sources).toHaveLength(1);
  });
});

describe('getAllEvents', () => {
  it('returns an array of events', () => {
    const events = getAllEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it('each event has required fields', () => {
    const events = getAllEvents();
    for (const event of events) {
      expect(event.id).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.sources.length).toBeGreaterThan(0);
    }
  });
});

describe('getEventById', () => {
  it('returns the correct event', () => {
    const event = getEventById('ceasefire-talks-2024');
    expect(event?.id).toBe('ceasefire-talks-2024');
  });

  it('returns undefined for unknown id', () => {
    const event = getEventById('does-not-exist');
    expect(event).toBeUndefined();
  });
});
