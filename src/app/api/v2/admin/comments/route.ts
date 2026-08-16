import { NextResponse } from 'next/server';
import { getCommentRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAdminAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const confirmParam = searchParams.get('confirm');
  const confirm = confirmParam === 'true' ? true : confirmParam === 'false' ? false : undefined;
  const repo = await getCommentRepository();
  const data = await repo.findAll({
    college: searchParams.get('college') ?? undefined,
    department: searchParams.get('department') ?? undefined,
    year: searchParams.get('year') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    confirm,
  });
  return NextResponse.json(data);
});
