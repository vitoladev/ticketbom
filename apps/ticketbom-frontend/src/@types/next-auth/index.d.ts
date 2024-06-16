import { DefaultSession } from 'next-auth';

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
