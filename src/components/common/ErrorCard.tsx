import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorCardProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorCard({ title = "Something went wrong", message, className }: ErrorCardProps) {
  return (
    <div className={cn("bg-rose-50/50 backdrop-blur-md border border-rose-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm", className)}>
      <div className="bg-rose-100 p-2 rounded-full shrink-0">
        <AlertCircle className="w-6 h-6 text-rose-600" />
      </div>
      <div>
        <h3 className="text-rose-900 font-bold text-lg">{title}</h3>
        <p className="text-rose-700 mt-1 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
