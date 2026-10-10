import { NextResponse } from 'next/server';
import { getCollegeRepository } from '@/lib/repositories';

export const revalidate = 30;

export async function GET() {
  const repo = await getCollegeRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
