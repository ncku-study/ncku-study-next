import { NextResponse } from 'next/server';
import { getStudyRepository } from '@/lib/repositories';
import { notifyNewStudy } from '@/lib/discord';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json();
  await notifyNewStudy(body);
  const repo = await getStudyRepository();
  const data = await repo.create({ ...body, confirm: false });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const year = searchParams.get('year') ?? undefined;
  const repo = await getStudyRepository();
  const data = await repo.findAll({ category, year, confirm: true });
  return NextResponse.json(data);
}
