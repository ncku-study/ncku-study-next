"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { CommentDTO, PaginatedResponse } from "@/types/api";
import { useSidebar } from "@/components/sidebar/SidebarContext";

const QUERY_KEY = ["comments", { college: "", department: "", year: "", category: "" }];

function useModalNav(currentId: number) {
  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetch<PaginatedResponse<CommentDTO>>("/comments"),
    staleTime: 5 * 60 * 1000,
  });

  const comments = data?.data ?? [];
  const currentIndex = comments.findIndex((c) => c.id === currentId);

  return {
    prevId: currentIndex > 0 ? comments[currentIndex - 1].id : null,
    nextId: currentIndex >= 0 && currentIndex < comments.length - 1 ? comments[currentIndex + 1].id : null,
  };
}

function ChangeBtn({
  direction,
  href,
  onNavigate,
}: {
  direction: "left" | "right";
  href: string | null;
  onNavigate: (href: string) => void;
}) {
  const arrow = (
    <div
      className={`border-r-2 border-t-2 border-gray-500 h-[30px] w-[30px] border-l border-b border-l-transparent border-b-transparent inline-block ${
        direction === "left" ? "rotate-[225deg]" : "rotate-45"
      }`}
    />
  );

  if (!href) {
    return <div className="flex justify-center items-center invisible">{arrow}</div>;
  }

  return (
    <Link
      href={href}
      onClick={() => onNavigate(href)}
      className="flex justify-center items-center cursor-pointer"
    >
      {arrow}
    </Link>
  );
}

export function ModalPrevBtn({ currentId }: { currentId: number }) {
  const { prevId } = useModalNav(currentId);
  const { setPendingHref } = useSidebar();
  const href = prevId !== null ? `/major/${prevId}` : null;
  return <ChangeBtn direction="left" href={href} onNavigate={setPendingHref} />;
}

export function ModalNextBtn({ currentId }: { currentId: number }) {
  const { nextId } = useModalNav(currentId);
  const { setPendingHref } = useSidebar();
  const href = nextId !== null ? `/major/${nextId}` : null;
  return <ChangeBtn direction="right" href={href} onNavigate={setPendingHref} />;
}
