"use client"
import { useTranslations } from "next-intl";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <main className="w-full h-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center gap-4">
      <p className="text-[var(--color-red)]">{t("errorDescription")}</p>
      <button onClick={reset} className="px-4 py-2 bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded-lg hover:opacity-80 transition-opacity">
        {t("retry")}
      </button>
    </main>
  )
}
