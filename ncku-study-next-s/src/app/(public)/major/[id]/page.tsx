import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getCommentRepository } from '@/lib/repositories';
import MajorGrid from '@/components/major/MajorGrid';
import type { CommentDTO } from '@/types/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const repo = await getCommentRepository();
  const comment: CommentDTO | null = await repo.findById(parseInt(id, 10));

  if (!comment) {
    notFound();
  }

  const t = await getTranslations('major');

  return (
    <>
      {/* Background: blurred MajorGrid */}
      <div className="fixed inset-0 overflow-auto blur-sm brightness-75 pointer-events-none select-none">
        <MajorGrid />
      </div>

      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/40 z-10" />

      {/* Modal */}
      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
          {/* Close button */}
          <Link
            href="/"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            aria-label={t('close')}
          >
            ?
          </Link>

          <h2 className="text-xl font-bold mb-4">{t('title')}</h2>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium text-gray-600">{t('department')}</dt>
            <dd>{comment.department}</dd>

            <dt className="font-medium text-gray-600">{t('year')}</dt>
            <dd>{comment.year}</dd>

            <dt className="font-medium text-gray-600">{t('score')}</dt>
            <dd>{comment.score}</dd>

            <dt className="font-medium text-gray-600">{t('isPass')}</dt>
            <dd>{comment.isPass === 'true' ? t('pass') : t('fail')}</dd>

            <dt className="font-medium text-gray-600">{t('outMaj')}</dt>
            <dd>{comment.out_maj}</dd>

            <dt className="font-medium text-gray-600">{t('inMaj')}</dt>
            <dd>{comment.in_maj}</dd>
          </dl>

          {comment.comment && (
            <div className="mt-4">
              <p className="font-medium text-gray-600 text-sm mb-1">{t('commentLabel')}</p>
              <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
