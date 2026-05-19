import { JobStatus, getStatusColor } from '../utils/status';
import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider border transition-all duration-300',
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
}
