"use client"
import { useTranslations } from "next-intl";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center min-h-50 gap-4">
        <p className="text-red">{t("errorDescription")}</p>
      <button onClick={reset} className="px-4 py-2 bg-yellow text-light-black rounded-lg hover:opacity-80 transition-opacity">
        {t("retry")}
      </button>
    </div>
  )
}
