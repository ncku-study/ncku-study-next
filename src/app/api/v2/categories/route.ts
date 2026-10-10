import { NextResponse } from 'next/server';
import { getPublicCategories } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicCategories();
  return NextResponse.json(data);
}
