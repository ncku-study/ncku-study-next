import { NextResponse } from 'next/server';
import { getDepartmentRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const repo = await getDepartmentRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
