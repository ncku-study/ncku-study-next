import { NextResponse } from 'next/server';
import { getCollegeRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const repo = await getCollegeRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
