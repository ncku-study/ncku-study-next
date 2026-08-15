import { NextResponse } from 'next/server';
import { getCommentRepository } from '@/lib/repositories';
import { auth } from '@/auth';

export async function POST(request: Request) {
  const body = await request.json();
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
  const confirmParam = searchParams.get('confirm');

  // Requesting unconfirmed (pending) items requires admin auth
  if (confirmParam === 'false') {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const confirm =
    confirmParam === 'true' ? true : confirmParam === 'false' ? false : undefined;

  const repo = await getCommentRepository();
  const data = await repo.findAll({ college, department, year, category, confirm });
  return NextResponse.json(data);
}
