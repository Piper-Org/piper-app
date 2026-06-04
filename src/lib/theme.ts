export const STREAM_STATUS_COLORS = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-slate-50 text-slate-700 border-slate-200',
  revoked: 'bg-rose-50 text-rose-700 border-rose-200',
};

export type StreamStatus = keyof typeof STREAM_STATUS_COLORS;
