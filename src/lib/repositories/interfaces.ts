import type {
  CommentDTO,
  StudyDTO,
  DepartmentDTO,
  CollegeDTO,
  CategoryDTO,
  OtherStatisticDTO,
  StatisticManageDTO,
  AnnouncementDTO,
  UserDTO,
} from '@/types/api';

// ─── Filter types ────────────────────────────────────────────────────────────

export type CommentFilters = {
  college?: string;
  department?: string;
  year?: string;
  category?: string;
  confirm?: boolean;
};

export type StudyFilters = {
  category?: string;
  year?: string;
  confirm?: boolean;
};

// ─── Create / Update input types ─────────────────────────────────────────────

export type CreateCommentInput = Omit<CommentDTO, 'id'>;
export type UpdateCommentInput = Partial<Omit<CommentDTO, 'id'>>;

export type CreateStudyInput = Omit<StudyDTO, 'id' | 'timestamp' | 'otherStat'> & {
  timestamp: string;
  otherStat: Array<Pick<OtherStatisticDTO, 'name' | 'value'> & Partial<OtherStatisticDTO>>;
};
export type UpdateStudyInput = Partial<Omit<StudyDTO, 'id'>>;

export type CreateDepartmentInput = Omit<DepartmentDTO, 'id'>;
export type UpdateDepartmentInput = Partial<Omit<DepartmentDTO, 'id'>>;

export type CreateCollegeInput = Omit<CollegeDTO, 'id'>;
export type UpdateCollegeInput = Partial<Omit<CollegeDTO, 'id'>>;

export type CreateCategoryInput = Omit<CategoryDTO, 'id'>;
export type UpdateCategoryInput = Partial<Omit<CategoryDTO, 'id'>>;

export type CreateStatisticInput = Omit<StatisticManageDTO, 'id'>;
export type UpdateStatisticInput = Partial<Omit<StatisticManageDTO, 'id'>>;

export type UpdateAnnouncementInput = Partial<Omit<AnnouncementDTO, 'id'>>;

// ─── Repository interfaces ────────────────────────────────────────────────────

export interface CommentRepository {
  findAll(filters?: CommentFilters): Promise<CommentDTO[]>;
  findById(id: number): Promise<CommentDTO | null>;
  create(data: CreateCommentInput): Promise<CommentDTO>;
  update(id: number, data: UpdateCommentInput): Promise<CommentDTO | null>;
  delete(id: number): Promise<boolean>;
  confirm(id: number): Promise<CommentDTO | null>;
}

export interface StudyRepository {
  findAll(filters?: StudyFilters): Promise<StudyDTO[]>;
  findById(id: string): Promise<StudyDTO | null>;
  create(data: CreateStudyInput): Promise<StudyDTO>;
  update(id: string, data: UpdateStudyInput): Promise<StudyDTO | null>;
  delete(id: string): Promise<boolean>;
  confirm(id: string): Promise<StudyDTO | null>;
}

export interface DepartmentRepository {
  findAll(): Promise<DepartmentDTO[]>;
  create(data: CreateDepartmentInput): Promise<DepartmentDTO>;
  update(id: number, data: UpdateDepartmentInput): Promise<DepartmentDTO | null>;
  delete(id: number): Promise<boolean>;
}

export interface CollegeRepository {
  findAll(): Promise<CollegeDTO[]>;
  create(data: CreateCollegeInput): Promise<CollegeDTO>;
  update(id: number, data: UpdateCollegeInput): Promise<CollegeDTO | null>;
  delete(id: number): Promise<boolean>;
}

export interface CategoryRepository {
  findAll(): Promise<CategoryDTO[]>;
  create(data: CreateCategoryInput): Promise<CategoryDTO>;
  update(id: string, data: UpdateCategoryInput): Promise<CategoryDTO | null>;
  delete(id: string): Promise<boolean>;
}

export interface StatisticRepository {
  findAll(): Promise<StatisticManageDTO[]>;
  create(data: CreateStatisticInput): Promise<StatisticManageDTO>;
  update(id: string, data: UpdateStatisticInput): Promise<StatisticManageDTO | null>;
  delete(id: string): Promise<boolean>;
}

export interface AnnouncementRepository {
  findAll(): Promise<AnnouncementDTO[]>;
  update(id: number, data: UpdateAnnouncementInput): Promise<AnnouncementDTO | null>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<(UserDTO & { password: string }) | null>;
}
