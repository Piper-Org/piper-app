import { createFileRoute } from '@tanstack/react-router';
import ReceivePage from '@/pages/ReceivePage';

export const Route = createFileRoute('/_app/receive')({
  component: ReceivePage,
});
