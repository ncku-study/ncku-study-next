export default function Loading() {
  return (
    <main className="w-full h-full min-h-[calc(100vh-64px)] flex justify-center items-center">
      <div className="w-[350px] py-[25px]">
        <div className="inline-block text-center w-full">
          <div className="flex justify-center mb-2">
            <div className="w-[100px] h-[100px] bg-[var(--color-dark-white)] rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-48 bg-[var(--color-dark-white)] rounded animate-pulse mx-auto mt-[10px] mb-[20px]" />
        </div>
        <div className="mt-4">
          <div className="h-[40px] mb-[15px] border-b-2 border-[var(--color-light-gray)] pb-2 flex items-center">
            <div className="w-[23px] h-[23px] bg-[var(--color-dark-white)] rounded-full animate-pulse mr-3" />
            <div className="h-6 w-full bg-[var(--color-dark-white)] rounded animate-pulse" />
          </div>
          <div className="h-[40px] mb-[15px] border-b-2 border-[var(--color-light-gray)] pb-2 mt-8 flex items-center">
            <div className="w-[23px] h-[23px] bg-[var(--color-dark-white)] rounded-full animate-pulse mr-3" />
            <div className="h-6 w-full bg-[var(--color-dark-white)] rounded animate-pulse" />
          </div>
          <div className="w-full h-[40px] mt-[30px] rounded bg-[var(--color-dark-white)] animate-pulse" />
        </div>
      </div>
    </main>
  );
}