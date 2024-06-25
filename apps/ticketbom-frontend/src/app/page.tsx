'use client';

import { CardHeader, CardTitle } from '@ticketbom/ui-kit/ui';
import Events from './(events)/events/page';

export default function Home() {
  return (
    <section>
      <CardHeader>
        <CardTitle>
          Plataforma de gerenciamento de eventos e venda de ingressos
        </CardTitle>
      </CardHeader>
      <Events />
    </section>
  );
}
