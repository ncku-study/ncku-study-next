import { NextResponse } from 'next/server';
import { getCategoryRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  const repo = await getCategoryRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
