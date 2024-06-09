'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@ticketbom/ui-kit/ui';
import Events from './(events)/events/page';

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plataforma de gerenciamento de eventos e venda de ingressos</CardTitle>
      </CardHeader>
      <CardContent>
        <Events />
      </CardContent>
    </Card>
  );
}
