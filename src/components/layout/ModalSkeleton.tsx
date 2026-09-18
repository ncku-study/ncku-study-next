export default function ModalSkeleton() {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay">
        {/* Modal shell — matches page.tsx: w-[600px] h-[700px], three-column grid */}
        <div
          className="relative flex w-150 h-175 max-h-3/4 p-1.25 bg-white text-card-text max-lg:w-90 max-lg:max-h-2/3 max-lg:min-w-full"
        >
          {/* Left arrow column — invisible placeholder */}
          <div className="flex justify-center items-center invisible">
            <div className="border-r-2 border-t-2 border-arrow h-7.5 w-7.5 inline-block rotate-45" style={{ transform: 'rotate(225deg)' }} />
          </div>

          {/* Content column */}
          <div className="w-full flex flex-1 flex-col py-5 px-1">
            {/* TitleBar skeleton */}
            <div className="flex items-center mb-2.5">
              <div className="w-11.5 h-11.5 rounded-full bg-dark-white animate-pulse shrink-0" />
              <div className="ml-2.5 flex-1 flex flex-col gap-2">
                <div className="h-5 w-35 bg-dark-white rounded animate-pulse" />
                <div className="h-3.5 w-25 bg-dark-white rounded animate-pulse" />
              </div>
            </div>

            {/* DetailList skeleton — 4 tags */}
            <div className="flex flex-wrap my-5 mx-0 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-18.75 h-12.5 p-1.25 flex flex-col gap-1.5">
                  <div className="h-3.5 w-14 bg-dark-white rounded animate-pulse" />
                  <div className="h-4.5 w-18 bg-dark-white rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* ReaderText skeleton */}
            <div className="flex flex-col gap-2.5 flex-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4.25 bg-dark-white rounded animate-pulse ${i === 9 ? 'w-3/5' : 'w-full'}`}
                />
              ))}
            </div>
          </div>

          {/* Right arrow column — invisible placeholder */}
          <div className="flex justify-center items-center invisible">
            <div className="border-r-2 border-t-2 border-arrow h-7.5 w-7.5 inline-block rotate-45" />
          </div>
        </div>
      </div>
    </>
  );
}
