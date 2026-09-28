import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserRepository } from '@/lib/repositories';
import { verifyPassword } from '@/lib/password';

export const { auth, signIn, signOut, handlers } = NextAuth({
  // Requests arrive through the EC2 Nginx reverse proxy, outside the hosts
  // Auth.js trusts automatically (such as Vercel). Nginx is the trusted edge.
  trustHost: true,
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
        if (!(await verifyPassword(credentials.password as string, user.password))) return null;
        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
});
