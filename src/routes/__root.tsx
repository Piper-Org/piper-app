import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </AppShell>
  ),
});
