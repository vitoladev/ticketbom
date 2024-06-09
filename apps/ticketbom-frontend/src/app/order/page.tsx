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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingresso</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(order).map((item) => (
                  <TableRow key={item.ticket.id}>
                    <TableCell className="font-medium">
                      {item.ticket.title}
                    </TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{formatMoney(item.ticket.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col">
            <CardTitle>Total: {formatMoney(orderPrice)}</CardTitle>
            <Separator className="my-3" />
            <Button variant="outline">Finalizar compra</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default OrderPage;
