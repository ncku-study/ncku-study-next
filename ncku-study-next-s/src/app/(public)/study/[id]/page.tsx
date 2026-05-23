import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getStudyRepository } from '@/lib/repositories';
import { StudyList } from '@/components/study/StudyList';
import type { StudyDTO } from '@/types/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudyDetailPage({ params }: Props) {
  const { id } = await params;
  const repo = await getStudyRepository();
  const study: StudyDTO | null = await repo.findById(id);

  if (!study) {
    notFound();
  }

  const t = await getTranslations('study');

  // Normalize category ??may be JSON string or array
  const categories: Array<{ id: string; name: string }> = Array.isArray(study.category)
    ? study.category
    : typeof study.category === 'string'
    ? (() => { try { return JSON.parse(study.category as unknown as string); } catch { return []; } })()
    : [];

  // Normalize statistic ??may be JSON string or array
  const statistics: Array<{ id?: string; name?: string; value?: string | number }> = Array.isArray(study.statistic)
    ? study.statistic
    : typeof study.statistic === 'string'
    ? (() => { try { return JSON.parse(study.statistic as unknown as string); } catch { return []; } })()
    : [];

  // Normalize otherStat
  const otherStats: Array<{ id: string; name: string; value: string; study_id: string }> = Array.isArray(study.otherStat)
    ? study.otherStat
    : typeof study.otherStat === 'string'
    ? (() => { try { return JSON.parse(study.otherStat as unknown as string); } catch { return []; } })()
    : [];

  return (
    <>
      {/* Background: blurred StudyList */}
      <div className="fixed inset-0 overflow-auto blur-sm brightness-75 pointer-events-none select-none">
        <StudyList />
      </div>

      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/40 z-10" />

      {/* Modal */}
      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          {/* Close button */}
          <Link
            href="/study"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            aria-label={t('close')}
          >
            ?
          </Link>

          {/* Title */}
          <h2 className="text-xl font-bold mb-2 pr-8">{study.title}</h2>

          {/* Meta: year + major */}
          <div className="flex gap-4 text-sm text-gray-500 mb-3">
            <span>{t('year')}: {study.year}</span>
            <span>{t('major')}: {study.major}</span>
          </div>

          {/* Category badges */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-[30px]"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <p className="text-sm whitespace-pre-wrap mb-6">{study.content}</p>

          {/* Statistics section */}
          {(statistics.length > 0 || otherStats.length > 0) && (
            <div>
              <h3 className="text-base font-semibold mb-3">{t('statistics')}</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {statistics.map((stat, idx) => (
                  stat.name != null && stat.value != null ? (
                    <>
                      <dt key={`stat-label-${idx}`} className="font-medium text-gray-600">{stat.name}</dt>
                      <dd key={`stat-value-${idx}`}>{stat.value}</dd>
                    </>
                  ) : null
                ))}
                {otherStats.map((stat) => (
                  <>
                    <dt key={`other-label-${stat.id}`} className="font-medium text-gray-600">{stat.name}</dt>
                    <dd key={`other-value-${stat.id}`}>{stat.value}</dd>
                  </>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
