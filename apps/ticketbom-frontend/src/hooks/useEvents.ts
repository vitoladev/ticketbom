import { useQuery } from '@tanstack/react-query';
import { EventType } from '../types';
import { getData } from '../lib/api';

const fetchEvents = async () => {
  // Fetch events from the API with query params page and pageSize
  const response = await getData<{ data: EventType[] }>('/events', {
    page: '1',
    pageSize: '10',
  });

  return response.data;
};

export const useEvents = () => {
  return useQuery<EventType[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};
