export default function ModalSkeleton() {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        {/* Modal shell — matches page.tsx: w-[600px] h-[700px], three-column grid */}
        <div
          className="relative w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white text-black grid grid-cols-[50px_auto_50px] max-lg:w-[360px] max-lg:max-h-[65vh] max-lg:min-w-[95vw]"
          style={{ gridTemplateRows: '100%' }}
        >
          {/* Left arrow column — invisible placeholder */}
          <div className="flex justify-center items-center invisible">
            <div className="border-r-2 border-t-2 border-gray-500 h-[30px] w-[30px] inline-block rotate-[225deg]" />
          </div>

          {/* Content column */}
          <div className="w-full flex flex-col py-[20px] px-[5px]">
            {/* TitleBar skeleton */}
            <div className="flex items-center mb-[10px]">
              <div className="w-[46px] h-[46px] rounded-full bg-[var(--color-dark-white)] animate-pulse shrink-0" />
              <div className="ml-[10px] flex-1 flex flex-col gap-[8px]">
                <div className="h-[20px] w-[140px] bg-[var(--color-dark-white)] rounded animate-pulse" />
                <div className="h-[14px] w-[100px] bg-[var(--color-dark-white)] rounded animate-pulse" />
              </div>
            </div>

            {/* DetailList skeleton — 4 tags */}
            <div className="flex flex-wrap my-[20px] mx-0 gap-[4px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[75px] h-[50px] p-[5px] flex flex-col gap-[6px]">
                  <div className="h-[14px] w-[56px] bg-[var(--color-dark-white)] rounded animate-pulse" />
                  <div className="h-[18px] w-[72px] bg-[var(--color-dark-white)] rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* ReaderText skeleton */}
            <div className="flex flex-col gap-[10px] flex-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[17px] bg-[var(--color-dark-white)] rounded animate-pulse ${i === 9 ? 'w-[60%]' : 'w-full'}`}
                />
              ))}
            </div>
          </div>

          {/* Right arrow column — invisible placeholder */}
          <div className="flex justify-center items-center invisible">
            <div className="border-r-2 border-t-2 border-gray-500 h-[30px] w-[30px] inline-block rotate-45" />
          </div>
        </div>
      </div>
    </>
  );
}
