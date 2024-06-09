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
    setOrder((prev) => {
      if (prev && prev[ticket.id]) {
        return {
          ...prev,
          [ticket.id]: { ticket, count: prev[ticket.id].count + count },
        };
      } else {
        return { ...prev, [ticket.id]: { ticket, count } };
      }
    });
  };

  return {
    order,
    addTicketToOrder,
  };
};

type OrderContextType = {
  order: OrderType;
  addTicketToOrder: (ticket: TicketType, count: number) => void;
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
