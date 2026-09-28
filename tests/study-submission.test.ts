import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeStudySubmission } from '../src/lib/study-submission';

test('normalizes the study form payload into the database DTO shape', () => {
  const result = normalizeStudySubmission({
    postType: 'study',
    category: '轉系',
    title: '測試心得',
    content: '測試內容',
    major: '光電系',
    year: 114,
    studyCategories: ['TOEIC', 'JLPT'],
    statistics: { TOEIC: '850', JLPT: 'N3' },
    otherStat: [{ name: 'GPA', value: '4.0' }],
  });

  assert.deepEqual(result.category, []);
  assert.deepEqual(result.statistic, [
    { name: 'TOEIC', value: '850' },
    { name: 'JLPT', value: 'N3' },
  ]);
  assert.deepEqual(result.otherStat, [{ name: 'GPA', value: '4.0' }]);
  assert.equal(result.confirm, 'false');
});

test('accepts the legacy normalized statistic and category arrays', () => {
  const result = normalizeStudySubmission({
    title: '測試心得',
    content: '測試內容',
    major: '光電系',
    year: '114',
    category: [{ id: 'category-1', name: '海外交換' }],
    statistic: [{ name: 'TOEIC', value: 850 }],
    otherStatistic: [],
  });

  assert.deepEqual(result.category, [{ id: 'category-1', name: '海外交換' }]);
  assert.deepEqual(result.statistic, [{ name: 'TOEIC', value: 850 }]);
});

test('rejects missing selected statistic values before attempting a database insert', () => {
  assert.throws(
    () => normalizeStudySubmission({
      title: '測試心得',
      content: '測試內容',
      major: '光電系',
      year: 114,
      studyCategories: ['TOEIC'],
      statistics: {},
    }),
    /缺少「TOEIC」的統計資料/,
  );
});
