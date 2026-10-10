import { NextRequest, NextResponse } from 'next/server';
import { getCollegeRepository, getDepartmentRepository } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyzPURbajvYo7w25mJAEWOKypzvnKaHZP3R9zyc2fOBOa1XJLY4zyvhRHtEh2yhf2oK/exec';
const TTL_MS = 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

type CacheEntry = { passRate: number | null; fetchedAt: number };
type CacheState = {
  cache: Map<string, CacheEntry>;
  pending: Map<string, Promise<CacheEntry>>;
  timer?: NodeJS.Timeout;
  refreshing: boolean;
  nextCombination: number;
};

// Keep the single-process cache and timer across Next.js development reloads.
const globalCache = globalThis as typeof globalThis & { passRateCacheState?: CacheState };
const state: CacheState = globalCache.passRateCacheState ??= {
  cache: new Map(),
  pending: new Map(),
  refreshing: false,
  nextCombination: 0,
};

function cacheKey(major: string, year: string) {
  return JSON.stringify([major, year]);
}

async function fetchPassRate(major: string, year: string): Promise<CacheEntry> {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    body: new URLSearchParams({ major, year }).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`GAS returned ${response.status}`);

  const result: unknown = await response.json();
  if (typeof result !== 'object' || result === null || !('passRate' in result)) {
    throw new Error('GAS response has no passRate');
  }
  const rawValue = result.passRate;
  const passRate = rawValue === null || rawValue === '' ? null : Number(rawValue);
  if (passRate !== null && !Number.isFinite(passRate)) {
    throw new Error('GAS response has an invalid passRate');
  }
  return { passRate, fetchedAt: Date.now() };
}

function refresh(major: string, year: string): Promise<CacheEntry> {
  const key = cacheKey(major, year);
  const existing = state.pending.get(key);
  if (existing) return existing;

  const task = fetchPassRate(major, year).then((entry) => {
    state.cache.set(key, entry);
    startRefreshTimer();
    return entry;
  });
  state.pending.set(key, task);
  void task.finally(() => state.pending.delete(key)).catch(() => {});
  return task;
}

async function getCombinations(): Promise<Array<[string, string]>> {
  const [collegeRepo, departmentRepo] = await Promise.all([
    getCollegeRepository(), getDepartmentRepository(),
  ]);
  const [colleges, departments] = await Promise.all([
    collegeRepo.findAll(), departmentRepo.findAll(),
  ]);
  const majors = [...new Set([
    'none',
    ...colleges.map((college) => college.name),
    ...departments.map((department) => department.name),
  ])];
  const currentRocYear = new Date().getFullYear() - 1911;
  const years = ['none', ...Array.from(
    { length: Math.max(0, currentRocYear - 104 + 1) },
    (_, index) => String(currentRocYear - index),
  )];
  return majors.flatMap((major) => years.map((year): [string, string] => [major, year]));
}

async function refreshNextCombination() {
  if (state.refreshing) return;
  state.refreshing = true;
  try {
    const combinations = await getCombinations();
    if (combinations.length === 0) return;
    const [major, year] = combinations[state.nextCombination % combinations.length];
    state.nextCombination = (state.nextCombination + 1) % combinations.length;
    await refresh(major, year);
  } catch (error) {
    console.error('Scheduled official pass-rate refresh failed', error);
  } finally {
    state.refreshing = false;
  }
}

function startRefreshTimer() {
  if (state.timer) return;
  state.timer = setInterval(() => { void refreshNextCombination(); }, REFRESH_INTERVAL_MS);
  state.timer.unref();
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const major = params.get('major') ?? 'none';
  const year = params.get('year') ?? 'none';
  if (
    [...params.keys()].some((key) => key !== 'major' && key !== 'year') ||
    params.getAll('major').length > 1 ||
    params.getAll('year').length > 1 ||
    !major || !year || major.length > 100 ||
    (year !== 'none' && !/^\d{3}$/.test(year))
  ) {
    return NextResponse.json({ error: 'Invalid pass-rate filters' }, { status: 400 });
  }

  const cached = state.cache.get(cacheKey(major, year));
  if (cached) {
    const stale = Date.now() - cached.fetchedAt >= TTL_MS;
    if (stale) {
      void refresh(major, year).catch((error) => {
        console.error('Official pass-rate GAS request failed', { major, year, error });
      });
    }
    return NextResponse.json({ ...cached, stale }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const entry = await refresh(major, year);
    return NextResponse.json({ ...entry, stale: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Official pass-rate GAS request failed', { major, year, error });
    return NextResponse.json({ error: 'Official pass rate unavailable' }, { status: 502 });
  }
}
