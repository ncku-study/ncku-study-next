"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { CommentDTO, PaginatedResponse } from "@/types/api";
import { useSidebar } from "@/components/sidebar/SidebarContext";
import { useOptionalMajorModalRoute } from "@/components/major/MajorModalRouteContext";

import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

function useModalNav(currentId: number) {
  const { data } = useQuery({
    queryKey: ALL_COMMENTS_QUERY_KEY,
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
  useClientNavigation = false,
}: {
  direction: "left" | "right";
  href: string | null;
  onNavigate: (href: string) => void;
  useClientNavigation?: boolean;
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

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const isPlainLeftClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (useClientNavigation) {
      if (!isPlainLeftClick) return;
      event.preventDefault();
    }
    onNavigate(href);
  };

  if (useClientNavigation) {
    return <a href={href} onClick={onClick} className="flex justify-center items-center cursor-pointer">{arrow}</a>;
  }

  return <Link href={href} onClick={() => onNavigate(href)} className="flex justify-center items-center cursor-pointer">{arrow}</Link>;
}

export function ModalPrevBtn({ currentId, basePath = '/major' }: { currentId: number; basePath?: string }) {
  const { prevId } = useModalNav(currentId);
  const { setPendingHref } = useSidebar();
  const majorRoute = useOptionalMajorModalRoute();
  const href = prevId !== null ? `${basePath}/${prevId}` : null;
  const useClientNavigation = basePath === '/major' && majorRoute !== null;
  return <ChangeBtn direction="left" href={href} onNavigate={useClientNavigation ? majorRoute.navigate : setPendingHref} useClientNavigation={useClientNavigation} />;
}

export function ModalNextBtn({ currentId, basePath = '/major' }: { currentId: number; basePath?: string }) {
  const { nextId } = useModalNav(currentId);
  const { setPendingHref } = useSidebar();
  const majorRoute = useOptionalMajorModalRoute();
  const href = nextId !== null ? `${basePath}/${nextId}` : null;
  const useClientNavigation = basePath === '/major' && majorRoute !== null;
  return <ChangeBtn direction="right" href={href} onNavigate={useClientNavigation ? majorRoute.navigate : setPendingHref} useClientNavigation={useClientNavigation} />;
}
