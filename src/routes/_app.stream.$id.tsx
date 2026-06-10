import { createFileRoute } from '@tanstack/react-router';
import StreamDetailPage from '@/pages/StreamDetailPage';

export const Route = createFileRoute('/_app/stream/$id')({
  component: StreamDetailPage,
});
