import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TxToaster } from '@/components/common/TxToast';

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TxToaster position="bottom-center" />
    </>
  ),
});
