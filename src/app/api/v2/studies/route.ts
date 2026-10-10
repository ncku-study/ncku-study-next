import { NextResponse } from 'next/server';
import { getStudyRepository } from '@/lib/repositories';
import { notifyNewStudy } from '@/lib/discord';
import { normalizeStudySubmission } from '@/lib/study-submission';
import { getPublicStudies } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let submission: ReturnType<typeof normalizeStudySubmission>;
  try {
    submission = normalizeStudySubmission(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : '送出的資料格式錯誤';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const repo = await getStudyRepository();
  const data = await repo.create(submission);

  try {
    await notifyNewStudy(data);
  } catch (error) {
    console.error('Unable to send new study notification', error);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const year = searchParams.get('year') ?? undefined;
  const data = await getPublicStudies(category, year);
  return NextResponse.json(data);
}
