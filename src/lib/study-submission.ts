import type { CreateStudyInput } from './repositories/interfaces';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new Error(`欄位 ${field} 必須是文字`);
  }
  return value;
}

function normalizeStatistics(body: UnknownRecord): CreateStudyInput['statistic'] {
  if (Array.isArray(body.statistic)) {
    return body.statistic.map((item, index) => {
      if (!isRecord(item) || typeof item.name !== 'string' || !['string', 'number'].includes(typeof item.value)) {
        throw new Error(`第 ${index + 1} 個統計資料格式錯誤`);
      }
      return {
        ...(typeof item.id === 'string' ? { id: item.id } : {}),
        name: item.name,
        value: item.value as string | number,
      };
    });
  }

  const values = isRecord(body.statistics) ? body.statistics : {};
  const selectedNames = Array.isArray(body.studyCategories)
    ? body.studyCategories.map((name) => requireString(name, 'studyCategories'))
    : Object.keys(values);

  return selectedNames.map((name) => {
    const value = values[name];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`缺少「${name}」的統計資料`);
    }
    return { name, value };
  });
}

function normalizeOtherStatistics(value: unknown): CreateStudyInput['otherStat'] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error('其他統計資料格式錯誤');

  return value.map((item, index) => {
    if (!isRecord(item) || typeof item.name !== 'string' || !['string', 'number'].includes(typeof item.value)) {
      throw new Error(`第 ${index + 1} 個其他統計資料格式錯誤`);
    }
    return {
      ...(typeof item.id === 'string' ? { id: item.id } : {}),
      ...(typeof item.study_id === 'string' ? { study_id: item.study_id } : {}),
      name: item.name,
      value: String(item.value),
    };
  });
}

function normalizeCategories(value: unknown): CreateStudyInput['category'] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.name !== 'string') return [];
    return [{ id: item.id, name: item.name }];
  });
}

export function normalizeStudySubmission(value: unknown): CreateStudyInput {
  if (!isRecord(value)) throw new Error('送出的資料格式錯誤');

  const year = Number(value.year);
  if (!Number.isInteger(year)) throw new Error('年份格式錯誤');

  return {
    title: requireString(value.title, 'title'),
    content: requireString(value.content, 'content'),
    year,
    major: requireString(value.major, 'major'),
    timestamp: new Date().toISOString(),
    confirm: 'false',
    category: normalizeCategories(value.category),
    statistic: normalizeStatistics(value),
    otherStat: normalizeOtherStatistics(value.otherStatistic ?? value.otherStat),
  };
}
