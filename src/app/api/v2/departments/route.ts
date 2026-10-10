import { NextResponse } from 'next/server';
import { getPublicDepartments } from '@/lib/public-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicDepartments();
  return NextResponse.json(data);
}
