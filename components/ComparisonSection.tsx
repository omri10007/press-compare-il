interface ComparisonSectionProps {
  notes: string[];
}

export default function ComparisonSection({ notes }: ComparisonSectionProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
      <h2 className="text-lg font-bold text-blue-900 mb-4">
        🔍 How Coverage Differs
      </h2>
      <ul className="space-y-3">
        {notes.map((note, i) => {
          const [label, ...rest] = note.split(": ");
          const body = rest.join(": ");
          return (
            <li key={i} className="flex gap-3 text-sm text-blue-800">
              <span className="mt-0.5 shrink-0 text-blue-400">▸</span>
              <span>
                {body ? (
                  <>
                    <span className="font-semibold">{label}:</span> {body}
                  </>
                ) : (
                  note
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-blue-600 italic">
        Note: These observations are based on mock data and are intended to
        illustrate the comparison feature.
      </p>
    </div>
  );
}
