import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/db';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) return null;

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { role: string; id: string; organizationId: string | null };
        token.role = u.role;
        token.id = u.id;
        token.organizationId = u.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as { id: string; role: string; organizationId: string | null };
        u.id = token.id as string;
        u.role = token.role as string;
        u.organizationId = (token.organizationId as string) ?? null;
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

// Helper to get typed session user
export async function getAuthUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as {
    id: string;
    role: string;
    email: string;
    organizationId: string | null;
  };
}
