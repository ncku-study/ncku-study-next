import { NextResponse } from 'next/server';
import { getUserRepository } from '@/lib/repositories';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const repo = await getUserRepository();
  const user = await repo.findByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ remember_token: user.email });
}
