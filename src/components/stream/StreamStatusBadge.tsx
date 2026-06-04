import { Badge } from '@/components/ui/badge';
import { StreamStatus, STREAM_STATUS_COLORS } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface StreamStatusBadgeProps {
  status: StreamStatus;
  className?: string;
}

export function StreamStatusBadge({ status, className }: StreamStatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Badge variant="outline" className={cn(STREAM_STATUS_COLORS[status], className, "font-semibold shadow-subtle")}>
      {label}
    </Badge>
  );
}
