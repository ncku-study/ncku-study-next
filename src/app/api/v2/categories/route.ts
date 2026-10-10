import { NextResponse } from 'next/server';
import { getCategoryRepository } from '@/lib/repositories';

export const revalidate = 30;

export async function GET() {
  const repo = await getCategoryRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
