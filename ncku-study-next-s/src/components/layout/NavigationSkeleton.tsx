import { MajorPageSkeleton, StudyPageSkeleton } from './PageSkeletons';

function GenericPageSkeleton() {
  return (
    <div className="w-full">
      <div className="h-8 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mb-6" />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="h-10 w-full md:w-32 bg-[var(--color-dark-white)] rounded animate-pulse" />
        <div className="h-10 w-full md:w-32 bg-[var(--color-dark-white)] rounded animate-pulse" />
        <div className="h-10 w-full md:w-32 bg-[var(--color-dark-white)] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-[220px] h-[180px] animate-pulse bg-[var(--color-dark-white)] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function NavigationSkeleton({ pathname }: { pathname: string }) {
  if (pathname === '/' || /^\/(?:admin\/)?major(?:\/|$)/.test(pathname)) {
    return <MajorPageSkeleton />;
  }

  if (/^\/(?:admin\/)?study(?:\/|$)/.test(pathname)) {
    return <StudyPageSkeleton />;
  }

  return <GenericPageSkeleton />;
}
