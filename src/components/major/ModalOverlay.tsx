"use client";
import { useRouter } from "next/navigation";
import { useOptionalMajorModalRoute } from "@/components/major/MajorModalRouteContext";

export default function ModalOverlay({ children, backHref = '/major', onClose }: { children: React.ReactNode; backHref?: string; onClose?: () => void }) {
  const router = useRouter();
  const majorRoute = useOptionalMajorModalRoute();

  const close = () => {
    if (onClose) {
      onClose();
    } else if (majorRoute) {
      majorRoute.close(backHref);
    } else {
      router.push(backHref);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={close}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
