const skeletonClass = 'bg-[var(--color-dark-white)] animate-pulse';

function MajorFilterSkeleton() {
  return (
    <div className="relative top-[1.71875px] flex items-center w-fit mr-[7px] max-sm:scale-90">
      <div className={`h-[18px] w-[42px] rounded ${skeletonClass}`} />
      <div className="relative mx-[10px] min-w-[120px]">
        <div className={`h-[38.8125px] w-[120px] rounded-[4px] ${skeletonClass}`} />
      </div>
    </div>
  );
}

function MajorStatisticsSkeleton() {
  return (
    <div className="h-full grid grid-cols-[400px_auto] gap-x-[20px] py-[10px] max-[576px]:h-[160px] max-[576px]:grid-cols-[1fr_0] max-[576px]:gap-x-0">
      <div className="bg-white w-full h-full rounded-[10px] flex items-center justify-evenly">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative w-[115px] flex items-center flex-col">
            <div className={`w-[70px] h-[70px] rounded-full ${skeletonClass}`} />
            <div className={`w-[70px] h-[14px] rounded mt-[7px] ${skeletonClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MajorCardSkeleton() {
  return (
    <div className="relative border border-black/12.5 p-[5px] rounded-[15px] h-[180px] w-[220px] box-border bg-white max-sm:border-x-0 max-sm:border-t-0 max-sm:w-full max-sm:rounded-none max-sm:h-[145px]">
      <div className="grid box-border grid-cols-[57px_auto] grid-rows-[auto_30px] [grid-template-areas:'icon_main'_'year_tags'] w-[210px] h-[160px] px-[10px] pt-[5px] pb-0 max-sm:w-full max-sm:h-[125px]">
        <div className={`w-[42px] h-[42px] rounded-full my-[10px] mx-auto ${skeletonClass}`} />
        <div className="grid grid-rows-[35px_25px_auto]">
          <div className={`w-[95px] h-[20px] rounded mt-[10px] mb-[10px] ${skeletonClass}`} />
          <div className={`w-[78px] h-[14px] rounded ${skeletonClass}`} />
          <div className="mt-0 flex flex-col gap-[5px] pt-[2px]">
            <div className={`w-full h-[12px] rounded ${skeletonClass}`} />
            <div className={`w-[82%] h-[12px] rounded ${skeletonClass}`} />
          </div>
        </div>
        <div className={`w-[34px] h-[14px] rounded ${skeletonClass}`} />
        <div className="flex items-center">
          <div className={`w-[74px] h-[14px] rounded ${skeletonClass}`} />
        </div>
      </div>
    </div>
  );
}

export function MajorCardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-wrap justify-start items-start bg-white w-full h-full rounded-[10px] overflow-x-hidden overflow-y-auto max-[576px]:gap-0 gap-[10px] [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-track]:bg-transparent">
      {Array.from({ length: count }).map((_, i) => (
        <MajorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MajorPageSkeleton() {
  return (
    <main className="grid h-full min-h-0 min-w-0 grid-rows-[50px_160px_minmax(0,1fr)] overflow-hidden max-[990px]:grid-rows-[100px_160px_minmax(0,1fr)] max-[576px]:grid-rows-[90px_0px_minmax(0,1fr)] max-[576px]:-mx-[10px]">
      <section className="flex flex-wrap max-[576px]:justify-center w-full items-center h-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <MajorFilterSkeleton key={i} />
        ))}
      </section>
      <MajorStatisticsSkeleton />
      <MajorCardsSkeleton />
    </main>
  );
}

function StudyFilterSkeleton() {
  return (
    <section className="flex items-center flex-wrap px-[5px] w-fit h-[50px] mb-[10px] row-start-1 col-start-1 col-end-2">
      <div className="relative m-[8px] min-w-[120px]">
        <div className={`w-full h-[38px] rounded-[4px] ${skeletonClass}`} />
      </div>
    </section>
  );
}

export function StudyCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-0 w-[590px] max-sm:w-auto max-sm:mx-[10px]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative h-[160px] border-b border-black/12.5 box-border bg-white">
          <div className="w-full h-[88px] mt-[20px] relative">
            <div className="inline-flex gap-[5px]">
              <div className={`w-[62px] h-[22px] rounded-[30px] ${skeletonClass}`} />
              <div className={`w-[54px] h-[22px] rounded-[30px] ${skeletonClass}`} />
            </div>
            <div className={`w-[180px] h-[22px] rounded mt-[12px] mb-[6px] ${skeletonClass}`} />
            <div className="flex flex-col gap-[5px]">
              <div className={`w-full h-[13px] rounded ${skeletonClass}`} />
              <div className={`w-[72%] h-[13px] rounded ${skeletonClass}`} />
            </div>
          </div>
          <div className="mt-[10px] flex items-center gap-[15px]">
            <div className={`w-[42px] h-[14px] rounded ${skeletonClass}`} />
            <div className={`w-[76px] h-[14px] rounded ${skeletonClass}`} />
            <div className={`w-[64px] h-[14px] rounded ${skeletonClass}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudyPageSkeleton() {
  return (
    <div className="grid grid-cols-[600px_auto] overflow-y-hidden grid-rows-[50px_auto] max-[576px]:grid-cols-[100vw] max-[576px]:-mx-[10px]">
      <StudyFilterSkeleton />
      <section className="col-start-1 col-end-2 row-start-2 row-end-3 max-[576px]:overflow-y-auto">
        <StudyCardsSkeleton />
      </section>
    </div>
  );
}

