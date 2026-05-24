export default function Loading() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto p-6 bg-[var(--color-white)] rounded-xl shadow-md border border-[var(--color-dark-white)]">
        <div className="h-8 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-8 mx-auto" />
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="h-12 w-full bg-[var(--color-dark-white)] rounded animate-pulse" />
          ))}
          <div className="h-32 w-full bg-[var(--color-dark-white)] rounded animate-pulse" />
          <div className="h-10 w-full bg-[var(--color-dark-white)] rounded animate-pulse mt-8" />
        </div>
      </div>
    </div>
  )
}