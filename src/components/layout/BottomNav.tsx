import { Link, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, ArrowDownToLine, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/create',  label: 'Create',    Icon: Plus             },
  { to: '/receive', label: 'Receive',   Icon: ArrowDownToLine  },
  { to: '/history', label: 'History',   Icon: History          },
] as const;

export default function BottomNav() {
  const { location } = useRouterState();

  return (
    <nav className="md:hidden sticky bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="bg-surface-content/95 backdrop-blur-xl border-t border-border-subtle w-full">
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, label, Icon }) => {
            const isActive =
              to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to);

            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-slate-100"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={22}
                    className={cn(
                      'relative z-10 transition-colors duration-150',
                      isActive ? 'text-black' : 'text-slate-400',
                    )}
                  />
                  <span
                    className={cn(
                      'relative z-10 text-[10px] font-medium transition-colors duration-150',
                      isActive ? 'text-black' : 'text-slate-400',
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
