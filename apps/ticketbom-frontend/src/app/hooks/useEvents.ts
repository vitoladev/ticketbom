import { useQuery } from '@tanstack/react-query';
import { EventType } from '../../types';

const fetchEvents = async () => {
  const response = await fetch('http://localhost:3000/api/events');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const result = await response.json();
  console.log({ result })

  return result.data;
};

export const useEvents = () => {
  return useQuery<EventType[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};
