import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string | undefined | null, startChars = 6, endChars = 4) {
  if (!address) return '';
  // Don't truncate SuiNS names
  if (address.endsWith('.sui')) return address;
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
