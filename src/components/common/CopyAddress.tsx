import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyAddressProps {
  address: string;
  className?: string;
}

export function CopyAddress({ address, className }: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!address) return null;

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors font-mono text-sm text-slate-700 w-full justify-between group",
        className
      )}
      aria-label="Copy address"
    >
      <span className="truncate mr-2">{address.slice(0, 12)}...{address.slice(-12)}</span>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      )}
    </button>
  );
}
