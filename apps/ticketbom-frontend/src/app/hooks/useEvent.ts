import { useQuery } from "@tanstack/react-query";
import { EventType } from "../../types";

export const fetchEvent = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/events/${id}`);
  const data = await response.json();
  return data;
};

export const useEvent = (id: string) => {
  return useQuery<EventType>({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
  });
};
