export default function AISummaryCard({
  summary,
  sentiment = 'Neutral',
  actionRequired,
  onApplyAction,
}) {
  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100/80">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-semibold text-purple-900 uppercase tracking-wide">AI Thread Intelligence</span>
        </div>
        {sentiment && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            Sentiment: {sentiment}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-700 leading-relaxed">
        {summary || 'Analyzing thread context and intent...'}
      </p>

      {actionRequired && (
        <div className="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-xs">
          <span className="text-purple-950 font-medium">
            <strong className="text-purple-800">Recommended Next Step:</strong> {actionRequired}
          </span>
          {onApplyAction && (
            <button
              onClick={onApplyAction}
              className="text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
            >
              Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
}
