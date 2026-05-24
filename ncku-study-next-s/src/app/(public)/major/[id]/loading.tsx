export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" />
      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <div className="h-6 w-32 bg-[var(--color-dark-white)] rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-span-2 flex gap-4">
                <div className="h-4 w-20 bg-[var(--color-dark-white)] rounded animate-pulse" />
                <div className="h-4 w-32 bg-[var(--color-dark-white)] rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="h-4 w-24 bg-[var(--color-dark-white)] rounded animate-pulse mb-2" />
            <div className="h-24 w-full bg-[var(--color-dark-white)] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </>
  )
}