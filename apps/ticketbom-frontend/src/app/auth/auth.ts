import NextAuth from 'next-auth';
// import { users } from '@ticketbom/database';
import CognitoProvider from 'next-auth/providers/cognito';
// import { DrizzleAdapter } from '@auth/drizzle-adapter';
// import { eq } from 'drizzle-orm';
// import { db } from '../../lib/db';

// Extend the Session interface
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
    };
  }

  interface JWT {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // signIn: '/auth/login',
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
    async jwt({ token, account }) {
      console.log({ token, account });
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log({ session, token });
      session.user.id = token.sub || '';
      session.user.accessToken = token.idToken as string;
      return session;
    },
  },
});
