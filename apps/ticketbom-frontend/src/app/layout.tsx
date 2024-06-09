import './global.css';
import Footer from '../components/ui/footer';
import React from 'react';
import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { OrderProvider } from '../providers/OrderProvider';
import Nav from '../components/ui/nav';
import { auth } from './auth/auth';

export const metadata = {
  title: 'TicketBom',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <Nav
          user={{
            name: session?.user?.name || '',
            image: session?.user?.image || '',
          }}
        />
        <ReactQueryProvider>
          <OrderProvider>{children}</OrderProvider>
        </ReactQueryProvider>
        <Footer />
      </body>
    </html>
  );
}
