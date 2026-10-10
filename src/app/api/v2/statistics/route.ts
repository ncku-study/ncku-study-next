import { NextResponse } from 'next/server';
import { getStatisticRepository } from '@/lib/repositories';

export const revalidate = 30;

export async function GET() {
  const repo = await getStatisticRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
