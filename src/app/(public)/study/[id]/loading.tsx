export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" />
      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <div className="h-6 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-2" />
          <div className="flex gap-4 mb-3">
            <div className="h-4 w-24 bg-[var(--color-dark-white)] rounded animate-pulse" />
            <div className="h-4 w-24 bg-[var(--color-dark-white)] rounded animate-pulse" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-[var(--color-dark-white)] rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-[var(--color-dark-white)] rounded-full animate-pulse" />
          </div>
          <div className="h-32 w-full bg-[var(--color-dark-white)] rounded animate-pulse mb-6" />
          <div>
            <div className="h-5 w-24 bg-[var(--color-dark-white)] rounded animate-pulse mb-3" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="col-span-2 flex gap-4">
                  <div className="h-4 w-20 bg-[var(--color-dark-white)] rounded animate-pulse" />
                  <div className="h-4 w-32 bg-[var(--color-dark-white)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}