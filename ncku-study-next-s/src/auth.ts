import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserRepository } from '@/lib/repositories';

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const repo = await getUserRepository();
        const user = await repo.findByEmail(credentials.email as string);
        if (!user) return null;
        // Plain string comparison (mock uses plain passwords)
        if (user.password !== credentials.password) return null;
        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
});
