import { Major as MajorLogo } from '@/components/logos';

const skeletonClass = 'bg-dark-white animate-pulse';

export const MAJOR_CARDS_CONTAINER_CLASS = 'flex flex-1 min-h-0 min-w-0 flex-wrap justify-start items-start bg-white w-full h-full rounded-lg overflow-x-hidden overflow-y-auto will-change-transform max-sm:gap-0 gap-4 custom-scrollbar';

function MajorFilterSkeleton() {
  return (
    <div className="relative top-0.5 flex items-center w-fit mr-3 max-sm:scale-90">
      <div className={`h-7 w-17 rounded ${skeletonClass}`} />
      <div className="relative mx-4 min-w-48">
        <div className={`h-16 w-48 rounded ${skeletonClass}`} />
      </div>
    </div>
  );
}

function MajorStatisticsSkeleton() {
  return (
    <div className="h-64 flex gap-8 py-4 max-sm:h-64">
      <div className="bg-white w-160 h-full rounded-lg flex-none flex items-center justify-evenly max-sm:w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative w-46 flex items-center flex-col">
            <div className={`w-28 h-28 rounded-full ${skeletonClass}`} />
            <div className={`w-28 h-6 rounded mt-2 ${skeletonClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MajorCardSkeleton() {
  return (
    <div className="relative p-2 rounded-2xl h-72 w-88 box-border bg-white max-sm:w-full max-sm:rounded-none max-sm:h-58">
      <div className="grid box-border w-84 h-64 px-4 pt-2 pb-0 max-sm:w-full max-sm:h-50" style={{ gridTemplateColumns: '57px auto', gridTemplateRows: 'auto 30px', gridTemplateAreas: '"icon main" "year tags"' }}>
        <div className={`w-16 h-16 scale-105 translate-y-0.5 rounded-full my-4 mx-auto ${skeletonClass}`} style={{ gridArea: 'icon' }} />
        <div className="grid" style={{ gridTemplateRows: '35px 25px auto', gridArea: 'main' }}>
          <div className={`w-24 h-5 rounded mt-4 mb-4 ${skeletonClass}`} />
          <div className={`w-20 h-6 rounded ${skeletonClass}`} />
          <div className="mt-0 flex flex-col gap-2 pt-0.5">
            <div className={`w-full h-3 rounded ${skeletonClass}`} />
            <div className={`w-10/12 h-3 rounded ${skeletonClass}`} />
          </div>
        </div>
        <div className={`w-8.5 h-3.5 rounded ${skeletonClass}`} style={{ gridArea: 'year' }} />
        <div className="flex items-center" style={{ gridArea: 'tags' }}>
          <div className={`w-18.5 h-3.5 rounded ${skeletonClass}`} />
        </div>
      </div>
    </div>
  );
}

export function MajorCardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={MAJOR_CARDS_CONTAINER_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <MajorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MajorPageSkeleton() {
  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden max-sm:-mx-4">
      <section className="flex h-20 max-lg:h-40 max-sm:h-36 flex-wrap max-sm:justify-center w-full items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <MajorFilterSkeleton key={i} />
        ))}
      </section>
      <div className="h-64 max-lg:h-0 overflow-hidden"><MajorStatisticsSkeleton /></div>
      <MajorCardsSkeleton />
    </main>
  );
}

function StudyFilterSkeleton() {
  return (
    <section className="flex items-center flex-wrap px-2 w-fit h-20 mb-4 row-start-1 col-start-1 col-end-2">
      <div className="relative m-3 min-w-48">
        <div className={`w-full h-15.2 rounded ${skeletonClass}`} />
      </div>
    </section>
  );
}

export function StudyCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-0 w-236 max-sm:w-auto max-sm:ml-4 max-sm:mr-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative h-64 border-b border-card-border box-border bg-white">
          <div className="w-full h-35 mt-8 relative">
            <div className="inline-flex gap-2">
              <div className={`w-25 h-9 rounded-full ${skeletonClass}`} />
              <div className={`w-22 h-9 rounded-full ${skeletonClass}`} />
            </div>
            <div className={`w-72 h-9 rounded mt-5 mb-2 ${skeletonClass}`} />
            <div className="flex flex-col gap-2">
              <div className={`w-full h-5 rounded ${skeletonClass}`} />
              <div className={`w-9/12 h-5 rounded ${skeletonClass}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className={`w-16.8 h-5.6 rounded ${skeletonClass}`} />
            <div className={`w-30.4 h-5.6 rounded ${skeletonClass}`} />
            <div className={`w-25.6 h-5.6 rounded ${skeletonClass}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudyPageSkeleton() {
  return (
    <div className="grid grid-cols-1 overflow-y-hidden" style={{ gridTemplateRows: '50px auto' }}>
      <StudyFilterSkeleton />
      <section className="col-start-1 col-end-2 row-start-2 row-end-3 max-sm:overflow-y-auto">
        <StudyCardsSkeleton />
      </section>
    </div>
  );
}

function PostFormSkeleton() {
  return (
    <div className="mx-auto w-[458px] rounded-[5px] bg-white mb-[20px] max-[870px]:w-[80%]">
      <div className="flex flex-col items-center py-[25px]">
        <div className={`h-[18px] w-[220px] rounded ${skeletonClass} mb-[74px]`} />
        <MajorLogo className="h-[105px] w-[86px] text-[var(--color-dark-white)] animate-pulse mb-[54px]" />
        <div className={`h-[42px] w-[316px] rounded ${skeletonClass} mb-[20px] max-[368px]:w-full`} />
        <div className="flex items-center justify-center gap-[10px] mb-[29px]">
          <div className={`h-[6px] w-[32px] ${skeletonClass}`} />
          <div className={`h-[6px] w-[32px] ${skeletonClass}`} />
        </div>
        <div className="flex items-center justify-center gap-[50px] mb-[26px] max-sm:gap-[20px]">
          <div className={`h-[36px] w-[128px] rounded-[50px] ${skeletonClass} max-sm:w-[170px]`} />
          <div className={`h-[36px] w-[128px] rounded-[50px] ${skeletonClass} max-sm:w-[170px]`} />
        </div>
      </div>
      <div className="flex h-[75px] w-full items-center justify-end px-[20px]">
        <div className={`h-[40px] w-[100px] rounded-[5px] ${skeletonClass}`} />
      </div>
    </div>
  );
}

export function PostPageSkeleton() {
  return (
    <div className="pb-[25px]">
      <div className="mx-auto w-full max-w-[650px]">
        <div className="h-[130px]" />
        <PostFormSkeleton />
      </div>
    </div>
  );
}
