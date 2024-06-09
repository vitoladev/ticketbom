'use client';

import React from 'react';
import { useOrderContext } from '../../providers/OrderProvider';
import { formatMoney } from '../../lib/money';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@ticketbom/ui-kit/ui';
import { useUser } from '../../providers/UserProvider';
import { signIn } from 'next-auth/react';

const OrderPage: React.FC = () => {
  const { order, sumOrderPrice } = useOrderContext();
  const { user } = useUser();

  if (!user) {
    signIn('cognito', { callbackUrl: '/order' });
  }

  const orderPrice = sumOrderPrice();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center mb-2">Compra</CardTitle>
        <Separator />
        <CardDescription>
          {orderPrice === 0
            ? 'Nenhum ingresso selecionado no momento, volte a página do evento'
            : 'Confira os ingressos selecionados'}
        </CardDescription>
      </CardHeader>
      {!user && (
        <CardContent>
          Você precisa estar logado para finalizar a compra
        </CardContent>
      )}

      {orderPrice > 0 && (
        <>
          <CardContent className="flex flex-col">
            <ul>
              {Object.values(order).map((item) => (
                <li key={item.ticket.id}>
                  <b>{item.ticket.title}</b> - {item.count}x
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <CardTitle>Total: {formatMoney(orderPrice)}</CardTitle>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button variant="outline">Finalizar compra</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default OrderPage;
