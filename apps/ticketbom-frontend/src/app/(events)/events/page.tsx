'use client';

import React from 'react';
import { Event } from '../../../components/ui/event';
import { useEvents } from '../../hooks/useEvents';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
} from '@ticketbom/ui-kit/ui';

const Events: React.FC = () => {
  const { data, error, isPending, isError } = useEvents();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center mb-2">Events</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {isPending && <SkeletonCard />}
        {isError && <span>Error: {error.message}</span>}
        {data?.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Events;
