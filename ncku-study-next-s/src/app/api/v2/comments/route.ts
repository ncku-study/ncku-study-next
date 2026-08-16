import { NextResponse } from 'next/server';
import { getCommentRepository } from '@/lib/repositories';
import { notifyNewComment } from '@/lib/discord';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json();
  await notifyNewComment(body);
  const repo = await getCommentRepository();
  const data = await repo.create({ ...body, confirm: false });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const college = searchParams.get('college') ?? undefined;
  const department = searchParams.get('department') ?? undefined;
  const year = searchParams.get('year') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const repo = await getCommentRepository();
  const data = await repo.findAll({ college, department, year, category, confirm: true });
  return NextResponse.json(data);
}
