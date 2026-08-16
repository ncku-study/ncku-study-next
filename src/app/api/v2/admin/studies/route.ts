import { NextResponse } from 'next/server';
import { getStudyRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAdminAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const confirmParam = searchParams.get('confirm');
  const confirm = confirmParam === 'true' ? true : confirmParam === 'false' ? false : undefined;
  const repo = await getStudyRepository();
  const data = await repo.findAll({
    category: searchParams.get('category') ?? undefined,
    year: searchParams.get('year') ?? undefined,
    confirm,
  });
  return NextResponse.json(data);
});
