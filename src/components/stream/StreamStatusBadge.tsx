
interface StreamStatusBadgeProps {
  status: 'active' | 'inactive';
}

export function StreamStatusBadge({ status }: StreamStatusBadgeProps) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-600">
      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
      Inactive
    </span>
  );
}
