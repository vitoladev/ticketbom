import React from 'react';
import { EventType } from '../../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ticketbom/ui-kit/ui';
import Link from 'next/link';
import { format } from 'date-fns';
import { HomeIcon, TimerIcon } from '@radix-ui/react-icons';

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
          <article className="flex flex-row items-center">
            <TimerIcon className="w-6 h-6 mr-2" />
            <p>{format(event.date, 'dd/MM/yyyy')}</p>
          </article>
          <article className="flex items-center">
            <HomeIcon className="w-6 h-6 mr-2" />
            <p>{event.location}</p>
          </article>
        </CardContent>
      </Card>
    </Link>
  );
};
