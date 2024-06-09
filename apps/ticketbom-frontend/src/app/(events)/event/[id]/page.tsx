'use client';

import React from 'react';
import { useEvent } from '../../../../hooks/useEvent';
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
import Link from 'next/link';
import { useOrderContext } from '../../../../providers/OrderProvider';

const EventPage: React.FC = () => {
  const { id } = useParams();
  const { order, addTicketToOrder, removeTicketFromOrder, sumOrderPrice } =
    useOrderContext();

  const { data: event, isPending, isError, error } = useEvent(id as string);

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
              <CardTitle className="flex flex-center text-center">
                Ingressos
              </CardTitle>
              {event?.tickets.length === 0 ? (
                <CardDescription>Nenhum ingresso disponível</CardDescription>
              ) : (
                <>
                  <CardDescription>
                    Selecione a quantidade de ingressos desejada
                  </CardDescription>
                  {event?.tickets.map((ticket) => (
                    <article key={ticket.id}>
                      <Separator className="my-2" />
                      <article className="p-1 shadow-lg">
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
                            value={order[ticket.id]?.count || 0}
                            onChange={(e) => {
                              if (parseInt(e.target.value) === 0) {
                                removeTicketFromOrder(ticket);
                                return;
                              }
                              addTicketToOrder(
                                ticket,
                                parseInt(e.target.value)
                              );
                            }}
                          >
                            {[...Array(10).keys()].map((i) => (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            ))}
                          </select>
                        </div>
                      </article>
                    </article>
                  ))}
                  <section className="flex flex-col justify-between items-center">
                    <CardFooter className="flex justify-between w-full">
                      <div className="flex items-center">
                        <strong>Total:</strong>
                        <span className="ml-2">
                          {formatMoney(sumOrderPrice())}
                        </span>
                      </div>
                    </CardFooter>
                    <div>
                      <Button variant="outline" asChild>
                        <Link href="/order">Comprar</Link>
                      </Button>
                    </div>
                  </section>
                </>
              )}
            </CardContent>
          </section>
        </>
      )}
      {isError && <span>Error: {error.message}</span>}
    </Card>
  );
};

export default EventPage;
