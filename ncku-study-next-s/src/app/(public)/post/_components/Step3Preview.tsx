import { useFormContext } from "react-hook-form";

const colorMap: Record<string, { color: string; backgroundColor: string }> = {
  "轉系": { color: "rgba(225, 175, 19, 1)", backgroundColor: "rgba(254, 218, 106, 0.4)" },
  "輔系": { color: "rgba(29, 30, 34, 1)", backgroundColor: "rgba(29, 30, 34, 0.2)" },
  "雙主修": { color: "#FFFFFF", backgroundColor: "#393F4D" },
};

export function Step3Preview() {
  const { getValues } = useFormContext();
  const values = getValues();
  const isMajor = values.postType === "major";

  if (isMajor) {
    const category: string = values.category ?? "轉系";
    const inMaj: string = values.in_maj ?? "";
    const outMaj: string = values.out_maj ?? "";
    const year: string | number = values.year ?? "";
    const rank1: string = values.rank_1 ?? "";
    const rank2: string = values.rank_2 ?? "";
    const score: string | number = values.score ?? "";
    const isPass: string = values.isPass;
    const comment: string = values.comment ?? "";

    const typeColors = colorMap[category] ?? colorMap["轉系"];
    const isPassText = isPass === "true" ? "通過" : "未通過";

    const details = [
      { type: "申請年度", value: String(year) },
      { type: "排名上", value: String(rank1) },
      { type: "排名下", value: String(rank2) },
      { type: "學年分數", value: String(score) },
      { type: "申請結果", value: isPassText },
    ];

    return (
      // Match Vite's ReaderLayout: w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white grid grid-cols-[50px_auto_50px]
      <div className="relative w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white text-black grid grid-cols-[50px_auto_50px] grid-rows-[100%]">
        <div className="invisible" />
        {/* ReaderContent */}
        <div className="w-full flex flex-col py-[20px] px-[5px] overflow-y-auto">
          {/* TitleBar */}
          <div className="flex items-center">
            <div
              className="flex justify-center items-center font-semibold w-[42px] h-[42px] rounded-[42px] m-0 scale-110"
              style={{ backgroundColor: typeColors.backgroundColor, color: typeColors.color }}
            >
              {category[0]}
            </div>
            <div className="ml-[10px] flex-1">
              <h4 className="m-0 text-[1.9rem] mb-[5px]">{inMaj}</h4>
              <p className="text-[1.3rem] m-0 text-[rgba(163,158,158,1)]">{outMaj}</p>
            </div>
          </div>
          {/* DetailList */}
          <div className="flex flex-wrap my-[20px]">
            {details.map(({ type, value }) => (
              <div
                key={type}
                className="min-w-[75px] h-[50px] p-[5px] bg-white"
                style={{ color: type === "申請結果" && value === "未通過" ? "rgba(245,88,123,1)" : "black" }}
              >
                <div className="text-[1.4rem]">{type}</div>
                <div className="text-[1.7rem] font-bold">{value}</div>
              </div>
            ))}
          </div>
          {/* ReaderText */}
          <div
            className="leading-[2.8rem] tracking-[2.5px] overflow-y-auto text-justify whitespace-pre-line text-[17px]"
            style={{ wordBreak: "break-all" }}
          >
            {comment}
          </div>
        </div>
        <div className="invisible" />
      </div>
    );
  }

  // Study type — match Vite's Reader for study
  const title: string = values.title ?? "";
  const year: string | number = values.year ?? "";
  const major: string = values.major ?? "";
  const content: string = values.content ?? "";

  return (
    <div className="relative w-[600px] h-[700px] max-h-[75vh] p-[5px] bg-white text-black overflow-y-auto">
      <div className="w-full flex flex-col py-[20px] px-[5px]">
        <div className="flex items-center">
          <div className="ml-[10px] flex-1">
            <h4 className="m-0 text-[1.9rem] mb-[5px]">{title}</h4>
            <p className="text-[1.3rem] m-0 text-[rgba(163,158,158,1)]">{major}</p>
          </div>
        </div>
        <div className="flex flex-wrap my-[20px]">
          <div className="min-w-[75px] h-[50px] p-[5px] bg-white">
            <div className="text-[1.4rem]">申請年度</div>
            <div className="text-[1.7rem] font-bold">{String(year)}</div>
          </div>
        </div>
        <div
          className="leading-[2.8rem] tracking-[2.5px] overflow-y-auto text-justify whitespace-pre-line text-[17px]"
          style={{ wordBreak: "break-all" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
