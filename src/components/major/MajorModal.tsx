"use client";

import { CommentDTO } from "@/types/api";
import ModalOverlay from "@/components/major/ModalOverlay";
import { ModalPrevBtn, ModalNextBtn } from "@/components/major/ModalChangeBtns";
import ModalContent from "@/components/major/ModalContent";

interface Props {
  id: number;
  serverComment?: CommentDTO;
  onClose?: () => void;
}

export default function MajorModal({ id, serverComment, onClose }: Props) {
  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="relative flex w-240 h-280 max-h-3/4 p-2 bg-white text-card-text max-lg:w-144 max-lg:max-h-2/3 max-lg:min-w-full"
      >
        <ModalPrevBtn currentId={id} />
        <ModalContent id={id} serverComment={serverComment} />
        <ModalNextBtn currentId={id} />
      </div>
    </ModalOverlay>
  );
}
