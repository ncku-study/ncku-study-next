import { NextResponse } from 'next/server';
import { getDepartmentRepository } from '@/lib/repositories';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const repo = await getDepartmentRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const repo = await getDepartmentRepository();
  const data = await repo.create(body);
  return NextResponse.json(data, { status: 201 });
}
