import { NextResponse } from 'next/server';
import { getPublicStudy } from '@/lib/public-cache';

export const revalidate = 30;

export function generateStaticParams() {
  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getPublicStudy(id);
  if (!item || item.confirm !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}
