import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    await signOut({ redirect: false });
  } catch {
    // Thin compatibility wrapper; session clearing is handled by AuthJS sign-out flow.
  }

  return NextResponse.json({ success: true });
}
