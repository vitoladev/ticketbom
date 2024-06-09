'use client';

import React from 'react';
import { Event } from '../../../components/ui/event';
import { useEvents } from '../../hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@ticketbom/ui-kit/ui';

const Events: React.FC = () => {
  const { data, error, isPending, isError } = useEvents();

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {data?.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Events;
