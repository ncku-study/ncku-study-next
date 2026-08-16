import { NextResponse } from 'next/server';
import { getAnnouncementRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Context = { params: Promise<{ id: string }> };

export const PUT = withAdminAuth<Context>(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const repo = await getAnnouncementRepository();
  const item = await repo.update(parseInt(id, 10), body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});
