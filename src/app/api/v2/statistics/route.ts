import { NextResponse } from 'next/server';
import { getStatisticRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  const repo = await getStatisticRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
