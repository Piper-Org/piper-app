import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import WalletGate from '@/components/auth/WalletGate';
import { EnokiTxModal } from '@/components/auth/EnokiTxModal';

export const Route = createFileRoute('/_app')({
  component: () => (
    <WalletGate>
      <AppShell>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </AppShell>
      <EnokiTxModal />
    </WalletGate>
  ),
});
