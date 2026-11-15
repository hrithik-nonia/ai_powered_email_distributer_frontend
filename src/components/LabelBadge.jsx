export default function LabelBadge({ label }) {
  const getBadgeStyle = (text) => {
    switch (text?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'ai drafted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'contract':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'billing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'technical':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'partnership':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'client attention':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'completed':
      case 'resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        label
      )}`}
    >
      {label}
    </span>
  );
}
