export default function Loading() {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-6"></div>
      
      <div className="mb-8 rounded-xl border border-[var(--color-dark-white)] bg-[var(--color-white)] p-6 shadow-sm">
        <div className="h-6 w-32 bg-[var(--color-dark-white)] rounded animate-pulse mb-4"></div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-16 bg-[var(--color-dark-white)] rounded animate-pulse"></div>
            <div className="h-9 w-full bg-[var(--color-dark-white)] rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 w-16 bg-[var(--color-dark-white)] rounded animate-pulse"></div>
            <div className="h-24 w-full bg-[var(--color-dark-white)] rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-9 w-24 bg-[var(--color-dark-white)] rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-[var(--color-dark-white)] animate-pulse" />
        ))}
      </div>
    </div>
  )
}