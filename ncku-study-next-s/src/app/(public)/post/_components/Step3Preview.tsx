import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

export function Step3Preview() {
  const t = useTranslations("post");
  const { getValues } = useFormContext();
  const values = getValues();
  const isMajor = values.postType === "major";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("preview")}</h2>
        <p className="mt-2 text-muted-foreground">{t("previewDesc")}</p>
      </div>

      <div className="rounded-lg border bg-muted/20 p-6">
        {isMajor ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("category")}</dt>
              <dd className="mt-1">{values.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("department")}</dt>
              <dd className="mt-1">{values.department}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("out_maj")}</dt>
              <dd className="mt-1">{values.out_maj}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("in_maj")}</dt>
              <dd className="mt-1">{values.in_maj}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("year")}</dt>
              <dd className="mt-1">{values.year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("score")}</dt>
              <dd className="mt-1">{values.score}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("rank_1")}</dt>
              <dd className="mt-1">{values.rank_1}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("rank_2")}</dt>
              <dd className="mt-1">{values.rank_2}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("isPass")}</dt>
              <dd className="mt-1">{values.isPass === "true" ? t("pass") : t("fail")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">{t("comment")}</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-md bg-background p-4">{values.comment}</dd>
            </div>
          </dl>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">{t("title")}</dt>
              <dd className="mt-1 text-lg font-semibold">{values.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("year")}</dt>
              <dd className="mt-1">{values.year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t("major")}</dt>
              <dd className="mt-1">{values.major}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">{t("category")}</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {values.studyCategories?.map((cat: string) => (
                  <span key={cat} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {cat}
                  </span>
                ))}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">{t("content")}</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-md bg-background p-4">{values.content}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
