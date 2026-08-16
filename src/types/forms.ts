export type PostMajorFormValues = {
  category: string;
  rank_1: string;
  rank_2: string;
  year: number | string;
  score: number | string;
  isPass: string;
  out_maj: string;
  in_maj: string;
  department: string;
  comment: string;
};

export type PostStudyFormValues = {
  title: string;
  content: string;
  year: number | string;
  major: string;
  category: Array<{ id: string; name?: string }>;
  statistic: Array<{
    id?: string;
    name?: string;
    value: string | number;
  }>;
  otherStat: Array<{
    name: string;
    value: string;
  }>;
};

export type AdminEditMajorValues = PostMajorFormValues & {
  id: number;
  confirm: string;
};

export type AdminEditStudyValues = PostStudyFormValues & {
  id: string;
  confirm: string;
};
