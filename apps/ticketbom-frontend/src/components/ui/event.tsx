import React from 'react';
import { EventType, TicketType } from '../../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ticketbom/ui-kit/ui';
import Link from 'next/link';

type EventProps = {
  event: EventType;
};

export const Event = ({ event }: EventProps) => {
  return (
    <Link href={`/event/${event.id}`} key={event.id} className="w-1/3">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Date: {event.date}</p>
          <p>Location: {event.location}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
