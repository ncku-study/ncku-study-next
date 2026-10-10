import { NextResponse } from 'next/server';
import { getAnnouncementRepository } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  const repo = await getAnnouncementRepository();
  const data = await repo.findAll();
  return NextResponse.json(data);
}
