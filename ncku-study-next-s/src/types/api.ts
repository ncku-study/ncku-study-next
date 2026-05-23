export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page?: number;
};

export type CategoryDTO = {
  id: string;
  name: string;
};

export type StatisticManageDTO = {
  id: string;
  name: string;
  dataType: string;
  max: number;
  min: number;
};

export type OtherStatisticDTO = {
  id: string;
  name: string;
  value: string;
  study_id: string;
};

export type StudyDTO = {
  id: string;
  title: string;
  content: string;
  year: number;
  major: string;
  timestamp: string;
  confirm: string;
  category: CategoryDTO[];
  statistic: Array<{
    id?: string;
    name?: string;
    value?: string | number;
  }>;
  otherStat: OtherStatisticDTO[];
};

export type CommentDTO = {
  id: number;
  category: string;
  rank_1: string;
  rank_2: string;
  year: number;
  score: number | string;
  out_maj: string;
  in_maj: string;
  department: string;
  comment: string;
  confirm: string;
  isPass: string;
};

export type UserDTO = {
  id: number;
  name: string;
  email: string;
};

export type DepartmentDTO = {
  id: number;
  name: string;
  college: string;
};

export type CollegeDTO = {
  id: number;
  name: string;
};

export type AnnouncementDTO = {
  id: number;
  msg: string;
  isShow: string;
  created_at: string | null;
  updated_at: string | null;
};
