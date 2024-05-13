/* eslint-disable @next/next/no-img-element */
import { auth } from './auth/auth';
import { LoginPage } from './auth/login/page';
import { SignOutButton, Button } from '@ticketbom/ui-kit/ui';

export default async function Home() {
  const session = await auth();
  console.log(session)
  return (
    <main className="min-h-screen bg-dark text-white flex items-center justify-center">
      {!session ? <LoginPage /> : (
        <>
        <h1>Logged in {session?.user?.name}</h1>
        <SignOutButton />
        </>
      )}
    </main>
  );
}