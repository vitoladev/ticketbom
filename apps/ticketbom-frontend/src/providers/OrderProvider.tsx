'use client';

import { useState } from 'react';
import { TicketType } from '../types';
import React, { createContext, useContext } from 'react';

type OrderType = {
  [key: string]: { ticket: TicketType; count: number };
};

const useOrder = () => {
  const [order, setOrder] = useState<OrderType>({});

  const addTicketToOrder = (ticket: TicketType, count: number) => {
    setOrder((prev) => ({ ...prev, [ticket.id]: { ticket, count } }));
  };

  const removeTicketFromOrder = (ticket: TicketType) => {
    setOrder((prev) => {
      const newOrder = { ...prev };
      delete newOrder[ticket.id];
      return newOrder;
    });
  };

  const sumOrderPrice = () =>
    Object.values(order).reduce(
      (acc, { ticket, count }) => acc + ticket.price * count,
      0
    );

  return {
    order,
    addTicketToOrder,
    removeTicketFromOrder,
    sumOrderPrice,
  };
};

type OrderContextType = {
  order: OrderType;
  addTicketToOrder: (ticket: TicketType, count: number) => void;
  removeTicketFromOrder: (ticket: TicketType) => void;
  sumOrderPrice: () => number;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const orderHook = useOrder();

  return (
    <OrderContext.Provider value={orderHook}>{children}</OrderContext.Provider>
  );
};

const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export { OrderProvider, useOrderContext };
