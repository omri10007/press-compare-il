import { render, screen } from '@testing-library/react';
import EventCard from './EventCard';

const mockEvent = {
  id: 'test-event',
  title: 'Test News Event',
  date: '2024-11-15',
  summary: 'A test summary.',
  sources: [
    { source_name: 'Source A', article_title: '', snippet: '', url: '', key_points: [] },
    { source_name: 'Source B', article_title: '', snippet: '', url: '', key_points: [] },
  ],
};

describe('EventCard', () => {
  it('renders event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test News Event')).toBeInTheDocument();
  });

  it('renders source count', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/2 source/i)).toBeInTheDocument();
  });

  it('renders a link to the event page', () => {
    render(<EventCard event={mockEvent} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/events/test-event');
  });
});
