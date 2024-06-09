'use client';

import React, { useState } from 'react';
import { useEvent } from '../../../hooks/useEvent';
import { useParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SkeletonCard,
  CardDescription,
  Separator,
  Button,
  CardFooter,
} from '@ticketbom/ui-kit/ui';
import { TimerIcon, HomeIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { formatMoney } from '../../../../lib/money';
import { TicketType } from '../../../../types';

const EventPage: React.FC = () => {
  const { id } = useParams();
  const [ticketOrder, setTicketOrder] = useState<{
    [key: string]: { ticket: TicketType; count: number };
  }>({});

  const { data: event, isPending, isError, error } = useEvent(id as string);

  const handleTicketOrder = (ticket: TicketType, count: number) => {
    setTicketOrder((prev) => {
      if (prev[ticket.id]) {
        return {
          ...prev,
          [ticket.id]: { ticket, count },
        };
      } else {
        return { ...prev, [ticket.id]: { ticket, count } };
      }
    });
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-col justify-between items-center text-center">
        <CardTitle className="text-center mb-2">{event?.title}</CardTitle>
        <CardDescription>{event?.description}</CardDescription>
      </CardHeader>
      {isPending && <SkeletonCard />}
      {event && (
        <>
          <section className="flex flex-col justify-between">
            <CardContent className="flex mb-5">
              <article className="flex my-2 items-center">
                <TimerIcon className="w-6 h-6 mr-2" />
                <p>{format(event.date, 'dd/MM/yyyy')}</p>
              </article>
            </CardContent>
            <CardContent className="flex mb-5">
              <div className="flex my-5 items-center">
                <HomeIcon className="w-6 h-6 mr-2" />
                <p>{event.location}</p>
              </div>
            </CardContent>
            <CardContent>
              <CardTitle>Ingressos</CardTitle>
              {event?.tickets.map((ticket) => (
                <>
                  <Separator className="my-4" />
                  <article className="p-2 shadow-lg" key={ticket.id}>
                    <h1>{ticket.title}</h1>
                    <CardDescription>
                      {formatMoney(ticket.price)}
                    </CardDescription>
                    <div>
                      <label htmlFor={`ticket-quantity-${ticket.id}`}>
                        Quantidade:{' '}
                      </label>
                      <select
                        id={`ticket-quantity-${ticket.id}`}
                        value={ticketOrder[ticket.id]?.count || 0}
                        onChange={(e) =>
                          handleTicketOrder(ticket, parseInt(e.target.value))
                        }
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                </>
              ))}
            </CardContent>
          </section>
          <section className="flex flex-col justify-between items-center">
            <CardFooter className="flex justify-between w-full">
              <div className="flex items-center">
                <strong>Total:</strong>
                <span className="ml-2">
                  {formatMoney(
                    Object.values(ticketOrder).reduce(
                      (acc, { ticket, count }) => acc + ticket.price * count,
                      0
                    )
                  )}
                </span>
              </div>
            </CardFooter>
            <div>
              <Button>Comprar</Button>
            </div>
          </section>
        </>
      )}
      {isError && <span>Error: {error.message}</span>}
    </Card>
  );
};

export default EventPage;
