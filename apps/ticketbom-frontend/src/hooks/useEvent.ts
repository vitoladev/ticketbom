import { useQuery } from '@tanstack/react-query';
import { EventType, TicketType } from '../types';
import { getData } from '../lib/api';

interface EventWithTickets extends EventType {
  tickets: TicketType[];
}

export const fetchEvent = async (id: string) => {
  const response = await getData<EventWithTickets>(`/events/${id}`);
  return response;
};

export const useEvent = (id: string) => {
  return useQuery<EventWithTickets>({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
  });
};
