import './global.css';
import Footer from '../components/ui/footer';
import React from 'react';
import Nav from '../components/ui/nav';
import { Providers } from '../providers';

export const metadata = {
  title: 'TicketBom',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-dvh">
        <Providers>
          <main>
            <Nav />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
