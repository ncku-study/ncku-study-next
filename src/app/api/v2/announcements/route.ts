import { NextResponse } from 'next/server';
import { getPublicAnnouncements } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicAnnouncements();
  return NextResponse.json(data);
}
