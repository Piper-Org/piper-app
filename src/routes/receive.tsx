import { createFileRoute } from '@tanstack/react-router';
import ReceivePage from '@/pages/ReceivePage';

export const Route = createFileRoute('/receive')({
  component: ReceivePage,
});
