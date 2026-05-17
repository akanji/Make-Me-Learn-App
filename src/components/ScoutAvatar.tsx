import { Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ScoutAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-purple-glow animate-float relative group", className)}>
      <Zap className="text-white w-5 h-5 fill-white shrink-0" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-surface-card" />
    </div>
  );
}
