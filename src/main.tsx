import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DAppKitProvider } from '@mysten/dapp-kit-react';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { dAppKit } from '@/lib/sui';
import { ENOKI_API_KEY } from '@/lib/constants';
import { routeTree } from './routeTree.gen';
import '@/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnokiFlowProvider apiKey={ENOKI_API_KEY}>
      <DAppKitProvider dAppKit={dAppKit}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </DAppKitProvider>
    </EnokiFlowProvider>
  </StrictMode>,
);
