import type { Source } from "@/lib/mockData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const tagColors: Record<string, string> = {
  breaking: "bg-red-100 text-red-700",
  analysis: "bg-indigo-100 text-indigo-700",
  opinion: "bg-amber-100 text-amber-700",
};

const languageFlags: Record<Source["language"], string> = {
  Hebrew: "🇮🇱",
  English: "🇬🇧",
  Arabic: "🕌",
};

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-bold text-gray-800 text-sm">{source.name}</span>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDate(source.timestamp)}
        </span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2">
        {source.headline}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {source.excerpt}
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {source.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tagColors[tag] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {languageFlags[source.language]} {source.language}
        </span>
      </div>
    </div>
  );
}
