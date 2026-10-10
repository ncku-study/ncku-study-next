import { NextResponse } from 'next/server';
import { getPublicColleges } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicColleges();
  return NextResponse.json(data);
}
