"use client"
import { useTranslations } from "next-intl";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <p className="text-[var(--color-red)]">{t("errorDescription")}</p>
        <button onClick={reset} className="px-4 py-2 bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded-lg hover:opacity-80 transition-opacity">
          {t("retry")}
        </button>
      </div>
    </div>
  )
}
