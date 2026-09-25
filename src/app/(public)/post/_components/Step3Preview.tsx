"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

const categoryColors: Record<string, { color: string; backgroundColor: string }> = {
  transfer: { color: "var(--color-dark-yellow)", backgroundColor: "var(--color-background-yellow)" },
  minor: { color: "var(--color-dark-black)", backgroundColor: "var(--color-minor-surface)" },
  double: { color: "var(--color-white)", backgroundColor: "var(--color-light-black)" },
};

export function Step3Preview() {
  const { getValues } = useFormContext();
  const t = useTranslations("post");
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const values = getValues();
  const isMajor = values.postType === "major";
  const isCompactMajor = viewportWidth > 0 && viewportWidth <= 1024;
  const isCompactStudy = viewportWidth > 0 && viewportWidth <= 992;

  if (isMajor) {
    const categoryLabels = {
      transfer: t("categoryTransfer"),
      minor: t("categoryMinor"),
      double: t("categoryDouble"),
    };
    const category = String(values.category ?? categoryLabels.transfer);
    const categoryKey = Object.entries(categoryLabels).find(([, label]) => label === category)?.[0] ?? "transfer";
    const typeColors = categoryColors[categoryKey];
    const isPass = values.isPass === "true";
    const details = [
      { type: t("applicationYear"), value: String(values.year ?? "") },
      { type: t("rankUpper"), value: String(values.rank_1 ?? "") },
      { type: t("rankLower"), value: String(values.rank_2 ?? "") },
      { type: t("academicScore"), value: String(values.score ?? "") },
      { type: t("applicationResult"), value: isPass ? t("pass") : t("fail") },
    ];

    return (
      <div
        className="relative flex w-full bg-white text-card-text"
        style={{ width: isCompactMajor ? "95vw" : "600px", height: isCompactMajor ? "500px" : "700px", padding: "5px" }}
      >
        <div className="invisible shrink-0" style={{ width: "50px" }} />
        <div
          className="flex min-w-0 flex-1 flex-col overflow-y-auto"
          style={{ padding: "20px 5px" }}
        >
          <div className="flex items-center">
            <div
              className="m-0 flex scale-110 items-center justify-center rounded-full font-semibold"
              style={{ width: "42px", height: "42px", margin: "10px 0", borderRadius: "42px", backgroundColor: typeColors.backgroundColor, color: typeColors.color }}
            >
              {category[0]}
            </div>
            <div className="min-w-0 flex-1" style={{ marginLeft: "10px" }}>
              <h4 className="m-0 text-[1.9rem]" style={{ marginBottom: "5px" }}>{values.in_maj ?? ""}</h4>
              <p className="m-0 text-[1.3rem] text-card-text">{values.out_maj ?? ""}</p>
            </div>
          </div>
          <div className="flex flex-wrap" style={{ margin: "20px 0" }}>
            {details.map((detail) => (
              <div key={detail.type} className="bg-white" style={{ height: "50px", minWidth: "75px", padding: "5px" }}>
                <div className="text-[1.4rem]">{detail.type}</div>
                <div className="text-[1.7rem] font-bold">{detail.value}</div>
              </div>
            ))}
          </div>
          <div
            className="overflow-y-auto whitespace-pre-line text-justify text-[17px]"
            style={{ wordBreak: "break-all", lineHeight: "28px", letterSpacing: "2.5px" }}
          >
            {values.comment ?? ""}
          </div>
        </div>
        <div className="invisible shrink-0" style={{ width: "50px" }} />
      </div>
    );
  }

  const title = String(values.title ?? "");
  const year = String(values.year ?? "");
  const major = String(values.major ?? "");
  const content = String(values.content ?? "");
  const selectedStatistics = (values.studyCategories ?? []) as string[];
  const statistics = (values.statistics ?? {}) as Record<string, string | number>;
  const otherStatistics = (values.otherStat ?? []) as Array<{ name?: string; value?: string | number }>;
  const now = new Date();
  // Match Vite's DataMapping.dateSpawner, which uses zero-based getMonth().
  const postDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const details = [
    { key: "major", name: t("originalMajor"), value: major },
    { key: "year", name: t("year"), value: year },
    ...selectedStatistics.map((name, index) => ({ key: `statistic-${index}`, name, value: String(statistics[name] ?? "") })),
    ...otherStatistics
      .filter((statistic) => statistic.name)
      .map((statistic, index) => ({ key: `other-statistic-${index}`, name: String(statistic.name), value: String(statistic.value ?? "") })),
  ];

  return (
    <div
      className={`flex bg-white text-card-text ${isCompactStudy ? "w-full" : "w-240"}`}
      style={{ width: isCompactStudy ? "95vw" : undefined, height: isCompactStudy ? "65vh" : "90vh" }}
    >
      <div className="w-20 shrink-0" />
      <div className="relative flex min-w-0 flex-1 flex-col py-10">
        <div className="inline-flex" />
        <h4 className="mt-6 text-[18px]">{title}</h4>
        <span className="text-[16px] text-muted-text">{postDate}</span>
        <div className="my-4 inline-flex h-20">
          {details.map((detail) => (
            <div key={detail.key} className="mr-4 flex h-20 min-w-30 flex-col">
              <div className="h-4.8 text-[12px]">{detail.name}</div>
              <div className="text-[24px]">{detail.value}</div>
            </div>
          ))}
        </div>
        <div className="my-2 h-full overflow-y-auto whitespace-pre-line text-justify text-[15px]" style={{ lineHeight: "28px", letterSpacing: "2.5px" }}>
          {content}
        </div>
      </div>
      <div className="w-20 shrink-0" />
    </div>
  );
}
