'use client';

import { useRouter } from 'next/navigation';

export default function StudyModalOverlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50"
      onClick={() => router.push('/study')}
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
