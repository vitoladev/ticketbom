'use client';

import { signIn } from 'next-auth/react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@ticketbom/ui-kit/ui';

const LoginPage = () => {
  const handleSignIn = async () => {
    await signIn('cognito', { callbackUrl: '/' });
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
            onClick={() => handleSignIn()}
          >
            Log in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
