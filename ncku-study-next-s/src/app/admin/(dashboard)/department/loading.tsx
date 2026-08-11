export default function Loading() {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-6"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-[var(--color-dark-white)] animate-pulse" />
        ))}
      </div>
    </div>
  )
}