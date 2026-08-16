import { NextResponse } from 'next/server';
import { getCommentRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Context = { params: Promise<{ id: string }> };

export const GET = withAdminAuth<Context>(async (_request, { params }) => {
  const { id } = await params;
  const repo = await getCommentRepository();
  const item = await repo.findById(parseInt(id, 10));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const PUT = withAdminAuth<Context>(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const repo = await getCommentRepository();
  const item = await repo.update(parseInt(id, 10), body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const PATCH = withAdminAuth<Context>(async (_request, { params }) => {
  const { id } = await params;
  const repo = await getCommentRepository();
  const item = await repo.confirm(parseInt(id, 10));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const DELETE = withAdminAuth<Context>(async (_request, { params }) => {
  const { id } = await params;
  const repo = await getCommentRepository();
  await repo.delete(parseInt(id, 10));
  return new NextResponse(null, { status: 204 });
});
