import LabelBadge from './LabelBadge';

export default function ThreadCard({ thread, isSelected = false, onClick }) {
  const { sender, subject, aiSummary, labels, timestamp, unread, status } = thread;

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer border-b border-slate-200 p-4 transition-all hover:bg-slate-50/80 ${
        isSelected ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {sender?.avatar ? (
              <img
                src={sender.avatar}
                alt={sender.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                {sender?.name?.charAt(0) || 'U'}
              </div>
            )}
            {unread && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </div>
          <div className="truncate">
            <span className={`text-xs ${unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
              {sender?.name || sender?.email}
            </span>
            {sender?.company && (
              <span className="ml-1 text-[11px] text-slate-400">({sender.company})</span>
            )}
          </div>
        </div>
        <span className="shrink-0 text-[11px] text-slate-400">{timestamp}</span>
      </div>

      <div className="mt-2">
        <h4 className={`text-sm truncate ${unread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
          {subject}
        </h4>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-normal">
          {aiSummary || 'No summary available.'}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {labels?.slice(0, 3).map((lbl, idx) => (
            <LabelBadge key={idx} label={lbl} />
          ))}
        </div>
        {status && (
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
