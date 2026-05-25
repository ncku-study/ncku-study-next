import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudyRepository } from '@/lib/repositories';
import { StudyList } from '@/components/study/StudyList';
import type { StudyDTO } from '@/types/api';

interface Props {
  params: Promise<{ id: string }>;
}

function formatTimestamp(timestamp: string): string {
  const match = /\d{4}-\d{2}-\d{2}/.exec(timestamp);
  return match ? match[0] : timestamp;
}

export default async function StudyDetailPage({ params }: Props) {
  const { id } = await params;
  const repo = await getStudyRepository();
  const [study, allStudies] = await Promise.all([
    repo.findById(id),
    repo.findAll(),
  ]);

  if (!study) {
    notFound();
  }

  const currentIndex = allStudies.findIndex((s) => s.id === id);
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

  // Normalize category — may be JSON string or array
  const categories: Array<{ id: string; name: string }> = Array.isArray(study.category)
    ? study.category
    : typeof study.category === 'string'
    ? (() => { try { return JSON.parse(study.category as unknown as string); } catch { return []; } })()
    : [];

  // Normalize statistic — may be JSON string or array
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

  const allStats = [
    ...statistics.filter((s) => s.name != null && s.value != null).map((s) => ({
      name: s.name!,
      value: String(s.value!),
      isOther: false,
    })),
    ...otherStats.map((s) => ({ name: s.name, value: s.value, isOther: true })),
  ];

  const postTime = `${study.year}（發文時間：${formatTimestamp(study.timestamp)}）`;

  return (
    <>
      {/* Background: StudyList positioned to match NavLayout structure
           NavLayout: sidebar=110px, px-30px, py-20px, header=50px
           → StudyList starts at viewport x=140 (110+30), y=70 (20+50) */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="ml-[140px] mt-[70px]">
          <StudyList />
        </div>
      </div>

      {/* Backdrop — matches Vite Dialog.Backdrop: fixed inset-0 z-50 bg-black/50 */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Modal — matches Vite Dialog.Popup: fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 */}
      <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none">
        {/* StudyReaderLayout: grid grid-cols-[50px_auto_50px] w-[600px] h-[90vh] bg-white */}
        {/* grid-template-rows:100% constrains the single row to exactly h-[90vh], matching Vite's gridTemplateRows:'100%' */}
        <div className="grid grid-cols-[50px_auto_50px] w-[600px] h-[90vh] bg-white" style={{ gridTemplateRows: '100%' }}>

          {/* Left chevron — navigate to previous study */}
          {prevStudy ? (
            <Link
              href={`/study/${prevStudy.id}`}
              className="border-0 cursor-pointer bg-white h-full flex items-center justify-center"
              aria-label="previous"
            >
              <svg className="w-[35px] h-[35px]" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </Link>
          ) : (
            <div className="bg-white" />
          )}

          {/* StudyReaderContent: col-start-2 flex flex-col relative py-[25px] */}
          <div className="flex flex-col relative col-start-2 py-[25px]">

            {/* CategoryBlock / BadgeList */}
            <div className="inline-flex">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="flex items-center px-[10px] py-[3px] bg-[rgba(254,218,106,0.4)] text-[#E1AF13] text-[14px] select-none rounded-[30px] mr-[10px]"
                >
                  {cat.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h4 className="text-[18px] mt-[15px]">{study.title}</h4>

            {/* Metadata: year（發文時間：YYYY-MM-DD） */}
            <span className="text-[16px] text-[#8c8c8c]">{postTime}</span>

            {/* StatisticBlock — always rendered to match Vite's StatisticContainer h-[50px] my-[10px] spacing */}
            <div className="inline-flex my-[10px] h-[50px]">
              {allStats.map((stat, idx) => (
                <div key={idx} className="grid grid-rows-[12px_auto] h-[50px] min-w-[75px] mr-[10px]">
                  <div className="text-[12px]">{stat.isOther ? `其他: ${stat.name}` : stat.name}</div>
                  <div className="text-[24px]">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* StudyReaderContext: article text */}
            <div className="h-full my-[5px] text-justify leading-[2.8rem] tracking-[2.5px] overflow-y-auto [overflow-wrap:anywhere] whitespace-pre-line custom-scrollbar">
              {study.content}
            </div>
          </div>

          {/* Right chevron — navigate to next study */}
          {nextStudy ? (
            <Link
              href={`/study/${nextStudy.id}`}
              className="border-0 cursor-pointer bg-white h-full flex items-center justify-center"
              aria-label="next"
            >
              <svg className="w-[35px] h-[35px]" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>
          ) : (
            <div className="bg-white" />
          )}

        </div>
      </div>
    </>
  );
}
