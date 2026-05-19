import { format, isBefore, isSameDay, parseISO } from 'date-fns';

export type JobStatus = 'Overdue' | 'Due Today' | 'Upcoming' | 'Completed';

export function calculateJobStatus(collectionDate: string, statusOverride?: string): JobStatus {
  if (statusOverride === 'Completed') return 'Completed';
  
  const today = new Date();
  const date = parseISO(collectionDate);

  if (isSameDay(date, today)) {
    return 'Due Today';
  }
  
  if (isBefore(date, today)) {
    return 'Overdue';
  }
  
  return 'Upcoming';
}

export function getStatusColor(status: JobStatus): string {
  switch (status) {
    case 'Overdue':
      return 'text-red-400 bg-red-400/10 border-red-500/30 glow-red';
    case 'Due Today':
      return 'text-amber-400 bg-amber-400/10 border-amber-500/30 glow-amber';
    case 'Upcoming':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30 glow-emerald';
    case 'Completed':
      return 'text-blue-400 bg-blue-400/10 border-blue-500/30 glow-blue';
    default:
      return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
  }
}
