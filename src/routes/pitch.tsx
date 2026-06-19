import { createFileRoute } from '@tanstack/react-router';
import PitchPage from '@/pages/PitchPage';

export const Route = createFileRoute('/pitch')({
  component: PitchPage,
});
