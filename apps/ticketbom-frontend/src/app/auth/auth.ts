import NextAuth from 'next-auth';
import { users } from '@ticketbom/database';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { eq } from 'drizzle-orm';
import { db } from '../../lib/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-user',
    signOut: '/auth/logout',
    verifyRequest: '/auth/verify-request',
  },
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, token.email || ''))
        .limit(1)
        .then((res) => res[0]);

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
});
