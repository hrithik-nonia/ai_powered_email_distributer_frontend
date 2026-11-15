export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  if (type === 'thread') {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-2.5 bg-slate-200 rounded w-12"></div>
            </div>
            <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-2.5 bg-slate-100 rounded w-full"></div>
            <div className="flex gap-2 pt-1">
              <div className="h-4 bg-slate-100 rounded-full w-14"></div>
              <div className="h-4 bg-slate-100 rounded-full w-14"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-slate-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-6 bg-slate-300 rounded w-16"></div>
          <div className="h-3 bg-slate-100 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}
