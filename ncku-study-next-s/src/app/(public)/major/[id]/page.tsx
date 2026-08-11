import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getCommentRepository } from '@/lib/repositories';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllComments } from '@/lib/prefetch-comments';
import MajorGrid from '@/components/major/MajorGrid';
import ModalOverlay from '@/components/major/ModalOverlay';
import { ModalPrevBtn, ModalNextBtn } from '@/components/major/ModalChangeBtns';
import ModalContent from '@/components/major/ModalContent';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [repo, t] = await Promise.all([
    getCommentRepository(),
    getTranslations('site'),
  ]);
  const comment = await repo.findById(parseInt(id, 10));
  if (!comment) return {};
  return {
    title: t('majorDetailTitle', { year: comment.year, inMaj: comment.in_maj, category: comment.category }),
    description: comment.comment,
  };
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  const queryClient = getQueryClient();
  const repo = await getCommentRepository();

  const [comment] = await Promise.all([
    repo.findById(numId),
    prefetchAllComments(queryClient),
  ]);

  if (!comment) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Background content */}
      <MajorGrid />

      {/* Backdrop — closes modal on click */}
      <ModalOverlay>
        {/* Popup */}
        <div
          className="relative w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white text-black grid grid-cols-[50px_auto_50px] max-lg:w-[360px] max-lg:max-h-[65vh] max-lg:min-w-[95vw]"
          style={{ gridTemplateRows: '100%' }}
        >
          <ModalPrevBtn currentId={numId} />
          <ModalContent id={numId} serverComment={comment} />
          <ModalNextBtn currentId={numId} />
        </div>
      </ModalOverlay>
    </HydrationBoundary>
  );
}
