"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

const categoryColors: Record<string, { color: string; backgroundColor: string }> = {
  transfer: { color: "rgba(225, 175, 19, 1)", backgroundColor: "rgba(254, 218, 106, 0.4)" },
  minor: { color: "rgba(29, 30, 34, 1)", backgroundColor: "rgba(29, 30, 34, 0.2)" },
  double: { color: "#FFFFFF", backgroundColor: "#393F4D" },
};

export function Step3Preview() {
  const { getValues } = useFormContext();
  const t = useTranslations("post");
  const values = getValues();
  const isMajor = values.postType === "major";

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
      { type: t("year"), value: String(values.year ?? "") },
      { type: t("rankUpper"), value: String(values.rank_1 ?? "") },
      { type: t("rankLower"), value: String(values.rank_2 ?? "") },
      { type: t("academicScore"), value: String(values.score ?? "") },
      { type: t("applicationResult"), value: isPass ? t("yes") : t("no") },
    ];

    return (
      <div className="relative grid h-[700px] w-[600px] grid-cols-[50px_auto_50px] grid-rows-[100%] bg-white p-[5px] text-black">
        <div className="invisible" />
        <div className="flex w-full flex-col overflow-y-auto px-[5px] py-[20px]">
          <div className="flex items-center">
            <div
              className="m-0 flex h-[42px] w-[42px] scale-110 items-center justify-center rounded-[42px] font-semibold"
              style={{ backgroundColor: typeColors.backgroundColor, color: typeColors.color }}
            >
              {category[0]}
            </div>
            <div className="ml-[10px] flex-1">
              <h4 className="m-0 mb-[5px] text-[1.9rem]">{values.in_maj ?? ""}</h4>
              <p className="m-0 text-[1.3rem] text-[rgba(163,158,158,1)]">{values.out_maj ?? ""}</p>
            </div>
          </div>
          <div className="my-[20px] flex flex-wrap">
            {details.map((detail) => (
              <div key={detail.type} className="h-[50px] min-w-[75px] bg-white p-[5px]">
                <div className="text-[1.4rem]">{detail.type}</div>
                <div className="text-[1.7rem] font-bold">{detail.value}</div>
              </div>
            ))}
          </div>
          <div className="overflow-y-auto whitespace-pre-line text-justify text-[17px] leading-[2.8rem] tracking-[2.5px]" style={{ wordBreak: "break-all" }}>
            {values.comment ?? ""}
          </div>
        </div>
        <div className="invisible" />
      </div>
    );
  }

  const title = String(values.title ?? "");
  const year = String(values.year ?? "");
  const major = String(values.major ?? "");
  const content = String(values.content ?? "");
  const selectedStatistics = (values.studyCategories ?? []) as string[];
  const statistics = (values.statistics ?? {}) as Record<string, string | number>;
  const now = new Date();
  // Match Vite's DataMapping.dateSpawner, which uses zero-based getMonth().
  const postDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const details = [
    { name: t("originalMajor"), value: major },
    { name: t("year"), value: year },
    ...selectedStatistics.map((name) => ({ name, value: String(statistics[name] ?? "") })),
  ];

  return (
    <div className="grid h-[90vh] w-[600px] grid-cols-[50px_auto_50px] bg-white text-black">
      <div />
      <div className="relative col-start-2 flex flex-col py-[25px]">
        <div className="inline-flex" />
        <h4 className="mt-[15px] text-[18px]">{title}</h4>
        <span className="text-[16px] text-[#8c8c8c]">{postDate}</span>
        <div className="my-[10px] inline-flex h-[50px]">
          {details.map((detail) => (
            <div key={detail.name} className="mr-[10px] grid h-[50px] min-w-[75px] grid-rows-[12px_auto]">
              <div className="text-[12px]">{detail.name}</div>
              <div className="text-[24px]">{detail.value}</div>
            </div>
          ))}
        </div>
        <div className="my-[5px] h-full overflow-y-auto whitespace-pre-line text-justify text-[15px] leading-[2.8rem] tracking-[2.5px]">
          {content}
        </div>
      </div>
      <div />
    </div>
  );
}
