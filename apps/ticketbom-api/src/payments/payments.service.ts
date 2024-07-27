import { convertCentsToFullAmount } from '@common/utils/money';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Service for handling payments related operations integrating with MercadoPago
@Injectable()
export class PaymentsService {
  client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000, idempotencyKey: randomUUID() },
    });
  }

  async createPaymentIntent({
    externalReference,
    items,
  }: {
    externalReference: string;
    items: {
      id: string;
      title: string;
      price: number;
      quantity: number;
    }[]
  }) {
    const preferenceEndpoint = new Preference(this.client);
    const preference = await preferenceEndpoint.create({
      body: {
        external_reference: externalReference,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          unit_price: convertCentsToFullAmount(item.price),
          currency_id: 'BRL',
          quantity: item.quantity,
        }))
        },
    });

    return preference;
  }
}
