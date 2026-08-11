"use client";
import { useRouter } from "next/navigation";

export default function ModalOverlay({ children, backHref = '/major' }: { children: React.ReactNode; backHref?: string }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => router.push(backHref)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
