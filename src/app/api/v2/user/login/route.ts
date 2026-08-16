import { NextResponse } from 'next/server';
import { getUserRepository } from '@/lib/repositories';
import { verifyPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const repo = await getUserRepository();
  const user = await repo.findByEmail(body.email);

  if (!user || !(await verifyPassword(body.password, user.password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ remember_token: 'authenticated' });
}
