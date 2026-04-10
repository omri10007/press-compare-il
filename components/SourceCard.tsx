import type { Source } from '@/lib/events';

export default function SourceCard({ source }: { source: Source }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          {source.source_name}
        </span>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
          >
            Read original ↗
          </a>
        )}
      </div>

      <p className="text-base font-medium text-gray-900">{source.article_title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{source.snippet}</p>

      {source.key_points.length > 0 && (
        <ul className="mt-1 space-y-1">
          {source.key_points.map((point, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-blue-400 mt-0.5" aria-hidden="true">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {source.notes && (
        <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2">
          {source.notes}
        </p>
      )}
    </div>
  );
}
