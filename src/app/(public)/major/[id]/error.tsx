"use client"
import { useTranslations } from "next-intl";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" />
      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col items-center gap-4">
          <p className="text-[var(--color-red)]">{t("errorDescription")}</p>
          <button onClick={reset} className="px-4 py-2 bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded-lg hover:opacity-80 transition-opacity">
            {t("retry")}
          </button>
        </div>
      </div>
    </>
  )
}
