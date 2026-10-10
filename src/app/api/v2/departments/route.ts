import { NextResponse } from 'next/server';
import { getDepartmentRepository } from '@/lib/repositories';

export const revalidate = 30;

export async function GET() {
  const repo = await getDepartmentRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
