export default function AIBanner({
  title = 'AI Auto-Triage Active',
  message = 'Gemini 2.5 is scanning inbound threads, generating executive draft replies, and prioritizing urgent contracts in real time.',
  stats = '98.4% Confidence • 14 pending approvals',
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/70 via-purple-50/50 to-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 max-w-xl">{message}</p>
          </div>
        </div>
        {stats && (
          <div className="shrink-0 text-xs font-medium text-indigo-700 bg-white/80 border border-indigo-100 px-3 py-1.5 rounded-lg shadow-2xs">
            {stats}
          </div>
        )}
      </div>
    </div>
  );
}
