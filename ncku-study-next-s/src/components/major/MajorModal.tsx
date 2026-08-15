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
        className="relative w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white text-black grid grid-cols-[50px_auto_50px] max-lg:w-[360px] max-lg:max-h-[65vh] max-lg:min-w-[95vw]"
        style={{ gridTemplateRows: '100%' }}
      >
        <ModalPrevBtn currentId={id} />
        <ModalContent id={id} serverComment={serverComment} />
        <ModalNextBtn currentId={id} />
      </div>
    </ModalOverlay>
  );
}
