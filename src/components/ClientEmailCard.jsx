import LabelBadge from './LabelBadge';

export default function ClientEmailCard({ update, onAction }) {
  const { title, sender, status, time, badge, summary } = update;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">From: {sender} • {time}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {badge && <LabelBadge label={badge} />}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-600 leading-relaxed">
        {summary}
      </p>

      <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
        <button
          onClick={() => onAction && onAction(update, 'review')}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
        >
          View Context
        </button>
        <button
          onClick={() => onAction && onAction(update, 'approve')}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
        >
          Approve & Send
        </button>
      </div>
    </div>
  );
}
