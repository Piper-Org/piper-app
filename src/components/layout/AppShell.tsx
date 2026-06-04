import type { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import SideNav from './SideNav';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface-base flex">
      {/* Persistent Desktop Sidebar */}
      <SideNav />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar />
        
        <main className="flex-1 pb-20 md:pb-8 pt-4 md:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
}
