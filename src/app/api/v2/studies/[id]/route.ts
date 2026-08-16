import { NextResponse } from 'next/server';
import { getStudyRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const repo = await getStudyRepository();
  const item = await repo.findById(id);
  if (!item || item.confirm !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}
