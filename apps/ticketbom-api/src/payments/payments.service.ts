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

  async createProduct({
    id,
    title,
    price,
    quantity,
  }: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }) {
    const preferenceEndpoint = new Preference(this.client);
    const preference = await preferenceEndpoint.create({
      body: {
        items: [
          {
            id,
            title: title,
            quantity,
            currency_id: 'BRL',
            unit_price: price,
          },
        ],
      },
    });

    return preference;
  }
}
