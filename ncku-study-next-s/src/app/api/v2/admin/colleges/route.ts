import { NextResponse } from 'next/server';
import { getCollegeRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAdminAuth(async () => {
  const repo = await getCollegeRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
});

export const POST = withAdminAuth(async (request) => {
  const body = await request.json();
  const repo = await getCollegeRepository();
  const data = await repo.create(body);
  return NextResponse.json(data, { status: 201 });
});
