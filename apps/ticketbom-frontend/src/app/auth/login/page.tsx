'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
  Separator,
} from '@ticketbom/ui-kit/ui';
import Link from 'next/link';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (provider: string) => {
    setIsLoading(true);

    signIn(provider, { callbackUrl: '/' }).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <Card className="mx-auto max-w-[400px] space-y-6">
      <CardHeader>
        <CardTitle>Bem vindo ao TicketBom</CardTitle>
        <CardDescription>Faça login para acessar a plataforma</CardDescription>
      </CardHeader>

      <CardContent>
        <Separator className="my-8" />
        <div className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSignIn('google')}
          >
            <Icons.google />
            Sign in with Google
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSignIn('github')}
          >
            <Icons.gitHub />
            Sign in with GitHub
          </Button>
          <div className="mt-4 text-center text-sm">
            Não tem conta ainda?
            <Link className="underline" href="/auth/signup">
              Criar
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
