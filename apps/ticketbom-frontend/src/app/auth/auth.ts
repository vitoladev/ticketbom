import NextAuth from 'next-auth';
// import { users } from '@ticketbom/database';
import CognitoProvider from 'next-auth/providers/cognito';
// import { DrizzleAdapter } from '@auth/drizzle-adapter';
// import { eq } from 'drizzle-orm';
// import { db } from '../../lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: DrizzleAdapter(db),
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
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
