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
} from '@ticketbom/ui-kit/ui';

const OrderPage: React.FC = () => {
  const { order, sumOrderPrice } = useOrderContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center mb-2">Compra</CardTitle>
        <CardDescription>Confira os ingressos selecionados</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ul>
          {Object.values(order).map((item) => (
            <li key={item.ticket.id}>
              <b>{item.ticket.title}</b> - {item.count}x
            </li>
          ))}
        </ul>
        <h2>Total: {formatMoney(sumOrderPrice())}</h2>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button>Finalizar compra</Button>
      </CardFooter>
    </Card>
  );
};

export default OrderPage;
