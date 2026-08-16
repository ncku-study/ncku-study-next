import type {
  CommentRepository,
  StudyRepository,
  DepartmentRepository,
  CollegeRepository,
  CategoryRepository,
  StatisticRepository,
  AnnouncementRepository,
  UserRepository,
} from './interfaces';

export async function getCommentRepository(): Promise<CommentRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockCommentRepository } = await import('./mock/comments');
    return new MockCommentRepository();
  } else {
    const { DbCommentRepository } = await import('./db/comments');
    return new DbCommentRepository();
  }
}

export async function getStudyRepository(): Promise<StudyRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockStudyRepository } = await import('./mock/studies');
    return new MockStudyRepository();
  } else {
    const { DbStudyRepository } = await import('./db/studies');
    return new DbStudyRepository();
  }
}

export async function getDepartmentRepository(): Promise<DepartmentRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockDepartmentRepository } = await import('./mock/departments');
    return new MockDepartmentRepository();
  } else {
    const { DbDepartmentRepository } = await import('./db/departments');
    return new DbDepartmentRepository();
  }
}

export async function getCollegeRepository(): Promise<CollegeRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockCollegeRepository } = await import('./mock/colleges');
    return new MockCollegeRepository();
  } else {
    const { DbCollegeRepository } = await import('./db/colleges');
    return new DbCollegeRepository();
  }
}

export async function getCategoryRepository(): Promise<CategoryRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockCategoryRepository } = await import('./mock/categories');
    return new MockCategoryRepository();
  } else {
    const { DbCategoryRepository } = await import('./db/categories');
    return new DbCategoryRepository();
  }
}

export async function getStatisticRepository(): Promise<StatisticRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockStatisticRepository } = await import('./mock/statistics');
    return new MockStatisticRepository();
  } else {
    const { DbStatisticRepository } = await import('./db/statistics');
    return new DbStatisticRepository();
  }
}

export async function getAnnouncementRepository(): Promise<AnnouncementRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockAnnouncementRepository } = await import('./mock/announcements');
    return new MockAnnouncementRepository();
  } else {
    const { DbAnnouncementRepository } = await import('./db/announcements');
    return new DbAnnouncementRepository();
  }
}

export async function getUserRepository(): Promise<UserRepository> {
  if (process.env.USE_MOCK === 'true') {
    const { MockUserRepository } = await import('./mock/users');
    return new MockUserRepository();
  } else {
    const { DbUserRepository } = await import('./db/users');
    return new DbUserRepository();
  }
}
