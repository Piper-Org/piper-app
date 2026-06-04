import { Link, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, ArrowDownToLine, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/',        label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/create',  label: 'Create',    Icon: Plus             },
  { to: '/receive', label: 'Receive',   Icon: ArrowDownToLine  },
  { to: '/history', label: 'History',   Icon: History          },
] as const;

export default function SideNav() {
  const { location } = useRouterState();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-surface-content min-h-dvh fixed top-0 left-0 z-50">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold tracking-tight text-black select-none">
          piper
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map(({ to, label, Icon }) => {
          const isActive =
            to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive ? 'text-black' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidenav-indicator"
                  className="absolute inset-0 rounded-lg bg-slate-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10 font-medium text-sm">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Network</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-medium text-slate-700">Sui Testnet</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
