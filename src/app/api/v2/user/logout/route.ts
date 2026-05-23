import { NextResponse } from 'next/server';
import { signOut } from 'next-auth';

export async function POST() {
  await signOut({ redirect: false });
  return NextResponse.json({ success: true });
}
