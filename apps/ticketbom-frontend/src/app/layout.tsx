import './global.css';
import Footer from '../components/ui/footer';
import React from 'react';
import { ReactQueryProvider } from '../providers/ReactQueryProvider';

export const metadata = {
  title: 'TicketBom',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Footer />
      </body>
    </html>
  );
}
