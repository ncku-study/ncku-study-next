import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

type NullableTimestamp = string | null;

export interface MajorTable {
  id: Generated<number>;
  category: string;
  rank_1: string;
  rank_2: string;
  year: number;
  score: number;
  isPass: string;
  out_maj: string;
  in_maj: string;
  department: string;
  comment: string;
  confirm: string;
}

export interface StudyTable {
  id: Generated<string>;
  title: string;
  content: string;
  year: number;
  major: string;
  category: string;
  statistic: string;
  otherStat: string;
  created_at: NullableTimestamp;
  updated_at: NullableTimestamp;
  confirm: string;
}

export interface StatisticManageTable {
  id: Generated<string>;
  name: string;
  dataType: string;
  max: number;
  min: number;
}

export interface CategoryManageTable {
  id: Generated<string>;
  name: string;
}

export interface CategoryTable {
  id: string;
  study_id: string;
}

export interface OtherStatisticTable {
  id: Generated<string>;
  name: string;
  value: string;
  study_id: string;
}

export interface AnnouncementTable {
  id: Generated<number>;
  msg: string;
  isShow: string;
  created_at: NullableTimestamp;
  updated_at: NullableTimestamp;
}

export interface CollegeTable {
  id: Generated<number>;
  name: string;
}

export interface DepartmentTable {
  id: Generated<number>;
  name: string;
  college: string;
}

export interface UsersTable {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  remember_token: string | null;
  created_at: NullableTimestamp;
  updated_at: NullableTimestamp;
}

export interface Database {
  major: MajorTable;
  study: StudyTable;
  statistic_manage: StatisticManageTable;
  category_manage: CategoryManageTable;
  category: CategoryTable;
  other_statistic: OtherStatisticTable;
  announcement: AnnouncementTable;
  college: CollegeTable;
  department: DepartmentTable;
  users: UsersTable;
}

export type MajorRow = Selectable<MajorTable>;
export type NewMajorRow = Insertable<MajorTable>;
export type UpdateMajorRow = Updateable<MajorTable>;

export type StudyRow = Selectable<StudyTable>;
export type NewStudyRow = Insertable<StudyTable>;
export type UpdateStudyRow = Updateable<StudyTable>;

export type StatisticManageRow = Selectable<StatisticManageTable>;
export type NewStatisticManageRow = Insertable<StatisticManageTable>;
export type UpdateStatisticManageRow = Updateable<StatisticManageTable>;

export type CategoryManageRow = Selectable<CategoryManageTable>;
export type NewCategoryManageRow = Insertable<CategoryManageTable>;
export type UpdateCategoryManageRow = Updateable<CategoryManageTable>;

export type CategoryRow = Selectable<CategoryTable>;
export type NewCategoryRow = Insertable<CategoryTable>;
export type UpdateCategoryRow = Updateable<CategoryTable>;

export type OtherStatisticRow = Selectable<OtherStatisticTable>;
export type NewOtherStatisticRow = Insertable<OtherStatisticTable>;
export type UpdateOtherStatisticRow = Updateable<OtherStatisticTable>;

export type AnnouncementRow = Selectable<AnnouncementTable>;
export type NewAnnouncementRow = Insertable<AnnouncementTable>;
export type UpdateAnnouncementRow = Updateable<AnnouncementTable>;

export type CollegeRow = Selectable<CollegeTable>;
export type NewCollegeRow = Insertable<CollegeTable>;
export type UpdateCollegeRow = Updateable<CollegeTable>;

export type DepartmentRow = Selectable<DepartmentTable>;
export type NewDepartmentRow = Insertable<DepartmentTable>;
export type UpdateDepartmentRow = Updateable<DepartmentTable>;

export type UsersRow = Selectable<UsersTable>;
export type NewUsersRow = Insertable<UsersTable>;
export type UpdateUsersRow = Updateable<UsersTable>;
