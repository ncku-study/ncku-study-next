export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="w-full">
           <div className="h-10 w-full max-w-2xl bg-[var(--color-dark-white)] rounded animate-pulse mb-6"></div>
           <div className="h-8 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-6"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[160px] rounded-lg bg-[var(--color-dark-white)] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}