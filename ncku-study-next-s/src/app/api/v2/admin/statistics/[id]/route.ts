import { NextResponse } from 'next/server';
import { getStatisticRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Context = { params: Promise<{ id: string }> };

export const PUT = withAdminAuth<Context>(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const repo = await getStatisticRepository();
  const item = await repo.update(id, body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const DELETE = withAdminAuth<Context>(async (_request, { params }) => {
  const { id } = await params;
  const repo = await getStatisticRepository();
  await repo.delete(id);
  return new NextResponse(null, { status: 204 });
});
