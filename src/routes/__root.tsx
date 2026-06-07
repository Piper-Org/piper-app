import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import WalletGate from '@/components/auth/WalletGate';
import { TxToaster } from '@/components/common/TxToast';

export const Route = createRootRoute({
  component: () => (
    <WalletGate>
      <AppShell>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </AppShell>
      <TxToaster position="bottom-center" />
    </WalletGate>
  ),
});
