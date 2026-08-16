import { NextResponse } from 'next/server';
import { getAnnouncementRepository } from '@/lib/repositories';
import { withAdminAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAdminAuth(async () => {
  const repo = await getAnnouncementRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
});
