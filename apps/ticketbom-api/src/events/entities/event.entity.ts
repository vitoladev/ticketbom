export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

export class EventEntity {
  title: string;
  description: string;
  date: string;
  status: EventStatus;
  location: string;
  organizerId?: string;
}
