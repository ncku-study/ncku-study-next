'use client';

import { useRouter } from 'next/navigation';
import { useOptionalStudyModalRoute } from '@/components/major/MajorModalRouteContext';

interface StudyModalOverlayProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export default function StudyModalOverlay({ children, onClose }: StudyModalOverlayProps) {
  const router = useRouter();
  const studyRoute = useOptionalStudyModalRoute();
  const close = onClose ?? (studyRoute ? () => studyRoute.close('/study') : () => router.push('/study'));

  return (
    <div
      className="fixed inset-0 bg-overlay z-50"
      onClick={close}
    >
      <div
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
