import { NextResponse } from 'next/server';
import { getCommentRepository } from '@/lib/repositories';

export async function POST(request: Request) {
  const body = await request.json();
  const repo = await getCommentRepository();
  const data = await repo.create({ ...body, confirm: false });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department') ?? undefined;
  const year = searchParams.get('year') ?? undefined;
  const confirmParam = searchParams.get('confirm');
  const confirm =
    confirmParam === 'true' ? true : confirmParam === 'false' ? false : undefined;

  const repo = await getCommentRepository();
  const data = await repo.findAll({ department, year, confirm });
  return NextResponse.json(data);
}
