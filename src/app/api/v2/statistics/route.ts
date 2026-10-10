import { NextResponse } from 'next/server';
import { getPublicStatistics } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicStatistics();
  return NextResponse.json(data);
}
