import { createFileRoute } from '@tanstack/react-router';
import CreateStreamPage from '@/pages/CreateStreamPage';

export const Route = createFileRoute('/_app/create')({
  component: CreateStreamPage,
});
