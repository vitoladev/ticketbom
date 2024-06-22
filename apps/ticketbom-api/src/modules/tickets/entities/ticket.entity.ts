export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  CANCELLED = 'CANCELLED',
}

export class TicketEntity {
  id: string;
  title: string;
  eventId: string;
  price: number;
  quantityTotal: number;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED';
}