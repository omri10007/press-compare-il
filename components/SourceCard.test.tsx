import { render, screen } from '@testing-library/react';
import SourceCard from './SourceCard';

const mockSource = {
  source_name: 'Haaretz',
  article_title: 'Test Article Title',
  snippet: 'This is a test snippet for the source.',
  url: 'https://www.haaretz.com',
  key_points: ['Point one', 'Point two'],
};

describe('SourceCard', () => {
  it('renders source name', () => {
    render(<SourceCard source={mockSource} />);
    expect(screen.getByText('Haaretz')).toBeInTheDocument();
  });

  it('renders article title', () => {
    render(<SourceCard source={mockSource} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders all key points', () => {
    render(<SourceCard source={mockSource} />);
    expect(screen.getByText('Point one')).toBeInTheDocument();
    expect(screen.getByText('Point two')).toBeInTheDocument();
  });

  it('does not render a list when key_points is empty', () => {
    render(<SourceCard source={{ ...mockSource, key_points: [] }} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
