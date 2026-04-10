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
