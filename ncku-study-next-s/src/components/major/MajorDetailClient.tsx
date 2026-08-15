"use client";

import { CommentDTO } from "@/types/api";
import MajorGrid from "@/components/major/MajorGrid";
import MajorModal from "@/components/major/MajorModal";
import { useOptionalMajorModalRoute } from "@/components/major/MajorModalRouteContext";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  serverComment?: CommentDTO;
}

/**
 * The modal shell is client-rendered for App Router navigations. The list
 * query is already hydrated on the major page, so opening a card or changing
 * pages can reuse that cache instead of fetching the detail again.
 */
export default function MajorDetailClient({ id, serverComment }: Props) {
  const router = useRouter();
  const majorRoute = useOptionalMajorModalRoute();
  const routeId = majorRoute?.majorId;
  const currentId = routeId ?? id;
  const isClosed = majorRoute !== null && routeId === null;

  const handleClose = () => {
    if (majorRoute) {
      majorRoute.close('/major');
    } else {
      router.push('/major');
    }
  };

  return (
    <>
      <MajorGrid renderClientModal={false} />
      {!isClosed && (
        <MajorModal
          id={currentId}
          serverComment={currentId === id ? serverComment : undefined}
          onClose={handleClose}
        />
      )}
    </>
  );
}
